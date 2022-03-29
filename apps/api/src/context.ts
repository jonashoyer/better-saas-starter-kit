import { PrismaClient, User } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';
import Redis from 'ioredis';
import {
  createRedisClient,
  createPubsub,
  createAppQueueManager, // :MODULE worker
} from 'shared-server';
import { ContextFunction } from 'apollo-server-core'
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { authorize } from './nextAuthUtils';
import { Request } from 'express';

export const pubsub = createPubsub();
export const prisma = new PrismaClient();
export const redis = createRedisClient('client');
export const queueManager = createAppQueueManager(); // :MODULE worker


export type Context = {
  req: Request;
  prisma: PrismaClient;
  pubsub: RedisPubSub;
  redis: Redis.Redis;
  user: User | null;
  queueManager: typeof queueManager; // :MODULE worker
};

export const createContext: ContextFunction<ExpressContext, Context> = async (ctx)  => {

  const user = await authorize({ req: ctx.req });
  return {
    req: ctx.req,
    prisma,
    pubsub,
    redis,
    user,
    queueManager, // :MODULE worker
  }
}

export const createSubscriptionContext = async (connectionParams: any, websocket: any, ctx: any): Promise<Context> => {
  const { accessToken } = connectionParams;
  const user = await authorize({ accessToken, req: ctx.request });
  return {
    req: ctx.request,
    prisma,
    pubsub,
    redis,
    user,
    queueManager, // :MODULE worker
  }
}
