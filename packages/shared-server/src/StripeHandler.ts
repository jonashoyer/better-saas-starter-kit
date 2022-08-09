import { StripeSubscription, PrismaClient, StripeInvoice, StripePriceType, StripeSubscriptionStatus, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { StripeMetadata } from 'shared';
import Stripe from 'stripe'
import { projectService } from './services';

// https://egghead.io/blog/saas-app-with-nextjs-prisma-auth0-and-stripe

// TODO: https://stripe.com/docs/billing/subscriptions/metered
// TODO: https://stripe.com/docs/payments/save-and-reuse?platform=web

export const secondsToDate = (sec: number) => {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(sec);
  return t;
};

export class StripeHandler {

  stripe: Stripe;
  prisma: PrismaClient;

  constructor(stripe: Stripe, prisma: PrismaClient) {
    this.stripe = stripe;
    this.prisma = prisma;
  }

  async upsertCustomer(projectId: string, params?: Stripe.CustomerCreateParams, options?: Stripe.RequestOptions) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { stripeCustomerId: true } });
    if (!project) throw new Error(`Project not found by id (${projectId})!`)
    if (project.stripeCustomerId) return project.stripeCustomerId;
    const customer = await this.createCustomer({ ...params, metadata: { ...params?.metadata, projectId } }, options);
    return customer.id;
  }

  async mangeCustomerUpdate(customer: Stripe.Customer) {
    const defaultPaymentMethodId = StripeHandler.getStripeId(customer.invoice_settings.default_payment_method);

    const project = await this.prisma.project.findUnique({ where: { stripeCustomerId: customer.id }, select: { id: true, stripeCustomerId: true } });
    if (!project) throw new Error(`Project not found with stripe customer id (${customer.id})!`);

    await this.prisma.$transaction([
      this.prisma.stripePaymentMethod.updateMany({
        where: { ...(defaultPaymentMethodId && { id: { not: defaultPaymentMethodId } }), projectId: project.id, isDefault: true },
        data: { isDefault: false },
      }),
      ...(defaultPaymentMethodId ?
        [
          this.prisma.stripePaymentMethod.update({
            where: { id: defaultPaymentMethodId },
            data: { isDefault: true },
          })
        ]
      : []),
    ]);
    
  }

  createCustomer(params?: Stripe.CustomerCreateParams & { metadata: { projectId: string } }, options?: Stripe.RequestOptions) {
    return this.stripe.customers.create(params, options);
  }

  updateCustomer(id: string, params: Stripe.CustomerUpdateParams, options?: Stripe.RequestOptions) {
    return this.stripe.customers.update(id, params, options);
  }

  deleteCustomer(id: string, options?: Stripe.RequestOptions) {
    return this.stripe.customers.del(id, options);
  }

  createPaymentMethod(params?: Stripe.PaymentMethodCreateParams & { metadata: { projectId: string } }, options?: Stripe.RequestOptions) {
    return this.stripe.paymentMethods.create(params, options);
  }

  createUsageRecord(subscriptionItemId: string, params: Stripe.UsageRecordCreateParams, options?: Stripe.RequestOptions) {
    return this.stripe.subscriptionItems.createUsageRecord(subscriptionItemId, params, options);
  }
  fetchProductList() {
    return this.stripe.products.list({
      active: true,
      expand: ['data.price'],
    })
  }
  fetchPriceList() {
    return this.stripe.prices.list({
      active: true,
    })
  }

  upsertProductRecord(product: Stripe.Product) {

    const productData = {
      id: product.id,
      active: product.active,
      name: product.name,
      image: product.images?.[0] ?? null,
      metadata: StripeHandler.formatMetadata(product.metadata)!,
    };

    return this.prisma.stripeProduct.upsert({
      create: productData,
      update: productData,
      where: {
        id: product.id,
      }
    })
  };

  upsertPriceRecord(price: Stripe.Price) {
    const priceData = {
      id: price.id,
      stripeProductId: typeof price.product == 'string' ? price.product : price.product.id,
      active: price.active,
      currency: price.currency,
      type: price.type.toUpperCase() as StripePriceType,
      unitAmount: price.unit_amount,
      interval: price.recurring?.interval ?? null,
      intervalCount: price.recurring?.interval_count ?? null,
      trialPeriodDays: price.recurring?.trial_period_days ?? null,
      metadata: price.metadata,
    };

    return this.prisma.stripePrice.upsert({
      create: priceData,
      update: priceData,
      where: { id: price.id }
    })
  };

  /**
   * Copies the billing details from the payment method to the customer object.
   */
  //  async copyBillingDetailsToCustomer (userId: string, paymentMethod: Stripe.PaymentMethod) {
  //   const customer = paymentMethod.customer;
  //   const customerId = typeof customer == 'string' ? customer : customer?.id;
  //   if (!customerId) return;

  //   const { name, phone, address } = paymentMethod.billing_details;
  //   await this.stripe.customers.update(customerId, { name, phone, address });

  //   await this.prisma.user.update({
  //     data: {
  //       billing_address: address,
  //       payment_method: paymentMethod[paymentMethod.type]
  //     }
  //   })

  //   const { error } = await supabaseAdmin
  //     .from('users')
  //     .update({
  //       billing_address: address,
  //       payment_method: paymentMethod[paymentMethod.type]
  //     })
  //     .eq('id', uuid);

  //   if (error) throw error;
  // };

  static formatStripeSubscription(s: Stripe.Subscription): Omit<StripeSubscription, 'projectId' | 'metadata'> & { metadata: {} } {
    const upcoming = StripeHandler.getUpcomingPhase(s.schedule as Stripe.SubscriptionSchedule | null);
    return {
      id: s.id,
      metadata: StripeHandler.formatMetadata(s.metadata)!,
      status: s.status.toUpperCase() as StripeSubscriptionStatus,
      stripePriceId: s.items.data[0].price.id,

      quantity: s.items.data[0].quantity ?? 1,
      cancelAtPeriodEnd: s.cancel_at_period_end,
      cancelAt: s.cancel_at ? secondsToDate(s.cancel_at) : null,
      canceledAt: s.canceled_at ? secondsToDate(s.canceled_at) : null,
      currentPeriodStart: secondsToDate(s.current_period_start),
      currentPeriodEnd: secondsToDate(s.current_period_end),
      created: secondsToDate(s.created),
      endedAt: s.ended_at ? secondsToDate(s.ended_at) : null,
      startDate: secondsToDate(s.start_date),

      upcomingStripePriceId: null,
      upcomingQuantity: null,
      upcomingStartDate: null,

      ...(upcoming && ({
        upcomingStripePriceId: StripeHandler.getStripeId(upcoming.items[0].price),
        upcomingQuantity: upcoming.items[0].quantity ?? 1,
        upcomingStartDate: secondsToDate(upcoming.start_date),
      })),
    };
  }

  async createSubscription(stripeCustomerId: string, priceId: string, quantity: number) {

    const subscription = await this.stripe.subscriptions.create({
      customer: stripeCustomerId,
      billing_cycle_anchor: dayjs().startOf('month').add(1, 'month').unix(),
      items: [
        { price: priceId, quantity },
      ],
      expand: ['latest_invoice.payment_intent', 'plan.product'],
    });

    return StripeHandler.formatStripeSubscription(subscription);
  }

  async updateSubscription(stripeSubscriptionId: string, priceId: string, quantity: number, beginAtNextPeriod?: boolean) {

    const subscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);

    const currentPriceId = subscription.items.data[0].price.id;


    // Create a schedule if it does not exists
    if (currentPriceId == priceId) {
      const updatedSubscription = await this.stripe.subscriptions.update(stripeSubscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            quantity,
          },
        ],
      });
      return StripeHandler.formatStripeSubscription(updatedSubscription);
    }

    if (!beginAtNextPeriod) {
      const updatedSubscription = await this.stripe.subscriptions.update(stripeSubscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            deleted: true,
          },
          {
            price: priceId,
            quantity,
          },
        ],
      });
      return StripeHandler.formatStripeSubscription(updatedSubscription);
    }

    const schedule = await this.getSubscriptionSchedule(subscription);
    const previousPhases = schedule.phases
      .filter(e => e.end_date < (Date.now() / 1000))
      .map(({ items, start_date, end_date }) => ({
        items: items as any,
        start_date,
        end_date,
      }));

      console.dir({
        phases: [
          ...previousPhases,
          {
            items: [{ price: subscription.items.data[0].price.id, quantity: subscription.items.data[0].quantity, }],
            start_date: subscription.current_period_start,
            end_date: subscription.current_period_end,
          }, {
            items: [{ price: priceId, quantity }],
            start_date: subscription.current_period_end,
          }
        ],
      }, { depth: 5 });

    const updatedSubscriptionSchedule = await this.stripe.subscriptionSchedules.update(schedule.id, {
      proration_behavior: 'none',
      phases: [
        ...previousPhases,
        {
          items: [{ price: subscription.items.data[0].price.id, quantity: subscription.items.data[0].quantity, }],
          start_date: previousPhases[previousPhases.length - 1]?.end_date ?? subscription.current_period_start,
          end_date: subscription.current_period_end,
        }, {
          items: [{ price: priceId, quantity }],
          start_date: subscription.current_period_end,
        }
      ],
    });

    const updatedSubscription = typeof updatedSubscriptionSchedule.subscription == 'string' ? (await this.stripe.subscriptions.retrieve(updatedSubscriptionSchedule.subscription)) : updatedSubscriptionSchedule.subscription!;
    return StripeHandler.formatStripeSubscription(updatedSubscription);

  }

  async upsertSubscription(
    subscription: any,
  ) {

    const project = await this.prisma.project.findUnique({
      where: { stripeCustomerId: subscription.customer }
    });

    if (!project) {
      throw new Error(`Stripe customer not found! (id: ${subscription.customer})`);
    }

    if (subscription.items.data.length > 1) {
      console.warn('Subscription containes more then one item!');
    }

    const subscriptionData: any = {
      ...StripeHandler.formatStripeSubscription(subscription),
      projectId: project.id,
    };

    return await this.prisma.stripeSubscription.upsert({
      create: subscriptionData,
      update: subscriptionData,
      where: { id: subscriptionData.id },
    });

    // const unix = new Date().getTime() / 1000;

    // if (product && product.metadata?.type && (!subscription.ended_at || unix < subscription.ended_at) && unix >= subscription.start_date) {
    //   await this.prisma.project.update({
    //     where: { stripeCustomerId: subscription.customer },
    //     data: { subscriptionPlan: product.metadata.type as any },
    //   })
    // }

    // // For a new subscription copy the billing details to the customer object.
    // // NOTE: This is a costly operation and should happen at the very end.
    // if (createAction && subscription.default_payment_method)
    //   await copyBillingDetailsToCustomer(
    //     uuid,
    //     subscription.default_payment_method
    //   );
  };

  async cancelSubscriptionDowngrade(stripeSubscriptionId: string, preapply = false) {
    
    const subscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
    const schedule = await this.getSubscriptionSchedule(subscription);

    const upcoming = StripeHandler.getUpcomingPhase(schedule);
    if (!upcoming) throw new Error(`No upcoming subscription found!`);

    const previousPhases = schedule.phases
      .filter(e => e.end_date < (Date.now() / 1000))
      .map(({ items, start_date, end_date }) => ({
        items: items as any,
        start_date,
        end_date,
      }));

      console.dir({
        phases: [
          ...previousPhases,
          {
            items: [{ price: subscription.items.data[0].price.id, quantity: subscription.items.data[0].quantity }],
            start_date: subscription.current_period_start,
          }
        ],
      }, { depth: 5 });



    await this.stripe.subscriptionSchedules.update(schedule.id, {
      proration_behavior: 'none',
      phases: [
        ...previousPhases,
        {
          items: [{ price: subscription.items.data[0].price.id, quantity: subscription.items.data[0].quantity }],
          start_date: previousPhases[previousPhases.length - 1]?.end_date ?? subscription.current_period_start,
        }
      ],
    });

    if (preapply) {
      await this.prisma.stripeSubscription.update({
        where: { id: subscription.id },
        data: {
          upcomingQuantity: null,
          upcomingStripePriceId: null,
          upcomingStartDate: null,
        }
      });
    }

    const newSubscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
    return StripeHandler.formatStripeSubscription(newSubscription);
  }

  async cancelSubscription(subscriptionId: string) {
    const subscription = await this.stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
    return StripeHandler.formatStripeSubscription(subscription);
  }

  async keepSubscription(subscriptionId: string) {
    const subscription = await this.stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: false });
    return StripeHandler.formatStripeSubscription(subscription);
  }

  async subscriptionScheduleUpdate(stripeSubscriptionSchedule: Stripe.SubscriptionSchedule) {
    const subscriptionId = StripeHandler.getStripeId(stripeSubscriptionSchedule.subscription);
    if (!subscriptionId) throw new Error(`No upcoming subscription found!`);
    const upcoming = StripeHandler.getUpcomingPhase(stripeSubscriptionSchedule);

    return await this.prisma.stripeSubscription.update({
      where: { id: subscriptionId },
      data: {
        upcomingStripePriceId: null,
        upcomingQuantity: null,
        upcomingStartDate: null,

        ...(upcoming && ({
          upcomingStripePriceId: StripeHandler.getStripeId(upcoming.items[0].price),
          upcomingQuantity: upcoming.items[0].quantity ?? 1,
          upcomingStartDate: secondsToDate(upcoming.start_date),
        })),
      },
    });
  }

  async purchasePriceItems(projectId: string, items: ({ priceId: string, description?: string, metadata?: Stripe.MetadataParam, quantity?: number })[], description?: string, metadata?: Stripe.MetadataParam) {

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        purchasedProducts: true,
      },
    });

    if (!project) {
      throw new Error(`Project not found! (id: ${projectId})`);
    }

    const productPrices = await this.prisma.stripePrice.findMany({
      where: {
        id: { in: items.map(e => e.priceId) },
      },
      include: {
        stripeProduct: true,
      },
    });

    items.forEach(e => {
      if (!productPrices.some(x => x.id == e.priceId)) throw new Error(`Product was not found with price id (${e.priceId})`);
    });

    const qtyInitial = project.purchasedProducts.reduce((obj, e) => ({
      ...obj,
      [e.stripeProductId]: (obj[e.stripePriceId] ?? 0) + e.quantity,
    }), {} as Record<string, number>);

    const productQty = items.reduce((obj, e) => {
      const prod = productPrices.find(x => x.id == e.priceId)?.stripeProduct;
      if (!prod) throw new Error(`Product was not found with price id (${e.priceId})`);

      const limit: number | undefined = (prod.metadata as any)?.limit;

      const qty = (obj[prod.id] ?? 0) + (e.quantity ?? 1);

      if (typeof limit == 'number' && limit < qty) throw new Error(`Product exceeded quantity limit! (limit: ${limit}, quantity: ${qty})`);

      return {
        ...obj,
        [prod.id]: qty,
      }
    }, qtyInitial);

    // TODO: Throw if transaction is already in progress



    await Promise.all(
      items.map(({ priceId, metadata, ...rest }) => {
        return this.stripe.invoiceItems.create({
          customer: project.stripeCustomerId,
          price: priceId,
          metadata: StripeHandler.formatMetadata(metadata),
          ...rest,
        })
      })
    );

    const invoice = await this.stripe.invoices.create({
      customer: project.stripeCustomerId,
      auto_advance: true,
      collection_method: 'charge_automatically',
      description,
      metadata: StripeHandler.formatMetadata(metadata),
    });

    return await this.stripe.invoices.pay(invoice.id);
  }

  async upsertPaymentMethodRecord(paymentMethod: Stripe.PaymentMethod) {
    if (!paymentMethod.card) {
      throw new Error('Payment method must be of type card!');
    }

    const stripeCustomerId = typeof paymentMethod.customer == 'string' ? paymentMethod.customer : paymentMethod.customer?.id;
    if (!stripeCustomerId) throw new Error('No Customer attach to payment method!');
    const project = await this.prisma.project.findUnique({
      where: { stripeCustomerId },
      include: {
        stripePaymentMethods: true,
      }
    });

    if (!project) throw new Error('Project not found from stripe customer!');

    const cust = (await this.stripe.customers.retrieve(stripeCustomerId, { expand: ['invoice_settings.default_payment_method'] })) as Stripe.Response<Stripe.Customer>;
    const isDefault = cust.invoice_settings.default_payment_method == null || paymentMethod.id == StripeHandler.getStripeId(cust.invoice_settings.default_payment_method);

    const paymentMethodData = {
      id: paymentMethod.id,
      type: paymentMethod.type,

      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
      expMonth: paymentMethod.card.exp_month,
      expYear: paymentMethod.card.exp_year,

      isDefault,
      project: {
        connect: { id: project.id },
      },
    };

    const result = await this.prisma.$transaction([
      this.prisma.stripePaymentMethod.updateMany({
        where: { id: { not: paymentMethod.id }, projectId: project.id, isDefault: true },
        data: { isDefault: false },
      }),
      this.prisma.stripePaymentMethod.upsert({
        create: paymentMethodData,
        update: paymentMethodData,
        where: {
          id: paymentMethod.id,
        }
      })
    ]);

    if (cust.invoice_settings.default_payment_method == null) {
      await this.updateDefaultPaymentMethod(cust.id, paymentMethod.id);
    }

    return result[result.length - 1];
  }

  async replaceDefaultPaymentMethod(stripeCustomerId: string, paymentMethodId: string) {

    await this.updateDefaultPaymentMethod(stripeCustomerId, paymentMethodId);

    const paymentMethods = await this.stripe.paymentMethods.list({ type: 'card', customer: stripeCustomerId });
    const detachPaymentMethods = paymentMethods.data.filter(e => e.id != paymentMethodId);

    await Promise.all(
      detachPaymentMethods.map(e => 
        this.stripe.paymentMethods.detach(e.id)
      )
    );
  }

  async deletePaymentMethodRecord(paymentMethod: Stripe.PaymentMethod) {
    await this.prisma.stripePaymentMethod.delete({ where: { id: paymentMethod.id } });
  }

  async updateDefaultPaymentMethod(stripeCustomerId: string, paymentMethodId: string) {
    await this.stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      }
    });
  }

  deletePaymentMethod(paymentMethodId: string) {
    return this.stripe.paymentMethods.detach(paymentMethodId);
  }

  manageChargeSucceeded(charge: Stripe.Charge) {

  }


  static formatStripeInvoice(invoice: Stripe.Invoice): StripeInvoice {
    return {
      id: invoice.id,
      created: secondsToDate(invoice.created),
      dueDate: invoice.due_date && secondsToDate(invoice.due_date),
      status: invoice.status && invoice.status.toUpperCase(),
      amountDue: invoice.amount_due,
      amountPaid: invoice.amount_paid,
      amountRemaining: invoice.amount_remaining,
      billingReason: invoice.billing_reason && invoice.billing_reason.toUpperCase(),
      invoicePdf: invoice.invoice_pdf,
      periodStart: secondsToDate(invoice.period_start),
      periodEnd: secondsToDate(invoice.period_end),
      receiptNumber: invoice.receipt_number,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total,
    } as Omit<StripeInvoice, 'projectId'> as StripeInvoice;
  }

  async upsertInvoice(invoice: Stripe.Invoice) {

    const customerId = StripeHandler.getStripeId(invoice.customer);
    if (!customerId) return;
    
    const project = await this.prisma.project.findUnique({ where: { stripeCustomerId: customerId }, select: { id: true } });
    if (!project) return;

    const e = StripeHandler.formatStripeInvoice(invoice);
    const data: any = {
      ...e,
      project: {
        connect: { id: project.id }
      }
    }

    return this.prisma.stripeInvoice.upsert({
      create: data,
      update: data,
      where: { id: invoice.id },
    })
  }
  async upsertPurchasedProducts(invoice: Stripe.Invoice) {

    const customerId = StripeHandler.getStripeId(invoice.customer);
    if (!customerId) return;

    const project = await this.prisma.project.findUnique({ where: { stripeCustomerId: customerId }, select: { id: true } });
    if (!project) return;

    if (invoice.status != 'paid') return;

    const data = invoice.lines.data.reduce<Prisma.PurchasedProductCreateManyInput[]>((arr, e) => {
      if (e.price?.type != 'one_time') return arr;

      return [
        ...arr,
        {
          quantity: e.quantity ?? 1,
          projectId: project.id,
          stripeInvoiceId: invoice.id,
          stripeInvoiceLineId: e.id,
          stripePriceId: e.price.id,
          stripeProductId: StripeHandler.getStripeId(e.price.product)!,
        }
      ]
    }, []);

    if (data.length == 0) return;

    await this.prisma.purchasedProduct.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async fetchCustomerInfo(stripeCustomerId: string) {

    const [
      customer,
      paymentMethodData,
      subscriptionData,
      invoiceData,
      orderData,
      chargeData,
    ] = await Promise.all([
      this.stripe.customers.retrieve(stripeCustomerId, { expand: ['invoice_settings.default_payment_method'] }),
      this.stripe.paymentMethods.list({ customer: stripeCustomerId, type: 'card' }),
      this.stripe.subscriptions.list({ customer: stripeCustomerId, expand: ['data.latest_invoice', 'data.schedule'] }),
      this.stripe.invoices.list({ customer: stripeCustomerId, expand: ['data.payment_intent'] }),
      this.stripe.orders.list({ customer: stripeCustomerId }),
      this.stripe.charges.list({ customer: stripeCustomerId }),
    ]);

    const schedule = StripeHandler.getUpcomingPhase(subscriptionData.data[0].schedule as any);

    return {
      customer,
      paymentMethods: paymentMethodData.data,
      subscriptions: subscriptionData.data,
      invoices: invoiceData.data,
      orders: orderData.data,
      charges: chargeData.data,
    }
  }

  async refreshCustomerInfo(projectId: string) {

    const project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { id: true, stripeCustomerId: true }});
    if (!project) throw new Error('Project not found from stripe customer!');

    const info = await this.fetchCustomerInfo(project.stripeCustomerId);

    await Promise.all(info.paymentMethods.map(e => this.upsertPaymentMethodRecord(e)));
    await this.prisma.stripePaymentMethod.deleteMany({ where: { projectId: project.id, id: { notIn: info.paymentMethods.map(e => e.id) } } });
    
    await Promise.all(info.subscriptions.map(e => this.upsertSubscription(e)));
    await this.prisma.stripeSubscription.deleteMany({ where: { projectId: project.id, id: { notIn: info.subscriptions.map(e => e.id) } } });

    await Promise.all(info.invoices.map(e => this.upsertInvoice(e)));
    await this.prisma.stripeInvoice.deleteMany({ where: { projectId: project.id, id: { notIn: info.invoices.map(e => e.id) } } });

    await Promise.all(info.invoices.map(e => this.upsertPurchasedProducts(e)));

    return info;
  }

  async getSubscriptionScheduleId(subscription: Stripe.Response<Stripe.Subscription>) {

    const scheduleId = subscription.schedule;
    if (scheduleId) return typeof scheduleId == 'string' ? scheduleId : scheduleId.id;

    const schedule = await this.stripe.subscriptionSchedules.create({
      from_subscription: subscription.id,
    });
    return schedule.id;
  }

  async getSubscriptionSchedule(subscription: Stripe.Response<Stripe.Subscription>) {
    const scheduleId = subscription.schedule;
    if (scheduleId) {
      if (typeof scheduleId == 'string') return await this.stripe.subscriptionSchedules.retrieve(scheduleId);
      return scheduleId;
    }

    const schedule = await this.stripe.subscriptionSchedules.create({
      from_subscription: subscription.id,
    });
    return schedule;
  }


  async updateProjectSubscriptionUsedSeats(projectId: string, options?: { seatsUsed?: number, invoiceDescription?: string, invoiceMetadata?: any }) {
    const usedSeats = options?.seatsUsed ?? (await projectService.getProjectUsedSeats(this.prisma, projectId));

    const project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { id: true, stripeCustomerId: true } });

    if (!project) throw new Error(`Project not found with id '${projectId}'`);

    const subscriptions = await this.prisma.stripeSubscription.findMany({
      where: {
        projectId,
        status: { notIn: ['CANCELED'] },
      },
      include: {
        stripePrice: {
          include: {
            stripeProduct: true,
          }
        },
        upcomingStripePrice: {
          include: {
            stripeProduct: true,
          }
        }
      }
    });

    const getSubscriptionQuantity = (metadata: any, currentQuantity: number, usedSeats: number, takeHighestQuantity?: boolean) => {
      if (metadata.pricing != 'per-member') return currentQuantity;
      if (takeHighestQuantity) return Math.max(currentQuantity, usedSeats);
      return usedSeats;
    }

    
    const shouldInvoiceArray = await Promise.all(
      subscriptions.map(async (subRecord) => {

        const isCurrentPricePerMember = (subRecord.stripePrice.stripeProduct?.metadata as StripeMetadata | null)?.pricing == 'per-member';

        if (!isCurrentPricePerMember && (subRecord.upcomingStripePrice?.stripeProduct?.metadata as StripeMetadata | null)?.pricing != 'per-member') return false;

        const sub = await this.stripe.subscriptions.retrieve(subRecord.id);
        if (sub.items.data[0].quantity == usedSeats) return false;

        const subscriptionSchedule = await this.getSubscriptionSchedule(sub);
        const rolloverNextPeriod = subRecord.quantity > usedSeats;

        const previousPhases = subscriptionSchedule.phases
          .filter(e => e.end_date < (Date.now() / 1000))
          .map(({ items, start_date, end_date }) => ({
            items: items as any,
            start_date,
            end_date,
            debug_type: 'previous',
          }));

        const phases = [
          ...previousPhases,
          {
            items: [{ price: sub.items.data[0].price.id, quantity: sub.items.data[0].quantity }],
            start_date: previousPhases[previousPhases.length - 1]?.end_date ?? sub.current_period_start,
            end_date: rolloverNextPeriod ? sub.current_period_end : 'now' as const,
            debug_type: 'current',
          },
          ...(!rolloverNextPeriod && isCurrentPricePerMember ? [{
            items: [{ price: sub.items.data[0].price.id, quantity: usedSeats }],
            start_date: 'now' as const,
            end_date: sub.current_period_end,
            debug_type: 'update_instant',
          }] : []),
          ...(subRecord.upcomingStripePriceId && subRecord.upcomingStripePriceId !== sub.items.data[0].price.id ? [{
            items: [{
              price: subRecord.upcomingStripePriceId,
              quantity: getSubscriptionQuantity(subRecord.upcomingStripePrice?.stripeProduct?.metadata ?? {}, subRecord.upcomingQuantity!, usedSeats),
            }],
            debug_type: 'set_upcoming',
            start_date: sub.current_period_end,
          }] : []),
          ...(!subRecord.upcomingStripePriceId && rolloverNextPeriod && isCurrentPricePerMember ? [{
            items: [{
              price: sub.items.data[0].price.id,
              quantity: usedSeats,
            }],
            debug_type: 'update_next_period',
            start_date: sub.current_period_end,
          }] : []),
        ];

        console.dir({
          phases,
        }, { depth: 5 });

        await this.stripe.subscriptionSchedules.update(subscriptionSchedule.id, {
          proration_behavior: 'create_prorations',
          phases: phases.map(({ debug_type, ...rest }) => rest),
        });

        return isCurrentPricePerMember && !rolloverNextPeriod;
      })
    )

    if (shouldInvoiceArray.every(e => e === false)) return null;

    const invoice = await this.stripe.invoices.create({
      customer: project.stripeCustomerId,
      auto_advance: true,
      collection_method: 'charge_automatically',
      description: options?.invoiceDescription,
      metadata: typeof options?.invoiceMetadata == 'object' ?  StripeHandler.formatMetadata(options.invoiceMetadata) : undefined,
    });

    const payedInovoice = await this.stripe.invoices.pay(invoice.id);

    return payedInovoice;
  }


  static convertValue(val: any) {
    const num = Number(val);
    if (!isNaN(num)) return num;
    if (val == 'true') return true;
    if (val == 'false') return false;
    return val;
  }

  static formatMetadata(meta: Stripe.MetadataParam | undefined) {
    if (!meta) return meta;
    return Object.fromEntries(
      Object.entries(meta)
        .map(([key, val]) => ([key, StripeHandler.convertValue(val)]))
    )
  }

  static getStripeId(id: null | string | { id: string }) {
    if (id == null) return id;
    if (typeof id == 'string') return id;
    return id.id;
  }

  static getUpcomingPhase(schedule: Stripe.SubscriptionSchedule | null) {
    return schedule?.phases?.filter(e => dayjs().unix() < e.start_date).sort((a, b) => a.start_date - b.start_date)[0] ?? null;
  }
  static asNonString<T = any>(e: T): Exclude<T, string> {
    if (typeof e == 'string') throw new Error(`Cannot convert string to non-string (${e})!`);
    return e as any;
  }
}