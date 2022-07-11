import { arg, enumType, inputObjectType, intArg, mutationField, objectType, stringArg } from 'nexus';
import { hasUserProjectAccess, requireAuth, requireProjectAccess, throwFalsy } from './permissions';
import type { StripeMetadata } from 'shared';
import { ForbiddenError } from 'apollo-server-micro';

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

    // per-member / standard

    
    const price = await ctx.prisma.stripePrice.findUnique({ where: { id: priceId }, include: { stripeProduct: true } });
    const isPrimarySubscription = (price.stripeProduct.metadata as StripeMetadata).type == 'primary';
    const isPerMember = (price.stripeProduct.metadata as StripeMetadata).pricing == 'per-member';

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

    const quantity = isPerMember
      ? await ctx.prisma.userProject.count({
        where: { projectId },
      })
      : 1;
    

    if (isPrimarySubscription) {

      const currentPrimarySubscription = subscriptions.find(e => (e.stripePrice.stripeProduct.metadata as any).type == 'primary');
      if (currentPrimarySubscription) {
        if (!price) {
          throw new Error('Price do not exists!');
        }

        const isDowngrade = currentPrimarySubscription.stripePrice.unitAmount > price.unitAmount;
        const sub = await ctx.getStripeHandler().updateSubscription(currentPrimarySubscription.id, priceId, quantity, isDowngrade);
        return { ...sub, projectId: input.projectId };
      }
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

    const subscription = await ctx.getStripeHandler().cancelSubscriptionDowngrade(currentPrimarySubscription.id, true);

    return {
      ...subscription,
      projectId,
    }
  }
});

export const createSubscription = mutationField('createSubscription', {
  type: StripeSubscription,
  args: {
    projectId: stringArg({ required: true }),
    priceId: stringArg({ required: true }),
    quantity: intArg(),
  },
  authorize: requireProjectAccess({ role: 'ADMIN', projectIdFn: (_, args) => args.projectId}),
  async resolve(root, { projectId, priceId, quantity }, ctx) {

    const project = await ctx.prisma.project.findUnique({ where: { id: projectId } });

    // TODO: Validate quantity limit

    const subscription = await ctx.getStripeHandler().createSubscription(project.stripeCustomerId, priceId, quantity ?? 1);
    return {
      ...subscription,
      projectId: project.id,
    }
  }
})

export const cancelSubscription = mutationField('cancelSubscription', {
  type: StripeSubscription,
  args: {
    subscriptionId: stringArg({ required: true }),
  },
  authorize: requireAuth,
  async resolve(root, { subscriptionId }, ctx) {

    const subscription = await ctx.prisma.stripeSubscription.findUnique({ where: { id: subscriptionId }, include: { stripePrice: { include: { stripeProduct: true } } } });

    if (!subscription) throw new ForbiddenError('Not allowed to cancel subscription');

    if ((subscription.stripePrice.stripeProduct.metadata as StripeMetadata).type == 'primary') {
      throw new ForbiddenError('Not allowed to cancel primary subscription');
    }

    await throwFalsy(hasUserProjectAccess(ctx.prisma, ctx.user!.id, subscription.projectId, 'ADMIN'), new ForbiddenError('Not allowed to cancel subscription'));

    const updatedSubscription = await ctx.getStripeHandler().cancelSubscription(subscription.id);
    return {
      ...updatedSubscription,
      projectId: subscription.projectId,
    }
  }
})

export const keepSubscription = mutationField('keepSubscription', {
  type: StripeSubscription,
  args: {
    subscriptionId: stringArg({ required: true }),
  },
  authorize: requireAuth,
  async resolve(root, { subscriptionId }, ctx) {

    const subscription = await ctx.prisma.stripeSubscription.findUnique({ where: { id: subscriptionId }, include: { stripePrice: { include: { stripeProduct: true } } } });

    if (!subscription) throw new ForbiddenError('Not allowed to keep subscription');

    if ((subscription.stripePrice.stripeProduct.metadata as StripeMetadata).type == 'primary') {
      throw new ForbiddenError('Not allowed to interact primary subscription');
    }

    await throwFalsy(hasUserProjectAccess(ctx.prisma, ctx.user!.id, subscription.projectId, 'ADMIN'), new ForbiddenError('Not allowed to keep subscription'));

    const updatedSubscription = await ctx.getStripeHandler().keepSubscription(subscription.id);
    return {
      ...updatedSubscription,
      projectId: subscription.projectId,
    }
    
  }
})