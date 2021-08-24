import { Context } from 'graphql/context';
import { arg, enumType, inputObjectType, mutationField, objectType, stringArg } from 'nexus';
import { requireProjectAccess, requireProjectResource } from './permissions';
import * as prisma from '@prisma/client';
import { UserInputError } from 'apollo-server-errors';

export const PaymentMethod = objectType({
  name: 'PaymentMethod',
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


export const SetupIntent = objectType({
  name: 'SetupIntent',
  definition(t) {
    t.string('clientSecret', { required: true });
  }
})

const PaymentMethodAuthResolver = (include?: prisma.Prisma.PaymentMethodInclude) => async (_: any, { input }: { input: { id: string } }, ctx: Context) => {
  const paymentMethod = await ctx.prisma.paymentMethod.findUnique({ where: { id: input.id }, include })
  ctx.entity = paymentMethod;
  return paymentMethod.projectId;
}


export const CreateSetupIntent = mutationField('createSetupIntent', {
  type: SetupIntent,
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

export const UpdatePaymentMethodInput = inputObjectType({
  name: 'UpdatePaymentMethodInput',
  definition(t) {
    t.string('id', { required: true });
    t.field('importance', { type: PaymentMethodImportance });
  }
})

export const UpdatePaymentMethod = mutationField('updatePaymentMethod', {
  type: 'PaymentMethod',
  authorize: requireProjectResource({ role: 'ADMIN', projectIdFn: PaymentMethodAuthResolver({ project: { select: { paymentMethods: true } } }) }),
  args: {
    input: arg({ type: UpdatePaymentMethodInput, required: true }),
  },
  async resolve(root, { input }, ctx: Context<prisma.PaymentMethod & { project: { paymentMethods: prisma.PaymentMethod[] } }>) {

    
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
          peerPaymentMethodUpdate = ctx.prisma.paymentMethod.update({
            where: { id: oldPrimary.id },
            data: { importance: 'BACKUP' },
          });
        }
      }
    }

    const updatePaymenthMethod = ctx.prisma.paymentMethod.update({
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

export const DeletePaymentMethod = mutationField('deletePaymentMethod', {
  type: 'PaymentMethod',
  authorize: requireProjectResource({ role: 'ADMIN', projectIdFn: PaymentMethodAuthResolver() }),
  args: {
    id: stringArg({ required: true }),
  },
  async resolve(root, { id }, ctx: Context<prisma.PaymentMethod>) {
    if (ctx.entity.importance == prisma.PaymentMethodImportance.PRIMARY) throw new Error('A primary payment method is needed!');
    return ctx.prisma.paymentMethod.delete({ where: { id } });
  }
})