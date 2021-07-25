import { PaymentMethodImportance, PrismaClient } from '@prisma/client';
import Stripe from 'stripe'

// https://egghead.io/blog/saas-app-with-nextjs-prisma-auth0-and-stripe

// TODO: https://stripe.com/docs/billing/subscriptions/metered
// TODO: https://stripe.com/docs/payments/save-and-reuse?platform=web

const secondsToDate = (sec: number) => {
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

  createStripeCustomer(params?: Stripe.CustomerCreateParams & { email: string, metadata: { userId: string } }, options?: Stripe.RequestOptions) {
    return this.stripe.customers.create(params, options);
  }

  createPaymentMethod(params?: Stripe.PaymentMethodCreateParams & { metadata: { importance: PaymentMethodImportance, projectId: string } }, options?: Stripe.RequestOptions) {
    return this.stripe.paymentMethods.create(params, options);
  }

  createUsageRecord(subscriptionItemId: string, params: Stripe.UsageRecordCreateParams, options?: Stripe.RequestOptions) {
    return this.stripe.subscriptionItems.createUsageRecord(subscriptionItemId, params, options);
  }

  // This entire file should be removed and moved to supabase-admin
  // It's not a react hook, so it shouldn't have useDatabase format
  // It should also properly catch ands throw errors
  upsertProductRecord (product: Stripe.Product) {
    const productData = {
      id: product.id,
      active: product.active,
      name: product.name,
      description: product.description,
      image: product.images?.[0] ?? null,
      metadata: product.metadata
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
    const priceData: any = {
      id: price.id,
      productId: typeof price.product == 'string' ? price.product : price.product.id,
      active: price.active,
      currency: price.currency,
      description: price.nickname,
      type: price.type,
      unitAmount: price.unit_amount,
      interval: price.recurring?.interval ?? null,
      interval_count: price.recurring?.interval_count ?? null,
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