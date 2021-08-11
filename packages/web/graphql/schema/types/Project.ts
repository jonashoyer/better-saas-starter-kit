import cuid from 'cuid';
import { arg, inputObjectType, mutationField, objectType, queryField, stringArg } from 'nexus';
import { hasAuth, hasProjectAccess } from './permissions';
import { Constants } from 'bs-shared-kit';

export const Project = objectType({
  name: 'Project',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.users();
    t.model.paymentMethods();
    t.model.userInvites();
  },
});

export const CurrentProject = queryField('currentProject', {
  type: 'Project',
  authorize: hasProjectAccess({
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
  authorize: hasAuth,
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
  authorize: hasAuth,
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

    try {
      const project = await ctx.prisma.project.create({
        data: {
          ...input,
          id: projectId,
          stripeCustomerId: stripeCustomer.id,
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
  authorize: hasProjectAccess({
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
  authorize: hasProjectAccess({
    projectIdFn: (_, { id }) => id,
    role: 'ADMIN',
  }),
  async resolve(root, { id }, ctx) {
    return ctx.prisma.project.delete({ where: { id } });
  }
})