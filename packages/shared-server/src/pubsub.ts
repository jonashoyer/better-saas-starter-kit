import { RedisPubSub } from 'graphql-redis-subscriptions';

export const createPubsub = () => new RedisPubSub();