import prisma from './prisma';
import { stripe } from './stripe';

// This entire file should be removed and moved to supabase-admin
// It's not a react hook, so it shouldn't have useDatabase format
// It should also properly catch ands throw errors
const upsertProductRecord = async (product: any) => {
  const productData = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description,
    image: product.images?.[0] ?? null,
    metadata: product.metadata
  };

  await prisma.product.upsert({
    create: productData,
    update: productData,
    where: {
      id: product.id,
    }
  })

  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (price: any) => {
  const priceData = {
    id: price.id,
    productId: price.product,
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

  await prisma.productPrice.upsert({
    create: priceData,
    update: priceData,
    where: { id: price.id }
  })
  console.log(`Price inserted/updated: ${price.id}`);
};

const createOrRetrieveCustomer = async ({ email, projectId }: { email?: string, projectId: string }) => {

  // const user = await prisma.user.findUnique({ where: { id: projectId }, select: { stripeCustomerId: true } });

  // if (error) {
  //   // No customer record found, let's create one.
  //   const customerData = {
  //     metadata: {
  //       supabaseUUID: uuid
  //     }
  //   };
  //   if (email) customerData.email = email;
  //   const customer = await stripe.customers.create(customerData);
  //   // Now insert the customer ID into our Supabase mapping table.
  //   const { error: supabaseError } = await supabaseAdmin
  //     .from('customers')
  //     .insert([{ id: uuid, stripe_customer_id: customer.id }]);
  //   if (supabaseError) throw supabaseError;
  //   console.log(`New customer created and inserted for ${uuid}.`);
  //   return customer.id;
  // }
  // if (data) return data.stripe_customer_id;

  return {} as any;
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (uuid: string, payment_method: any) => {
  // const customer = payment_method.customer;
  // const { name, phone, address } = payment_method.billing_details;
  // await stripe.customers.update(customer, { name, phone, address });
  // const { error } = await supabaseAdmin
  //   .from('users')
  //   .update({
  //     billing_address: address,
  //     payment_method: payment_method[payment_method.type]
  //   })
  //   .eq('id', uuid);
  // if (error) throw error;
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // // Get customer's UUID from mapping table.
  // const {
  //   data: { id: uuid },
  //   error: noCustomerError
  // } = await supabaseAdmin
  //   .from('customers')
  //   .select('id')
  //   .eq('stripe_customer_id', customerId)
  //   .single();
  // if (noCustomerError) throw noCustomerError;

  // const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
  //   expand: ['default_payment_method']
  // });
  // // Upsert the latest status of the subscription object.
  // const subscriptionData = {
  //   id: subscription.id,
  //   user_id: uuid,
  //   metadata: subscription.metadata,
  //   status: subscription.status,
  //   price_id: subscription.items.data[0].price.id,
  //   quantity: subscription.quantity,
  //   cancel_at_period_end: subscription.cancel_at_period_end,
  //   cancel_at: subscription.cancel_at
  //     ? toDateTime(subscription.cancel_at)
  //     : null,
  //   canceled_at: subscription.canceled_at
  //     ? toDateTime(subscription.canceled_at)
  //     : null,
  //   current_period_start: toDateTime(subscription.current_period_start),
  //   current_period_end: toDateTime(subscription.current_period_end),
  //   created: toDateTime(subscription.created),
  //   ended_at: subscription.ended_at ? toDateTime(subscription.ended_at) : null,
  //   trial_start: subscription.trial_start
  //     ? toDateTime(subscription.trial_start)
  //     : null,
  //   trial_end: subscription.trial_end
  //     ? toDateTime(subscription.trial_end)
  //     : null
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

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange
};