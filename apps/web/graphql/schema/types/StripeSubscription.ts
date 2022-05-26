import { arg, enumType, inputObjectType, mutationField, objectType } from 'nexus';
import { requireProjectAccess } from './permissions';
import { isJSONValueObject } from 'shared';

export const StripeSubscriptionStatus = enumType({
  name: 'StripeSubscriptionStatus',
  members: [
    'INCOMPLETE',
    'INCOMPLETE_EXPIRED',
    'TRIALING',
    'ACTIVE',
    'PAST_DUE',
    'CANCELED',
    'UNPAID',
  ]
})

export const StripeSubscription = objectType({
  name: 'StripeSubscription',
  definition(t) {
    t.model.id();
    t.model.metadata();
    t.model.status();
    t.model.stripePriceId();
    t.model.quantity();
    t.model.cancelAtPeriodEnd();
    t.model.cancelAt();
    t.model.canceledAt();
    t.model.currentPeriodStart();
    t.model.currentPeriodEnd();
    t.model.created();
    t.model.endedAt();
    t.model.stripePrice();
  }
})

export const StripePrice = objectType({
  name: 'StripePrice',
  definition(t) {
    t.model.id();
    t.model.active();
    t.model.currency();
    t.model.interval();
    t.model.intervalCount();
    t.model.metadata();
    t.model.trialPeriodDays();
    t.model.unitAmount();
    t.model.stripeProduct();
  }
})

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

export const UpsertSubscriptionInput = inputObjectType({
  name: 'UpsertStripeSubscriptionInput',
  definition(t) {
    t.string('projectId', { required: true });
    t.string('priceId', { required: true });
  }
})

export const upsertStripeSubscription = mutationField('upsertStripeSubscription', {
  type: StripeSubscription,
  args: {
    input: arg({ type: UpsertSubscriptionInput, required: true }),
  },
  authorize: requireProjectAccess({ role: 'ADMIN', projectIdFn: (_, args) => args.input.projectId }),
  async resolve(root, { input }, ctx) {

    const { projectId, priceId } = input;

    const project = await ctx.prisma.project.findUnique({
      where: { id: projectId },
      select: { stripeCustomerId: true },
    });

    const subscriptions = await ctx.prisma.stripeSubscription.findMany({
      where: { projectId },
    });

    const quantity = await ctx.prisma.userProject.count({
      where: { projectId },
    });
    
    
    if (subscriptions.length != 0) {
      const currentPrice = subscriptions.find(e => (e.metadata as any).type == 'primary');
      const price = await ctx.prisma.stripePrice.findUnique({ where: { id: priceId } });
      if (!price) {
        throw new Error('Price do not exists!');
      }

      const currentPlanIndex = isJSONValueObject(currentPrice.metadata) ? Number(currentPrice.metadata.order) || 0 : 0;
      const planIndex = isJSONValueObject(price.metadata) ? Number(price.metadata.order) || 0 : 0;
      const beginAtNextPeriod = planIndex <= currentPlanIndex;

      return ctx.getStripeHandler().updateSubscription(currentPrice.id, priceId, quantity, beginAtNextPeriod);
    }

    return ctx.getStripeHandler().createSubscription(project.stripeCustomerId, priceId, quantity);
  }
})