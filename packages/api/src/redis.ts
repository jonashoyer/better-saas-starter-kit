import Redis from 'ioredis';
import { REDIS_URL, NODE_ENV, NodeEnv } from './config'

export const redisClient: Redis.Redis = createClient('new');
export const redisSubscriber : Redis.Redis = createClient('new');;

type clientTypes = 'client' | 'subscriber' | 'new' | 'bclient';

export function createClient (type: clientTypes) {
  switch (type) {
    case 'client':
      return redisClient;
    case 'subscriber':
      return redisSubscriber;
    case 'new':
    case 'bclient':
      return new Redis(REDIS_URL, {
        showFriendlyErrorStack: (NODE_ENV !== NodeEnv.Production),
        connectTimeout: 10e3,
        retryStrategy(times) {
          return Math.min(times * 50, 2000);
        },
      }).on('error', err => {
        console.error('redis', err);
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