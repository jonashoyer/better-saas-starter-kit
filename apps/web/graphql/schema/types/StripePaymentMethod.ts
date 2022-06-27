import { Context } from 'graphql/context';
import { arg, inputObjectType, mutationField, objectType, stringArg } from 'nexus';
import { requireProjectAccess, requireProjectResource } from './permissions';
import * as prisma from '@prisma/client';
import { UserInputError } from 'apollo-server-errors';

export const StripePaymentMethod = objectType({
  name: 'StripePaymentMethod',
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.brand();
    t.model.last4();
    t.model.expMonth();
    t.model.expYear();
    t.model.type();
    t.model.isDefault();
    t.model.project();
  },
});

export const StripeSetupIntent = objectType({
  name: 'StripeSetupIntent',
  definition(t) {
    t.string('clientSecret', { required: true });
  }
})

const PaymentMethodFetch = (opt?: { include?: prisma.Prisma.StripePaymentMethodInclude, projectIdFn?: (root: any, args: any, ctx: Context) => string; }) => async (root: any, args: any, ctx: Context) => {
  const { include, projectIdFn } = opt ?? {};
  const id = projectIdFn?.(root, args, ctx) ?? args?.input?.id ?? args?.id;
  if (!id) throw new Error('Payment method fetch did not get a id!');
  const paymentMethod = await ctx.prisma.stripePaymentMethod.findUnique({ where: { id }, include })
  ctx.entity = paymentMethod;
  return paymentMethod.projectId;
}


export const CreateStripeSetupIntent = mutationField('createStripeSetupIntent', {
  type: StripeSetupIntent,
  authorize: requireProjectAccess({ role: 'ADMIN', projectIdFn: (_, args) => args.projectId }),
  args: {
    projectId: stringArg({ required: true }),
  },
  async resolve(root, { projectId }, ctx) {

    const project = await ctx.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        stripeCustomerId: true,
      }
    })

    const intent = await ctx.stripe.setupIntents.create({
      customer: project.stripeCustomerId,
    });

    return {
      clientSecret: intent.client_secret,
    };
  }
})

export const UpdateStripePaymentMethodInput = inputObjectType({
  name: 'UpdateStripePaymentMethodInput',
  definition(t) {
    t.string('id', { required: true });
    t.boolean('isDefault');
  }
})

export const UpdateStripePaymentMethod = mutationField('updateStripePaymentMethod', {
  type: 'StripePaymentMethod',
  authorize: requireProjectResource({ role: 'ADMIN', projectIdFn: PaymentMethodFetch({ include: { project: { select: { stripeCustomerId: true, stripePaymentMethods: true } } } }) }),
  args: {
    input: arg({ type: UpdateStripePaymentMethodInput, required: true }),
  },
  async resolve(root, { input }, ctx: Context<prisma.StripePaymentMethod & { project: { stripeCustomerId: string, paymentMethods: prisma.StripePaymentMethod[] } }>) {

    if (input.isDefault) {
      await ctx.getStripeHandler().updateDefaultPaymentMethod(ctx.entity.project.stripeCustomerId, ctx.entity.id)
      return await ctx.prisma.stripePaymentMethod.findUnique({ where: { id: ctx.entity.id } });
    }

    throw new UserInputError('Not implemented');
  }
})

export const DeleteStripePaymentMethod = mutationField('deleteStripePaymentMethod', {
  type: 'StripePaymentMethod',
  authorize: requireProjectResource({ role: 'ADMIN', projectIdFn: PaymentMethodFetch() }),
  args: {
    id: stringArg({ required: true }),
  },
  async resolve(root, { id }, ctx: Context<prisma.StripePaymentMethod>) {
    if (ctx.entity.isDefault) throw new Error('A primary payment method is needed!');
    await ctx.stripe.paymentMethods.detach(id);
    return ctx.entity;
  }
})

export const ReplacePrimaryPaymentMethod = mutationField('replacePrimaryPaymentMethod', {
  type: 'StripePaymentMethod',
  authorize: requireProjectResource({ role: 'ADMIN', projectIdFn: PaymentMethodFetch({ include: { project: { select: { stripeCustomerId: true, stripePaymentMethods: true } } } }) }),
  args: {
    id: stringArg({ required: true }), 
  },
  async resolve(root, { id }, ctx: Context<prisma.StripePaymentMethod & { project: { stripeCustomerId: string, paymentMethods: prisma.StripePaymentMethod[] } }>) {

    await ctx.getStripeHandler().replaceDefaultPaymentMethod(ctx.entity.project.stripeCustomerId, id);

    return {
      ...ctx.entity,
      isDefault: true,
    }
  }
})