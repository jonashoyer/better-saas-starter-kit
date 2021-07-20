import { PrismaClient, User } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';
import Redis from 'ioredis';
import { redisClient } from 'bs-shared-kit';
import { ContextFunction, Context as CoreContext } from 'apollo-server-core'
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { authorize } from './nextAuthUtils';

export const pubsub = new RedisPubSub();
export const prisma = new PrismaClient();


export type Context = {
  prisma: PrismaClient;
  pubsub: RedisPubSub;
  redis: Redis.Redis;
  user?: User;
};

export const createContext: ContextFunction<ExpressContext, CoreContext> = async (ctx)  => {
  
  const user = await authorize({ req: ctx.req });
  return {
    prisma,
    pubsub,
    redis: redisClient,
    user,
  }
}
