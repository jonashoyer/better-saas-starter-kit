import { Context } from 'graphql/context';
import { arg, enumType, inputObjectType, mutationField, objectType, stringArg } from 'nexus';
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
    t.model.importance();
    t.model.project();
  },
});

export const PaymentMethodImportance = enumType({
  name: 'PaymentMethodImportance',
  members: ['PRIMARY', 'BACKUP', 'OTHER']
})


export const StripeSetupIntent = objectType({
  name: 'StripeSetupIntent',
  definition(t) {
    t.string('clientSecret', { required: true });
  }
})

const PaymentMethodFetch = (opt?: { include?: prisma.Prisma.StripePaymentMethodInclude, projectIdFn?: (root: any, args: any, ctx: Context) => string; }) => async (root: any, args: any, ctx: Context) => {
  const { include, projectIdFn } = opt ?? {};
  const id = projectIdFn?.(root, args, ctx) ?? args?.input?.id ?? args?.id;
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
    t.field('importance', { type: PaymentMethodImportance });
  }
})

export const UpdateStripePaymentMethod = mutationField('updateStripePaymentMethod', {
  type: 'StripePaymentMethod',
  authorize: requireProjectResource({ role: 'ADMIN', projectIdFn: PaymentMethodFetch({ include: { project: { select: { stripeCustomerId: true, stripePaymentMethods: true } } } }) }),
  args: {
    input: arg({ type: UpdateStripePaymentMethodInput, required: true }),
  },
  async resolve(root, { input }, ctx: Context<prisma.StripePaymentMethod & { project: { stripeCustomerId: string, paymentMethods: prisma.StripePaymentMethod[] } }>) {

    
    let peerPaymentMethodUpdate: any;
    if (input.importance) {

      const otherPaymentMethods = ctx.entity.project.paymentMethods.filter(e => e.id != input.id);

      if (
        input.importance == prisma.PaymentMethodImportance.OTHER
        && !otherPaymentMethods.some(e => e.importance == prisma.PaymentMethodImportance.PRIMARY)
      ) throw new UserInputError('A primary payment method is needed!');

      if (input.importance == prisma.PaymentMethodImportance.PRIMARY) {
        const oldPrimary = otherPaymentMethods.find(e => e.importance == prisma.PaymentMethodImportance.PRIMARY);
        if (oldPrimary) {
          peerPaymentMethodUpdate = ctx.prisma.stripePaymentMethod.update({
            where: { id: oldPrimary.id },
            data: { importance: 'BACKUP' },
          });
        }
        await ctx.getStripeHandler().updateDefaultPaymentMethod(ctx.entity.project.stripeCustomerId, input.id);
      }
    }

    const updatePaymenthMethod = ctx.prisma.stripePaymentMethod.update({
      where: { id: input.id },
      data: {
        importance: input.importance,
      }
    })
    
    if (peerPaymentMethodUpdate) {
      const [paymentMethod] = await ctx.prisma.$transaction([
        updatePaymenthMethod,
        peerPaymentMethodUpdate,
      ]);
      return paymentMethod;
    }

    return await updatePaymenthMethod;
  }
})

export const DeleteStripePaymentMethod = mutationField('deleteStripePaymentMethod', {
  type: 'StripePaymentMethod',
  authorize: requireProjectResource({ role: 'ADMIN', projectIdFn: PaymentMethodFetch() }),
  args: {
    id: stringArg({ required: true }),
  },
  async resolve(root, { id }, ctx: Context<prisma.StripePaymentMethod>) {
    if (ctx.entity.importance == prisma.PaymentMethodImportance.PRIMARY) throw new Error('A primary payment method is needed!');
    await ctx.stripe.paymentMethods.detach(id);
    return ctx.prisma.stripePaymentMethod.delete({ where: { id } });
  }
})