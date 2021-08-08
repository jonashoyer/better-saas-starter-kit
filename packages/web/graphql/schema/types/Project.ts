import { arg, enumType, inputObjectType, mutationField, objectType, queryField, stringArg } from 'nexus';
import { hasAuth, hasProjectAccess } from './permissions';

export const Project = objectType({
  name: 'Project',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.users();
    t.model.paymentMethods();
  },
});

export const UserProject = objectType({
  name: 'UserProject',
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.role();
    t.model.user();
    t.model.project();
  }
})

export const ProjectRole = enumType({
  name: 'ProjectRole',
  members: ['ADMIN', 'USER'],
})


export const CurrentProject = queryField('currentProject', {
  type: 'Project',
  authorize: hasProjectAccess({
    nullable: true,
    projectIdFn: (root, args, ctx) => args.projectId ?? ctx.req.cookies['bs.project-id'],
  }),
  args: {
    projectId: stringArg({ nullable: true }),
  },
  async resolve(root, { projectId }, ctx) {

    const getProjetId = async () => {
      if (projectId) return projectId;
      if (ctx.req.cookies['bs.project-id']) return ctx.req.cookies['bs.project-id'];
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
    update: arg({ type: UpdateProjectInput, required: true })
  },
  authorize: hasProjectAccess({
    projectIdFn: (_, { update }) => update.id,
    role: 'ADMIN',
  }),
  async resolve(root, { update: { id, name } }, ctx) {
    const project = await ctx.prisma.project.update({
      where: { id },
      data: { name },
    });

    return project;
  }
})