import { Context } from 'graphql/context';
import * as prisma from '@prisma/client';
import ms from 'ms';
import { arg, inputObjectType, mutationField, objectType, queryField, stringArg } from 'nexus';
import { ForbiddenError } from 'apollo-server-micro';
import { requireAuth } from './permissions';
import crypto from 'crypto';
import { getURL } from 'utils';

const isSelf = (root: prisma.User, args: any, ctx: Context) => {
  if (!ctx.user?.id) return false;
  const user = root;
  return user.id === ctx.user?.id;
}

export const User = objectType({
  name: 'User', 
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.email(); // FIXME:
    t.model.emailVerified({ authorize: isSelf });
    t.model.name(); // FIXME: In project with
    t.model.image(); // FIXME: In project with
    t.model.projects({ authorize: isSelf });
  },
});

export const UserSelf = queryField('self', {
  type: 'User',
  nullable: true,
  authorize: requireAuth,
  resolve: async (parent, args, ctx) => {
    return ctx.user;
  },
})

export const UpdateUserInput = inputObjectType({
  name: 'UpdateUserInput',
  definition(t) {
    t.string('id', { required: true });
    t.string('name');
  }
})

export const UpdateUser = mutationField('updateUser', {
  type: 'User',
  authorize: requireAuth,
  args: {
    input: arg({ type: UpdateUserInput, required: true }),
  },
  async resolve(root, args, ctx) {
    if (args.input.id != ctx.user.id) throw new ForbiddenError('Not allowed resource!');
    const user = await ctx.prisma.user.update({
      where: { id: args.input.id },
      data: {
        name: args.input.name,
      }
    })

    return user;
  }
})


export const VerificationEmail = objectType({
  name: 'VerificationEmail',
  definition(t) {
    t.model.id();
  }
})

export const SendVerifyEmail = mutationField('sendVerifyEmail', {
  type: 'StatusResponse',
  args: {
    email: stringArg({ required: true }),
  },
  authorize: requireAuth,
  async resolve(root, { email }, ctx) {
    
    if (ctx.user.emailVerified) throw new ForbiddenError('Email already verified!');

    const accounts = await ctx.prisma.account.findMany({
      where: {
        userId: ctx.user.id,
      }
    });

    if (accounts.length == 0) throw new ForbiddenError('User has no account linked!');
    if (accounts.length > 1) throw new ForbiddenError('User has multiple account linked already!');

    const verificationEmail = await ctx.prisma.verificationEmail.create({
      data: {
        expires: new Date(Date.now() + ms('1h')),
        token: crypto.randomBytes(32).toString('hex'),
        accountId: accounts[0].id,
        email,
      }
    });

    await ctx.queueManager.queues.email.add(
      'send',
      [{
        email: {
          from: { email: 'verify@notifications.better-saas.io', name: 'Better SaaS' },
          to: { email },
          subject: 'Verify your email',
        },
        template: {
          name: 'verificationEmail',
          context: {
            url: `${getURL()}?verify=${verificationEmail.token}`,
          }
        }
      }]
    );

    return {
      ok: true
    }
  }
})

export const VerifiyEmail = mutationField('verifyEmail', {
  type: 'User',
  args: {
    token: stringArg({ required: true }),
  },
  authorize: requireAuth,
  async resolve(root, { token }, ctx) {

    const verificationEmail = await ctx.prisma.verificationEmail.findUnique({
      where: { token },
    });

    if (!verificationEmail) throw new ForbiddenError('Bad token!');

    const accounts = await ctx.prisma.account.findMany({
      where: {
        userId: ctx.user.id,
      }
    });

    if (accounts.length == 0) throw new ForbiddenError('User has no account linked!');
    if (accounts.length > 1) throw new ForbiddenError('User has multiple account linked already!');

    if (!accounts.some(e => e.id == verificationEmail.accountId)) throw new ForbiddenError('Verification not intended for this user!');
    
    const user = await ctx.prisma.user.update({
      where: { id: accounts[0].id },
      data: { email: verificationEmail.email, emailVerified: new Date() },
    })

    return user;
  }
})