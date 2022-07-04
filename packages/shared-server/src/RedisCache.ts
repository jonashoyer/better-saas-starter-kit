import type IORedis from 'ioredis';
import DataLoader from 'dataloader';

export interface KeyValueCacheSetOptions {
  /**
   * Specified in **seconds**, the time-to-live (TTL) value limits the lifespan
   * of the data being stored in the cache.
   */
  ttl?: number | null;
}


export interface RedisCacheOptions<T = any> {
  client: IORedis.Redis;
  sanitize?: (input: T) => string;
  desanitize?: (input: string | null) => T;

  defaultSetOptions?: KeyValueCacheSetOptions;

  keyPrefix?: string
}

class RedisCache<T = any> {

  readonly client: IORedis.Redis;

  private loader: DataLoader<string, string | null>;

  private sanitize: (input: T) => string;
  private desanitize: (input: string | null) => T;

  defaultSetOptions?: KeyValueCacheSetOptions;

  keyPrefix: string;

  constructor(options: RedisCacheOptions<T>) {
    const { client } = options;
    this.client = client;
    this.defaultSetOptions = options.defaultSetOptions;
    this.keyPrefix = options.keyPrefix ?? '';

    this.sanitize = options.sanitize ?? JSON.stringify;
    this.desanitize = options.desanitize ?? ((input: string | null) => input === null ? null : JSON.parse(input));

    this.loader = new DataLoader((keys) => client.mget(...keys), {
      cache: false,
    });
  }

  async set(
    key: string,
    value: T,
    options?: KeyValueCacheSetOptions,
  ): Promise<void> {

    const { ttl } = Object.assign({}, this.defaultSetOptions, options);
    if (typeof ttl === 'number') {
      await this.client.set(this.cacheKey(key), this.sanitize(value), 'EX', ttl);
      return;
    }
    
    await this.client.set(this.cacheKey(key), this.sanitize(value));
  }

  async get(key: string): Promise<T | null> {
    const reply = await this.loader.load(this.cacheKey(key));
    return this.desanitize(reply);
  }

  async mget(keys: string[]): Promise<(T | null)[]> {
    const reply = await this.loader.loadMany(keys.map(key => this.cacheKey(key)));
    return reply.map(e => this.desanitize(e as any));
  }

  async delete(key: string): Promise<boolean> {
    return (await this.client.del(this.cacheKey(key))) > 0;
  }

  async mdelete(keys: string[]): Promise<number> {
    return await this.client.del(keys.map(key => this.cacheKey(key)));
  }


  private cacheKey(key: string): string {
    return this.keyPrefix + key;
  }
}

export default RedisCache;