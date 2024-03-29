import { arg, intArg, mutationField, objectType, stringArg } from 'nexus';
import { AuthenticationError, UserInputError } from 'apollo-server-micro';
import { getURL } from 'utils';

export const CheckoutSession = objectType({
  name: "CheckoutSession",
  definition(t) {
    t.string("sessionId");
  }
})

// WIP!
export const CreateCheckoutSession = mutationField("createCheckoutSession", {
  type: "CheckoutSession",
  args: {
    price: stringArg({ required: true }),
    quantity: intArg({ default: 1 }),
    metadata: arg({ type: "Json", default: '{}' }),

    projectId: stringArg({ required: true }),
  },
  async resolve(root, args, ctx) {
    const { price, quantity, metadata } = args;

    if (!ctx?.user) {
      throw new AuthenticationError('User must be logged in!');
    }
    if (!ctx.user.email) {
      throw new UserInputError('User must has set a email!');
    }

    const customer = await ctx.getStripeHandler().upsertCustomer(
      args.projectId,
      { email: ctx.user.email },
    );

    const session = await ctx.stripe.checkout.sessions.create({
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

    return { sessionId: session.id };
  }
});