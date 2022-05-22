import IORedis from 'ioredis';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export const createPubsub = (connection: IORedis.RedisOptions) => new RedisPubSub({
  connection,
});