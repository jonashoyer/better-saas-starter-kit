import { PaymentMethodImportance, StripeSubscription, PrismaClient } from '@prisma/client';
import Stripe from 'stripe'

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

  constructor(stripe: Stripe, prisma: PrismaClient){
    this.stripe = stripe;
    this.prisma = prisma;
  }

  async upsertCustomer(projectId: string, params?: Stripe.CustomerCreateParams, options?: Stripe.RequestOptions) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { stripeCustomerId: true }});
    if (!project) throw new Error(`Project not found by id (${projectId})!`)
    if (project.stripeCustomerId) return project.stripeCustomerId;
    const customer = await this.createCustomer({...params, metadata: { ...params?.metadata, projectId }}, options);
    return customer.id;
  }

  createCustomer(params?: Stripe.CustomerCreateParams & { metadata: { projectId: string } }, options?: Stripe.RequestOptions) {
    return this.stripe.customers.create(params, options);
  }

  deleteCustomer(id: string, options?: Stripe.RequestOptions) {
    return this.stripe.customers.del(id, options);
  }

  createPaymentMethod(params?: Stripe.PaymentMethodCreateParams & { metadata: { importance: PaymentMethodImportance, projectId: string } }, options?: Stripe.RequestOptions) {
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

  upsertProductRecord (product: Stripe.Product) {
    if (!product.metadata?.type) {
      console.error(`Stripe product is missing field 'type' in metadata!`);
      return;
    }
    const productData = {
      id: product.id,
      active: product.active,
      type: product.metadata?.type,
      name: product.name,
      image: product.images?.[0] ?? null,
      metadata: product.metadata,
    };

    return this.prisma.product.upsert({
      create: productData,
      update: productData,
      where: {
        id: product.id,
      }
    })
  };

  upsertPriceRecord (price: Stripe.Price) {
    const priceData = {
      id: price.id,
      productId: typeof price.product == 'string' ? price.product : price.product.id,
      active: price.active,
      currency: price.currency,
      type: price.type,
      unitAmount: price.unit_amount,
      interval: price.recurring?.interval ?? null,
      intervalCount: price.recurring?.interval_count ?? null,
      trialPeriodDays: price.recurring?.trial_period_days ?? null,
      metadata: price.metadata
    };

    return this.prisma.productPrice.upsert({
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

  formatStripeSubscription(s: Stripe.Subscription): StripeSubscription {
    return {
      id: s.id,
      metadata: s.metadata,
      status: s.status.toUpperCase() as any,
      priceId: s.items.data[0].price.id,
      quantity: s.items.data[0].quantity ?? 1,
      cancelAtPeriodEnd: s.cancel_at_period_end,
      cancelAt: s.cancel_at ? secondsToDate(s.cancel_at) : null,
      canceledAt: s.canceled_at ? secondsToDate(s.canceled_at) : null,
      currentPeriodStart: secondsToDate(s.current_period_start),
      currentPeriodEnd: secondsToDate(s.current_period_end),
      created: secondsToDate(s.created),
      endedAt: s.ended_at ? secondsToDate(s.ended_at) : null,
      projectId: 'unknown'
    }
  }

  async createSubscription(stripeCustomerId: string, priceId: string, quantity: number) {
    const subscription = await this.stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [
        { price: priceId, quantity },
      ],
      expand: ['latest_invoice.payment_intent', 'plan.product'],
    });

    return this.formatStripeSubscription(subscription);
  }

  async updateSubscription(stripeCustomerId: string, stripeSubscriptionId: string, priceId: string, quantity: number) {
    const subscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
    const currentPriceId = subscription.items.data[0].price.id;

    let updatedSubscription: any;
    if (currentPriceId == priceId) {
      updatedSubscription = await this.stripe.subscriptions.update(stripeSubscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            quantity,
          },
        ],
      });
    } else {
      updatedSubscription = await this.stripe.subscriptions.update(stripeSubscriptionId, {
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
    }

    const invoice = await this.stripe.invoices.create({
      customer: stripeCustomerId,
      subscription: subscription.id,
      description: `Change to ${quantity} seat(s) on the ${updatedSubscription.plan.product.name} plan`,
    });

    await this.stripe.invoices.pay(invoice.id);
    return this.formatStripeSubscription(updatedSubscription);
  }

  async manageSubscriptionStatusChange(
    subscription: any,
  ) {
    
    // TODO: 
    const project = await this.prisma.project.findUnique({
      where: { stripeCustomerId: subscription.customer }
    });

    if (!project) {
      throw new Error(`Stripe customer not found! (id: ${subscription.customer})`);
    }

    const subscriptionData = {
      id: subscription.id,
      projectId: project.id,
      metadata: subscription.metadata,
      status: subscription.status.toUpperCase() as any,
      priceId: subscription.items.data[0].price.id,
      quantity: subscription.items.data[0].quantity ?? 1,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: subscription.cancel_at ? secondsToDate(subscription.cancel_at) : null,
      canceledAt: subscription.canceled_at ? secondsToDate(subscription.canceled_at) : null,
      currentPeriodStart: secondsToDate(subscription.current_period_start),
      currentPeriodEnd: secondsToDate(subscription.current_period_end),
      created: secondsToDate(subscription.created),
      endedAt: subscription.ended_at ? secondsToDate(subscription.ended_at) : null,
    };

    await this.prisma.stripeSubscription.upsert({
      create: subscriptionData,
      update: subscriptionData,
      where: { id: subscriptionData.id },
    });

    if (subscription.metadata.type) {
      await this.prisma.project.update({
        where: { stripeCustomerId: subscription.customer },
        data: { subscriptionPlan: subscription.metadata.type },
      })
    }

    // // For a new subscription copy the billing details to the customer object.
    // // NOTE: This is a costly operation and should happen at the very end.
    // if (createAction && subscription.default_payment_method)
    //   await copyBillingDetailsToCustomer(
    //     uuid,
    //     subscription.default_payment_method
    //   );
  };

  createChargeSession(customerId: string, lineItems: Stripe.Checkout.SessionCreateParams.LineItem[], metadata?: Stripe.MetadataParam ) {
    return this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancelled`,
      payment_intent_data: {
        metadata // NOTE: { userId, productId }
      },
    })
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
        paymentMethods: true,
      }
    });

    if (!project) throw new Error('Project not found from stripe customer!');

    const getImportance = () => {
      if (paymentMethod.metadata?.importance) {
        const importance = paymentMethod.metadata.importance as PaymentMethodImportance;
        if (importance == PaymentMethodImportance.PRIMARY && !project.paymentMethods.some(e => e.importance == PaymentMethodImportance.PRIMARY)) return PaymentMethodImportance.PRIMARY;
        if ((importance == PaymentMethodImportance.PRIMARY || importance == PaymentMethodImportance.BACKUP) && !project.paymentMethods.some(e => e.importance == PaymentMethodImportance.BACKUP)) return PaymentMethodImportance.BACKUP;
        return PaymentMethodImportance.OTHER;
      }

      if (!project.paymentMethods.some(e => e.importance == PaymentMethodImportance.PRIMARY)) return PaymentMethodImportance.PRIMARY;
      if (!project.paymentMethods.some(e => e.importance == PaymentMethodImportance.BACKUP)) return PaymentMethodImportance.BACKUP;
      return PaymentMethodImportance.OTHER;
    }

    const importance = getImportance()
    const paymentMethodData = {
      id: paymentMethod.id,
      type: paymentMethod.type,

      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
      expMonth: paymentMethod.card.exp_month,
      expYear: paymentMethod.card.exp_year,

      importance,
      project: {
        connect: { id: project.id },
      },
    };

    if (importance == PaymentMethodImportance.PRIMARY) {
      await this.updateDefaultPaymentMethod(stripeCustomerId, paymentMethod.id);
    }

    return this.prisma.paymentMethod.upsert({
      create: paymentMethodData,
      update: paymentMethodData,
      where: {
        id: paymentMethod.id,
      }
    })
  }

  updateDefaultPaymentMethod(stripeCustomerId: string, paymentMethodId: string) {
    return this.stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      }
    })
  }

  deletePaymentMethod(paymentMethodId: string) {
    return this.stripe.paymentMethods.detach(paymentMethodId);
  }

  manageChargeSucceeded(charge: Stripe.Charge) {
    
  }
}