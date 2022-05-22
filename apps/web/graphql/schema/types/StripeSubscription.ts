import { SubscriptionPlan } from '@prisma/client';
import { arg, enumType, inputObjectType, intArg, mutationField, objectType, queryField, stringArg } from 'nexus';
import { requireProjectAccess } from './permissions';

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
      const currentPriceType = subscriptions[0].subscriptionPlan;
      const price = await ctx.prisma.stripePrice.findUnique({ where: { id: priceId } });
      if (!price) {
        throw new Error('Price do not exists!');
      }

      const planOrder: SubscriptionPlan[] = ['FREE', 'BASIC', 'PREMIUM'];
      const currentPlanIndex = planOrder.indexOf(currentPriceType);
      const planIndex = planOrder.indexOf(price.type as any);
      const beginAtNextPeriod = planIndex <= currentPlanIndex;

      return ctx.getStripeHandler().updateSubscription(subscriptions[0].id, priceId, quantity, beginAtNextPeriod);
    }

    return ctx.getStripeHandler().createSubscription(project.stripeCustomerId, priceId, quantity);
  }
})