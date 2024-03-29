import Redis from 'ioredis';
import { NodeEnv } from 'shared';
import { REDIS_DB, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from './config';

type clientTypes = 'client' | 'subscriber' | 'new' | 'bclient';

let redisClient: Redis.Redis, redisSubscriber: Redis.Redis;
export function createRedisClient (type: clientTypes, redisUrl?: string) {
  switch (type) {
    case 'client':
      if (!redisClient) redisClient = createRedisClient('new');
      return redisClient;
    case 'subscriber':
      if (!redisSubscriber) redisSubscriber = createRedisClient('new');
      return redisSubscriber;
    case 'new':
    case 'bclient':
      return new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        db: REDIS_DB,
        password: REDIS_PASSWORD,
        showFriendlyErrorStack: (process.env.NODE_ENV !== NodeEnv.Production),
        connectTimeout: 10e3,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        retryStrategy(times) {
          return Math.min(times * 50, 3000);
        },
      });
      
    default:
      throw new Error('Unexpected connection type: ' + type);
  }
}

export const scanAll = async (redisClient: Redis.Redis, pattern: string) => {
  const found: string[] = [];
  let cursor = '0';

  do {
    const reply = await redisClient.scan(cursor, 'MATCH', pattern);

    cursor = reply[0];
    found.push(...reply[1]);
  } while (cursor !== '0');

  return found;
}