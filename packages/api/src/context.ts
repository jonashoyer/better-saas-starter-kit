import { PrismaClient, User } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';
import Redis from 'ioredis';
import { redisClient, createPubsub } from 'bs-shared-kit';
import { ContextFunction, Context as CoreContext } from 'apollo-server-core'
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { authorize } from './nextAuthUtils';
import { Request } from 'express';

export const pubsub = createPubsub();
export const prisma = new PrismaClient();


export type Context = {
  req: Request;
  prisma: PrismaClient;
  pubsub: RedisPubSub;
  redis: Redis.Redis;
  user: User | null;
};

export const createContext: ContextFunction<ExpressContext, Context> = async (ctx)  => {

  const user = await authorize({ req: ctx.req });
  return {
    req: ctx.req,
    prisma,
    pubsub,
    redis: redisClient,
    user,
  }
}

export const createSubscriptionContext = async (connectionParams: any, websocket: any, ctx: any): Promise<Context> => {
  const { accessToken } = connectionParams;
  const user = await authorize({ accessToken, req: ctx.request });
  return {
    req: ctx.request,
    prisma,
    pubsub,
    redis: redisClient,
    user,
  }
}
