import { NextApiHandler } from 'next';
import { createStripe, httpLoggerMiddleware, stripeWebhookHandler } from 'shared-server';
import { prisma } from '../../../utils/prisma';
import { withSentry } from "@sentry/nextjs";


// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false
  },
};

const webhookHandler: NextApiHandler = async (req, res) => {
  httpLoggerMiddleware(req, res);
  await stripeWebhookHandler(createStripe(), prisma)(req, res);
}

export default withSentry(webhookHandler);