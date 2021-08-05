import { enumType, objectType, queryField, stringArg } from 'nexus';
import { hasProjectAccess } from './permissions';

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
  authorize: hasProjectAccess({ nullable: true, role: 'ADMIN' }),
  args: {
    projectId: stringArg({ nullable: true }),
  },
  async resolve(root, { projectId }, ctx) {

    const getProjetId = async () => {
      if (projectId) return projectId;
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