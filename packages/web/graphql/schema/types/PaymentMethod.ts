import { enumType, mutationField, objectType, stringArg } from 'nexus';
import { requireProjectAccess } from './permissions';

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