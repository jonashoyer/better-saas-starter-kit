import { Context } from "graphql/context";
import * as prisma from '@prisma/client';
import { UserInputError } from "apollo-server-micro";
import { arg, enumType, inputObjectType, mutationField, objectType, stringArg } from "nexus";
import { hasUserProjectAccess } from "./permissions";


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


const requireRoleOfUserProject = (opt: { userProjectIdFn: (root: any, args: any, ctx: Context) => string, role?:  'ANY' | prisma.ProjectRole }) => async (root: any, args: any, ctx: Context) => {
  const userProjectId = opt.userProjectIdFn(root, args, ctx);
  const userProject = await ctx.prisma.userProject.findUnique({ where: { id: userProjectId } });
  return hasUserProjectAccess(ctx.prisma, ctx.user.id, userProject.projectId, opt.role);
}


export const UpdateUserProjectInput = inputObjectType({
  name: 'UpdateUserProjectInput',
  definition(t) {
    t.string('id', { required: true });
    t.field('role', { type: ProjectRole });
  }
})

export const UpdateUserProject = mutationField('updateUserProject', {
  type: 'UserProject',
  args: {
    input: arg({ type: UpdateUserProjectInput, required: true })
  },
  authorize: requireRoleOfUserProject({
    userProjectIdFn: (_, { input }) => input.id,
    role: 'ADMIN',
  }),
  async resolve(root, { input }, ctx) {
    if (input.id === ctx.user.id) {
      if (input.role) throw new UserInputError('You cannot set your own project role!');
    }
    
    const userProject = await ctx.prisma.userProject.update({
      where: { id: input.id },
      data: { role: input.role },
    });

    return userProject;
  }
})

export const DeleteUserProject = mutationField('deleteUserProject', {
  type: 'UserProject',
  args: {
    id: stringArg({ required: true }),
  },
  authorize: requireRoleOfUserProject({
    userProjectIdFn: (_, { id }) => id,
    role: 'ADMIN',
  }),
  async resolve(root, { id }, ctx) {

    const userProject = await ctx.prisma.userProject.findUnique({ where: { id }, select: { userId: true, projectId: true } });

    if (userProject.userId === ctx.user.id) {
      throw new UserInputError('You cannot remove yourself from a project!');
    }

    await ctx.getStripeHandler().updateProjectSubscriptionUsedSeats(userProject.projectId);

    return ctx.prisma.userProject.delete({
      where: { id }
    });
  }
})