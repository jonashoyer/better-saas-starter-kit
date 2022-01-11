import { NextApiHandler } from 'next';
import { createStripe, stripeWebhookHandler } from 'shared-server';
import { prisma } from '../../../graphql/context';


// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false
  },
};

const webhookHandler: NextApiHandler = stripeWebhookHandler(createStripe(), prisma);

export default webhookHandler;