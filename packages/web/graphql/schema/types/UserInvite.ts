import { arg, inputObjectType, mutationField, objectType, queryField, stringArg } from "nexus";
import { requireProjectAccess, hasUserProjectAccess } from "./permissions";
import crypto from 'crypto';
import { getURL } from "@/utils/utils";

export const UserInvite = objectType({
  name: 'UserInvite',
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.role();
    t.model.email();
  }
})

export const CreateUserInviteInput = inputObjectType({
  name: 'CreateUserInviteInput',
  definition(t) {
    t.string('emails', { required: true, list: true });
    t.string('projectId', { required: true });
    t.field('role', { type: 'ProjectRole', required: true });
  }
  
})

export const GetUserInvites  = queryField('getUserInvites', {
  type: 'UserInvite',
  list: true,
  args: {
    projectId: stringArg({ required: true }),
  },
  authorize: requireProjectAccess({ role: 'ADMIN', projectIdFn: (root, { projectId }) => projectId }),
  async resolve(root, { projectId }, ctx) {
    return ctx.prisma.userInvite.findMany({
      where: { projectId },
    })
  }
})

export const CreateManyUserInvite = mutationField('createManyUserInvite', {
  type: 'UserInvite',
  list: true,
  args: {
    input: arg({ type: CreateUserInviteInput, required: true }),
  },
  authorize: requireProjectAccess({ role: 'ADMIN', projectIdFn: (_, { input }) => input.projectId }),
  async resolve(root, { input }, ctx) {

    const project = await ctx.prisma.project.findUnique({ where: { id: input.projectId }, select: { name: true } });

    const data = input.emails.map(email => ({
      email,
      projectId: input.projectId,
      role: input.role,
      token: crypto.randomBytes(32).toString('hex'),
    }));

    await ctx.prisma.userInvite.createMany({
      data,
    });
    
    await ctx.queueManager.queues.email.add(
      'send',
      data.map(e => ({
        email: {
          from: { email: 'invites@notifications.better-saas.io', name: ctx.user.name ?? project.name },
          to: { email: e.email },
          subject: `You’ve been invited to ${project.name}`,
        },
        template: {
          name: 'projectInvite',
          context: {
            projectName: project.name,
            url: `${getURL()}?invite=${e.token}`,
          }
        }
      }))
    )

    return ctx.prisma.userInvite.findMany({
      where: { token: { in: data.map(e => e.token) } },
    });
  }
})



export const DeleteUserInvite = mutationField('deleteUserInvite', {
  type: 'UserInvite',
  args: {
    id: stringArg({ required: true })
  },
  async resolve(root, { id }, ctx) {
  
    const userInvite = await ctx.prisma.userInvite.findUnique({
      where: { id },
    })

    if (!(await hasUserProjectAccess(ctx.prisma, ctx.user.id, userInvite.projectId, 'ADMIN'))) {
      throw new Error('Not allowed!');
    }

    return ctx.prisma.userInvite.delete({
      where: { id }
    });
  }
})