import { PrismaClient, User } from '@prisma/client';
import Redis from 'ioredis';
import { createRedisClient, createStripe, StripeHandler } from 'bs-shared-server-kit';
import { ContextFunction } from 'apollo-server-core'
import { getSession } from 'next-auth/client';
import Stripe from 'stripe';

export const stripe = createStripe();
export const prisma = new PrismaClient();
export const redis = createRedisClient('client');

export type Context = {
  prisma: PrismaClient;
  redis: Redis.Redis;
  stripe: Stripe;
  getStripeHandler: () => StripeHandler;
  user?: User;
};

export const createContext: ContextFunction<any> = async (ctx)  => {
  const session = await getSession({ req: ctx.req });
  
  return {
    prisma,
    redis,
    stripe,
    getStripeHandler: () => new StripeHandler(stripe, prisma),
    user: session?.user,
  }
}
