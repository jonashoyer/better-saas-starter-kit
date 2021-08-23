import { PaymentMethodImportance, PrismaClient } from '@prisma/client';
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
      expand: ['data.prices'],
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

  createSubscription(customerId: string, priceId: string) {
    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: priceId,
      }],
      payment_behavior: 'allow_incomplete',
    });
  }

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

  async manageSubscriptionStatusChange(
    subscriptionId: string,
    stripeCustomerId: string,
    createAction = false
  ) {

    // const project = await this.prisma.project.findUnique({
    //   where: { stripeCustomerId }
    // });

    // if (!project) {
    //   throw new Error(`Stripe customer not found! (id: ${stripeCustomerId})`);
    // }

    // const subscription = await this.stripe.subscriptions.retrieve(subscriptionId, {
    //   expand: ['default_payment_method']
    // });

    // // Upsert the latest status of the subscription object.
    // const subscriptionData = {
    //   id: subscription.id,
    //   projectId: project.id,
    //   metadata: subscription.metadata,
    //   status: subscription.status,
    //   priceId: subscription.items.data[0].price.id,
    //   quantity: subscription.quantity,
    //   cancel_at_period_end: subscription.cancel_at_period_end,
    //   cancel_at: subscription.cancel_at
    //     ? secondsToDate(subscription.cancel_at)
    //     : null,
    //   canceled_at: subscription.canceled_at
    //     ? secondsToDate(subscription.canceled_at)
    //     : null,
    //   current_period_start: secondsToDate(subscription.current_period_start),
    //   current_period_end: secondsToDate(subscription.current_period_end),
    //   created: secondsToDate(subscription.created),
    //   ended_at: subscription.ended_at ? secondsToDate(subscription.ended_at) : null,
    // };

    // const { error } = await supabaseAdmin
    //   .from('subscriptions')
    //   .insert([subscriptionData], { upsert: true });
    // if (error) throw error;
    // console.log(
    //   `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
    // );

    // // For a new subscription copy the billing details to the customer object.
    // // NOTE: This is a costly operation and should happen at the very end.
    // if (createAction && subscription.default_payment_method)
    //   await copyBillingDetailsToCustomer(
    //     uuid,
    //     subscription.default_payment_method
    //   );
  };

  createChargeSession(customerId: string, lineItems: Stripe.Checkout.SessionCreateParams.LineItem[], metadata?: Stripe.MetadataParam ) {
    // const lineItems = [
    //   {
    //     price_data: {
    //       currency: 'usd', // swap this out for your currency
    //       product_data: {
    //         name: course.title,
    //       },
    //       unit_amount: course.price,
    //     },
    //     quantity: 1,
    //   },
    // ]

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


  upsertPaymentMethodRecord(paymentMethod: Stripe.PaymentMethod) {
    if (!paymentMethod.card) {
      throw new Error('Payment method must be of type card!');
    }
    if (!paymentMethod.metadata?.importance) {
      throw new Error(`Missing metadata field 'importance'!`);
    }
    if (!paymentMethod.metadata?.projectId) {
      throw new Error(`Missing metadata field 'projectId'!`);
    }

    const paymentMethodData = {
      id: paymentMethod.id,
      type: paymentMethod.type,
      stripePaymentMethodId: paymentMethod.id,

      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
      expMonth: paymentMethod.card.exp_month,
      expYear: paymentMethod.card.exp_year,

      importance: paymentMethod.metadata.importance as PaymentMethodImportance,
      project: {
        connect: { id: paymentMethod.metadata.projectId },
      },
    };

    return this.prisma.paymentMethod.upsert({
      create: paymentMethodData,
      update: paymentMethodData,
      where: {
        id: paymentMethod.id,
      }
    })
  }

  manageChargeSucceeded(charge: Stripe.Charge) {
    
  }
}