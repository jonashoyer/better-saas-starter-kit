import { arg, stringArg, inputObjectType, mutationField, objectType, queryField } from 'nexus';
import { requireProjectAccess } from './permissions';

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

export const StripePrice = objectType({
  name: 'StripePrice',
  definition(t) {
    t.model.id();
    t.model.active();
    t.model.type();
    t.model.currency();
    t.model.interval();
    t.model.intervalCount();
    t.model.metadata();
    t.model.trialPeriodDays();
    t.model.unitAmount();
    t.model.stripeProduct();
  }
})

export const PurchasedProduct = objectType({
  name: 'PurchasedProduct',
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.quantity();

    t.model.stripePrice();
    t.model.stripeProduct();
    t.model.stripeInvoice();
  }
})

export const stripeProducts = queryField('stripeProducts', {
  type: StripeProduct,
  list: true,
  async resolve(root, args, ctx) {
    return ctx.prisma.stripeProduct.findMany({});
  },
})

export const PurchasePriceItemsItemInput = inputObjectType({
  name: 'PurchasePriceItemsItemInput',
  definition(t) {
    t.string('priceId', { required: true });
    t.int('quantity');
  },
})

export const purchasePriceItems = mutationField('purchasePriceItems', {
  type: 'Boolean', // FIXME:
  authorize: requireProjectAccess({ role: 'ADMIN', projectIdFn: (_, args) => args.projectId }),
  args: {
    projectId: stringArg({ required: true }),
    priceItems: arg({ type: 'PurchasePriceItemsItemInput', required: true, list: true }),
  },
  async resolve(root, { projectId, priceItems }, ctx) {

    await ctx.getStripeHandler().purchasePriceItems(projectId, priceItems); // FIXME:

    return true;
  }
})