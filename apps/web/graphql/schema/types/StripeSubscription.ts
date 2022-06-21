import { arg, enumType, inputObjectType, mutationField, objectType, stringArg } from 'nexus';
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
    t.model.stripePrice();

    t.model.upcomingStripePriceId();
    t.model.upcomingQuantity();
    t.model.upcomingStartDate();
    t.model.upcomingStripePrice();

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
      include: {
        stripePrice: {
          include: {
            stripeProduct: true,
          }
        }
      }
    });

    const quantity = await ctx.prisma.userProject.count({
      where: { projectId },
    });
    
    
    const currentPrimarySubscription = subscriptions.find(e => (e.stripePrice.stripeProduct.metadata as any).type == 'primary');
    if (currentPrimarySubscription) {
      const price = await ctx.prisma.stripePrice.findUnique({ where: { id: priceId } });
      if (!price) {
        throw new Error('Price do not exists!');
      }

      const isDowngrade = currentPrimarySubscription.stripePrice.unitAmount > price.unitAmount;
      const sub = await ctx.getStripeHandler().updateSubscription(currentPrimarySubscription.id, priceId, quantity, isDowngrade);
      return { ...sub, projectId: input.projectId };
    }

    const sub = await ctx.getStripeHandler().createSubscription(project.stripeCustomerId, priceId, quantity);
    return { ...sub, projectId: input.projectId };
  }
})

export const cancelSubscriptionDowngrade = mutationField('cancelSubscriptionDowngrade', {
  type: StripeSubscription,
  args: {
    projectId: stringArg({ required: true }),
  },
  authorize: requireProjectAccess({ role: 'ADMIN', projectIdFn: (_, args) => args.projectId}),
  async resolve(root, { projectId }, ctx) {
    
    const subscriptions = await ctx.prisma.stripeSubscription.findMany({
      where: { projectId },
      include: {
        stripePrice: {
          include: {
            stripeProduct: true,
          }
        }
      }
    });
    const currentPrimarySubscription = subscriptions.find(e => (e.stripePrice.stripeProduct.metadata as any).type == 'primary');

    if (!currentPrimarySubscription) {
      throw new Error('No primary subscription found!');
    }

    const subscription = await ctx.getStripeHandler().cancelSubscriptionDowngrade(currentPrimarySubscription.id);

    return {
      ...subscription,
      projectId,
    }
  }
})