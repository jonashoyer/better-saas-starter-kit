import { Context } from 'graphql/context';
import * as Prisma from '@prisma/client';
import ms from 'ms';
import { arg, inputObjectType, mutationField, objectType, queryField, stringArg } from 'nexus';
import { ForbiddenError } from 'apollo-server-micro';
import { requireAuth } from './permissions';
import crypto from 'crypto';
import { getURL } from 'utils';
import { simpleRateLimit, userService } from 'shared-server';
import { createUserWithProject } from 'shared-server/dist/services/userService';
import argon2 from 'argon2';
import { setCookie } from '../../../utils/cookies';

const isSelf = (root: Prisma.User, args: any, ctx: Context) => {
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

export const UserSignupInput = inputObjectType({
  name: 'UserSignupInput',
  definition(t) {
    t.string('email', { required: true });
    t.string('password', { required: true });
  }
})

export const UserSignup = mutationField('userSignup', {
  type: 'User',
  args: {
    input: arg({ type: UserSignupInput, required: true }),
  },
  async resolve(root, { input }, ctx) {

    const { email, password } = input;

    const userExists = await ctx.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (userExists) throw new ForbiddenError('User already exists');

    const accountExists = await ctx.prisma.account.findUnique({ where: { provider_providerAccountId: { provider: 'password', providerAccountId: email.toLowerCase() } } });
    if (accountExists) throw new ForbiddenError('User already exists');


    const account: Prisma.Prisma.AccountCreateWithoutUserInput = {
      type: 'credentials',
      provider: 'credentials',
      providerAccountId: email.toLowerCase(),
      accessToken: await argon2.hash(password),
    }

    const { user } = await createUserWithProject(ctx.prisma, { email: email.toLowerCase() }, account);
    ctx.user = user; // :/

    const session = await userService.generateUserSession(ctx.prisma, user.id);
    setCookie(ctx.res, 'sid', session.sessionToken);

    return user;
  },
})

export const UpdateUserInput = inputObjectType({
  name: 'UpdateUserInput',
  definition(t) {
    t.string('id', { required: true });
    t.string('name');
    t.string('email');
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

    try {

      const user = await ctx.prisma.user.update({
        where: { id: args.input.id },
        data: {
          ...(args.input.name && ctx.user.name !== args.input.name && { name: args.input.name }),
          ...(args.input.email && ctx.user.email !== args.input.email && { email: args.input.email, emailVerified: null }),
        }
      })
      
      return user;
    } catch (err) {
      if ((err as Prisma.Prisma.PrismaClientKnownRequestError).code === "P2002") {
        throw new ForbiddenError('Email already taken!'); // TODO: I18n!
      }
      throw err;
    }
  }
})


export const VerificationToken = objectType({
  name: 'VerificationToken',
  definition(t) {
    t.model.id();
  }
})

export const SendVerificationEmail = mutationField('sendVerificationEmail', {
  type: 'StatusResponse',
  authorize: requireAuth,
  async resolve(root, args, ctx) {
    
    if (ctx.user.emailVerified) throw new ForbiddenError('Email already verified!');
    if (!ctx.user.email) throw new ForbiddenError('No email set!');
    if (!(await simpleRateLimit(ctx.redis, `rl:verification-email:${ctx.user.id}`, ms('55s')))) throw new ForbiddenError('Please wait a moment before sending another verification email!');

    const verificationToken = await ctx.prisma.verificationToken.create({
      data: {
        expires: new Date(Date.now() + ms('1h')),
        token: crypto.randomBytes(32).toString('hex'),
        identifier: ctx.user.email,
      }
    }); 

    await ctx.queueManager.email.queue.add(
      'send',
      [{
        email: {
          from: { email: 'verify@notifications.better-saas.io', name: 'Better SaaS' },
          to: { email: ctx.user.email },
          subject: 'Verify your email',
        },
        template: {
          name: 'verificationEmail',
          context: {
            url: `${getURL()}?verify=${verificationToken.token}`,
          }
        }
      }],
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

    const verificationToken = await ctx.prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) throw new ForbiddenError('Bad token!');
    
    const user = await ctx.prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    })

    return user;
  }
})