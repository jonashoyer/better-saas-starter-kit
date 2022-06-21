import type * as Prisma from "@prisma/client"
import type { Profile } from "next-auth"
import type { AdapterSession } from "next-auth/adapters"
import { StripeHandler } from '../StripeHandler';
import { createStripe } from '../stripe';
import cuid from 'cuid';
import { DEFAULT_SUBSCRIPTION_PRICE_ID, JWT_SECRET } from "../config";
import jwt from 'jsonwebtoken';
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid';

const ACCESS_TOKEN_EXPIRES_IN = '20m';

export const getUser = (prisma: Prisma.PrismaClient,id: string) => {
  // TODO: Caching layer?
  return prisma.user.findUnique({ where: { id } });
}

export const createUserWithProject = async (prisma: Prisma.PrismaClient, profile: Profile & { emailVerified?: Date; }, account?: Prisma.Prisma.AccountCreateWithoutUserInput) => {
  if (!DEFAULT_SUBSCRIPTION_PRICE_ID) throw new Error('Missing subscription price ID!');

  const projectId = cuid();

  const name = profile.name || profile.email?.split('@')[0] || 'Unnamed';
  const firstName = name.split(' ')[0];

  const stripe = new StripeHandler(createStripe(), prisma);
  const stripeCustomer = await stripe.createCustomer({
    name,
    email: profile.email,
    metadata: {
      projectId,
    },
  });
  const stripeSubscription = await stripe.createSubscription(stripeCustomer.id, DEFAULT_SUBSCRIPTION_PRICE_ID, 1);

  try {

    const project = await prisma.project.create({
      data: {
        id: projectId,
        name: `${firstName}'s Project`,
        stripeCustomerId: stripeCustomer.id,
        users: {
          create: {
            role: 'ADMIN',
            user: {
              create: {
                name,
                email: profile.email,
                image: profile.image,
                emailVerified: profile.emailVerified?.toISOString() ?? null,
                ...(account && { accounts: { create: account } }),
              }
            }
          }
        },
        stripeSubscriptions: {
          create: stripeSubscription,
        }
      },
      include: {
        users: {
          include: {
            user: true,
          }
        }
      }
    });

    return {
      project,
      user: project.users[0].user,
    }
  } catch (err: any) {
    console.error(err);
    await stripe.stripe.subscriptions.del(stripeSubscription.id);
    await stripe.deleteCustomer(stripeCustomer.id);
    throw new err;
  }
}

export const generateUserSession = (prisma: Prisma.PrismaClient, userId: string) => {
  return createUserSession(prisma, {
    userId,
    expires: dayjs().add(1, 'month').toDate(),
    sessionToken: uuidv4(),
  })
}

export const createUserSession = async (prisma: Prisma.PrismaClient, data: Prisma.Prisma.XOR<Prisma.Prisma.SessionCreateInput, Prisma.Prisma.SessionUncheckedCreateInput>, generateAccessToken = false) => {
  const session = await prisma.session.create({ data });
  return withAccessToken(generateAccessToken, session);
}

export const withAccessToken = (withAccessToken: boolean, session: AdapterSession) => {
  if (!withAccessToken) return session;
  return {
    ...session,
    accessToken: generateJWT(session.userId),
  }
}

export const generateJWT = (userId: string) => {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}
