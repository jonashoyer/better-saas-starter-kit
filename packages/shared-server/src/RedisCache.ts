import type IORedis from 'ioredis';
import { BaseRedisCache } from 'apollo-server-cache-redis/dist/BaseRedisCache';


class RedisCache extends BaseRedisCache {
  constructor(redis: IORedis.Redis, defaultTTL: number | null = null) {
    super({ client: redis });
    this.defaultSetOptions.ttl = defaultTTL;
  }
}

export default RedisCache;