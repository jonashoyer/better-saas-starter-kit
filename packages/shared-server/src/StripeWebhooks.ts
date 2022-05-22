import { PrismaClient } from '@prisma/client';
import { NextApiHandler, NextApiRequest } from 'next';
import Stripe from 'stripe';
import { StripeHandler } from './StripeHandler';

// https://github.com/vercel/nextjs-subscription-payments/blob/main/pages/api/webhooks.js

async function reqToBuffer(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any = [];
    req.on('data', chunk => {
      chunks.push(chunk);
    })
    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    })
    req.on('error', err => {
      reject(err);
    })
  })
}

const relevantEvents = new Set([
  'charge.succeeded',
  'payment_method.updated',
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'subscription_schedule.updated',
  'invoice.paid',
  'invoice.payment_failed',
  'payment_method.attached',
]);

export const stripeWebhookHandler = (stripe: Stripe, prisma: PrismaClient): NextApiHandler => async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const buf = await reqToBuffer(req);
  const sig = req.headers['stripe-signature']!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    if (err instanceof Error) {

      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    res.status(500).send(`Webhook Error: ${String(err)}`);
    return;
  }

  const handler = new StripeHandler(stripe, prisma);

  if (relevantEvents.has(event.type)) {
    const obj = event.data.object as any;
    try {
      switch (event.type) {
        // customer.updated -> catch new default payment method ?
        case 'charge.succeeded':
          // NOTE: Use metadata to trace user and product
          await handler.manageChargeSucceeded(obj);
          break;
        case 'payment_method.updated':
          await handler.upsertPaymentMethodRecord(obj);
          break;
        case 'product.created':
        case 'product.updated':
          await handler.upsertProductRecord(obj);
          break;
        case 'price.created':
        case 'price.updated':
          await handler.upsertPriceRecord(obj);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          await handler.upsertSubscription(obj);
          break;
        case 'subscription_schedule.updated':
          console.dir(obj, { depth: null });
          break;
        case 'customer.subscription.trial_will_end':
          // Send notification to your user that the trial will end
          break;
        case 'checkout.session.completed':
          if (obj.mode === 'subscription') {
            const subscription = await stripe.subscriptions.retrieve(obj.subscription);
            await handler.upsertSubscription(subscription);
          }
          break;
        case 'invoice.paid':
          //TODO: 
          // Used to provision services after the trial has ended.
          // The status of the invoice will show up as paid. Store the status in your
          // database to reference when a user accesses your service to avoid hitting rate limits.
          await handler.upsertInvoice(obj);
          break;
        case 'invoice.payment_failed':
          //TODO: 
          // If the payment fails or the customer does not have a valid payment method,
          //  an invoice.payment_failed event is sent, the subscription becomes past_due.
          // Use this webhook to notify your user that their payment has
          // failed and to retrieve new card details.
          await handler.upsertInvoice(obj);
          break;
        case 'invoice.finalized':
          // If you want to manually send out invoices to your customers
          // or store them locally to reference to avoid hitting Stripe rate limits.
          await handler.upsertInvoice(obj);
          break;
        case 'payment_method.attached':
          await handler.upsertPaymentMethodRecord(obj);
          break;
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Webhook handler failed. View logs.' });
      return;
    }
  }

  res.json({ received: true });
};