import { PrismaClient, User } from '@prisma/client';
import Redis from 'ioredis';
import { redisClient } from './redis';
import { ContextFunction } from 'apollo-server-core'
import { getSession } from 'next-auth/client';

export const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient;
  redis: Redis.Redis;
  user?: User;
};

export const createContext: ContextFunction<any> = async (ctx)  => {
  const session = await getSession({ req: ctx.req });
  
  return {
    prisma,
    redis: redisClient,
    user: session?.user,
  }
}
