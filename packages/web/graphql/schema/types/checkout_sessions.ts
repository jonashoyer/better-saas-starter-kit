import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import { stripe } from '../../../utils/stripe';
import { createOrRetrieveCustomer } from '../../../utils/useDatabase';
import { getURL } from '../../../utils/utils';
import { Session } from '../../../pages/api/auth/[...nextauth]';

const createCheckoutSession: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { price, quantity = 1, metadata = {} } = req.body;

    try {
      const userSession = (await getSession({ req })) as Session | null;
      if (!userSession?.user) {
        return res.status(403).json({ error: { statusCode: 403, message: 'User must be logged in!' } });
      }
      if (!userSession.user.email) {
        return res.status(400).json({ error: { statusCode: 400, message: 'User must has set a email!' } });
      }

      const customer = await createOrRetrieveCustomer({
        projectId: '1', //userSession.user.id!,
        email: userSession.user.email
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        customer,
        line_items: [
          {
            price,
            quantity
          }
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        subscription_data: {
          metadata
        },
        success_url: `${getURL()}/account`,
        cancel_url: `${getURL()}/`
      });

      return res.status(200).json({ sessionId: session.id });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

// export default createCheckoutSession;