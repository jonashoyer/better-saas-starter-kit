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
import { REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_PASSWORD } from './config';
import { ExecutionArgs } from 'graphql';
import { SubscribeMessage, Context as ContextWS } from 'graphql-ws';

export const pubsub = createPubsub({ host: REDIS_HOST, port: REDIS_PORT, db: REDIS_DB, password: REDIS_PASSWORD });
export const prisma = new PrismaClient();
export const redis = createRedisClient('client');
export const queueManager = createAppQueueManager({ worker: true }); // :MODULE worker

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

export const createSubscriptionContext = async (ctx: ContextWS<{ accessToken?: string, Cookie?: string, Authorization?: string }, { socket: WebSocket, request: Request }>, msg: SubscribeMessage, args: ExecutionArgs): Promise<Context> => {
  const { accessToken } = ctx.connectionParams ?? {};

  const user = await authorize({ accessToken, req: ctx.extra.request });
  return {
    req: ctx.extra.request,
    prisma,
    pubsub,
    redis,
    user,
    queueManager, // :MODULE worker
  }
}
