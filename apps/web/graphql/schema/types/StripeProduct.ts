import { arg, enumType, inputObjectType, mutationField, objectType, queryField } from 'nexus';

export const StripeProduct = objectType({
  name: 'StripeProduct',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.image();
    t.model.active();
    t.model.stripePrices();
    t.model.metadata();
  }
})

export const stripeProducts = queryField('stripeProducts', {
  type: StripeProduct,
  list: true,
  async resolve(root, args, ctx) {
    return ctx.prisma.stripeProduct.findMany({});
  },
})