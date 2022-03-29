import { PrismaClient, User } from '@prisma/client';
import Redis from 'ioredis';
import { createRedisClient, createStripe, createAppQueueManager, StripeHandler } from 'shared-server';
import { ContextFunction } from 'apollo-server-core'
import { getSession } from 'next-auth/client';
import Stripe from 'stripe';
import { IncomingMessage, OutgoingMessage } from 'http';
import { Session } from '../pages/api/auth/[...nextauth]';

export const stripe = createStripe();
export const prisma = new PrismaClient();
export const redis = createRedisClient('client');
export const queueManager = createAppQueueManager();

export type Context<E = any> = {
  req: IncomingMessage & { cookies: Record<string, string> };
  res: OutgoingMessage;
  prisma: PrismaClient;
  redis: Redis.Redis;
  queueManager: typeof queueManager,
  stripe: Stripe;
  getStripeHandler: () => StripeHandler;
  user?: User;
  session?: Session;
  entity?: E;
};

export const createContext: ContextFunction<any> = async (ctx)  => {
  const session = await getSession({ req: ctx.req });

  return {
    req: ctx.req,
    res: ctx.res,
    prisma,
    redis,
    queueManager,
    stripe,
    getStripeHandler: () => new StripeHandler(stripe, prisma),
    user: session?.user,
    session,
  }
}
