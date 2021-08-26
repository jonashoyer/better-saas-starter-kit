import cuid from 'cuid';
import { arg, enumType, inputObjectType, mutationField, objectType, queryField, stringArg } from 'nexus';
import { requireAuth, requireProjectAccess } from './permissions';
import { Constants } from 'bs-shared-kit';
import { DEFAULT_SUBSCRIPTION_PRICE_ID } from 'config';

export const Project = objectType({
  name: 'Project',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.users();
    t.model.subscriptionPlan();
    t.model.paymentMethods();
    t.model.userInvites();
  },
});

export const SubscriptionPlan = enumType({
  name: 'SubscriptionPlan',
  members: ['FREE', 'BASIC', 'PREMIUM'],
})

export const CurrentProject = queryField('currentProject', {
  type: 'Project',
  authorize: requireProjectAccess({
    nullable: true,
    projectIdFn: (root, args, ctx) => args.projectId ?? ctx.req.cookies[Constants.PROJECT_ID_COOKIE_KEY],
  }),
  args: {
    projectId: stringArg({ nullable: true }),
  },
  async resolve(root, { projectId }, ctx) {

    const getProjetId = async () => {
      if (projectId) return projectId;
      if (ctx.req.cookies[Constants.PROJECT_ID_COOKIE_KEY]) return ctx.req.cookies[Constants.PROJECT_ID_COOKIE_KEY];
      const userProject = await ctx.prisma.userProject.findFirst({
        where: { userId: ctx.user!.id }
      })
      return userProject.projectId;
    }

    const project = await ctx.prisma.project.findUnique({
      where: { id: (await getProjetId()) },
    });

    return project;
  }
})

export const SelfProjects = queryField('selfProjects', {
  type: 'Project',
  list: true,
  authorize: requireAuth,
  async resolve(root, args, ctx) {

    const userProjects = await ctx.prisma.userProject.findMany({
      where: { userId: ctx.user.id },
      include: {
        project: true,
      }
    });

    return userProjects.map(e => e.project);
  }
})

export const CreateProjectInput = inputObjectType({
  name: 'CreateProjectInput',
  definition(t) {
    t.string('name', { required: true });
  }
})

export const CreateProject = mutationField('createProject', {
  type: 'Project',
  authorize: requireAuth,
  args: {
    input: arg({ type: CreateProjectInput, required: true })
  },
  async resolve(root, { input }, ctx) {

    const name = ctx.user.name || ctx.user.email?.split('@')[0] || 'Unnamed';

    const projectId = cuid();
    const stripe = ctx.getStripeHandler();

    const stripeCustomer = await stripe.createCustomer({
      name,
      email: ctx.user.email,
      metadata: {
        projectId,
      },
    });

    const stripeSubscription = await stripe.createSubscription(stripeCustomer.id, DEFAULT_SUBSCRIPTION_PRICE_ID);

    try {
      const project = await ctx.prisma.project.create({
        data: {
          ...input,
          id: projectId,
          stripeCustomerId: stripeCustomer.id,
          stripeSubscriptionId: stripeSubscription.id,
          users: {
            create: {
              role: 'ADMIN',
              user: {
                connect: { id: ctx.user.id }
              }
            }
          }
        },
      })
      return project;
    } catch (err) {
      await stripe.deleteCustomer(stripeCustomer.id);
      throw new err;
    }
  }
});

export const UpdateProjectInput = inputObjectType({
  name: 'UpdateProjectInput',
  definition(t) {
    t.string('id', { required: true });
    t.string('name');
  }
})

export const UpdateProject = mutationField('updateProject', {
  type: 'Project',
  args: {
    input: arg({ type: UpdateProjectInput, required: true })
  },
  authorize: requireProjectAccess({
    projectIdFn: (_, { input }) => input.id,
    role: 'ADMIN',
  }),
  async resolve(root, { input: { id, name } }, ctx) {
    const project = await ctx.prisma.project.update({
      where: { id },
      data: { name },
    });

    return project;
  }
})

export const DeleteProject = mutationField('deleteProject', {
  type: 'Project',
  args: {
    id: stringArg({ required: true }),
  },
  authorize: requireProjectAccess({
    projectIdFn: (_, { id }) => id,
    role: 'ADMIN',
  }),
  async resolve(root, { id }, ctx) {
    return ctx.prisma.project.delete({ where: { id } });
  }
})

export const Ok = objectType({
  name: 'Ok',
  definition(t) {
    t.boolean('ok', { required: true });
    t.string('message');
  }
})

export const TaxType = enumType({
  name: 'TaxType',
  members: ['AE_TRN', 'AU_ABN', 'AU_ARN', 'BR_CNPJ', 'BR_CPF', 'CA_BN', 'CA_GST_HST', 'CA_PST_BC', 'CA_PST_MB', 'CA_PST_SK', 'CA_QST', 'CH_VAT', 'CL_TIN', 'ES_CIF', 'EU_VAT', 'GB_VAT', 'HK_BR', 'ID_NPWP', 'IL_VAT', 'IN_GST', 'JP_CN', 'JP_RN', 'KR_BRN', 'LI_UID', 'MX_RFC', 'MY_FRP', 'MY_ITN', 'MY_SST', 'NO_VAT', 'NZ_GST', 'RU_INN', 'RU_KPP', 'SA_VAT', 'SG_GST', 'SG_UEN', 'TH_VAT', 'TW_VAT', 'US_EIN', 'ZA_VAT']
})

export const UpdateTaxIdInput = inputObjectType({
  name: 'UpdateTaxIdInput',
  definition(t) {
    t.string('projectId', { required: true });
    t.field('taxType', { type: TaxType, required: true });
    t.string('taxId', { required: true });
  }
})

export const UpdateTaxId = mutationField('updateTaxId', {
  type: Ok,
  args: {
    input: arg({ required: true, type: UpdateTaxIdInput }),
  },
  authorize: requireProjectAccess({
    projectIdFn: (_, { input }) => input.projectId,
    role: 'ADMIN',
  }),
  async resolve(root, { input }, ctx) {
    const project = await ctx.prisma.project.findUnique({ where: { id: input.projectId }, select: { stripeCustomerId: true, stripeTaxId: true } });
    if (project.stripeTaxId) {
      await ctx.stripe.customers.deleteTaxId(project.stripeCustomerId, project.stripeTaxId);
      await ctx.prisma.project.update({
        where: { id: input.projectId },
        data: { stripeTaxId: null },
      });
    }

    const taxId = await ctx.stripe.customers.createTaxId(project.stripeCustomerId, {
      value: input.taxId,
      type: input.taxType,
    });
    await ctx.prisma.project.update({
      where: { id: input.projectId },
      data: {stripeTaxId: taxId.id },
    });
    return { ok: true };
  }
})

export const DeleteTaxId = mutationField('deleteTaxId', {
  type: Ok,
  args: {
    projectId: stringArg({ required: true }),
  },
  authorize: requireProjectAccess({
    projectIdFn: (_, { projectId }) => projectId,
    role: 'ADMIN',
  }),
  async resolve(root, { projectId }, ctx) {
    const project = await ctx.prisma.project.findUnique({ where: { id: projectId }, select: { stripeCustomerId: true, stripeTaxId: true } });
    await ctx.stripe.customers.deleteTaxId(project.stripeCustomerId, project.stripeTaxId);
    await ctx.prisma.project.update({ where: { id: projectId }, data: { stripeTaxId: null } });
    return { ok: true };
  }
})