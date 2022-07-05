import { asArray } from "shared";
import { RedisCache, KeyValueCacheSetOptions, RedisCacheOptions } from "./RedisCache";
import DataLoader from 'dataloader';

export interface CachedDataloaderOptions<K = string, T = any> {
  cacheOptions: RedisCacheOptions<T>;
  query: (keys: K[]) => Promise<T[]>;
  keyStringify?: (key: K) => string;
}

export class CachedDataloader<K = string, T = any> {
  readonly cache: RedisCache<T>;

  private loader: DataLoader<K, T | null>;

  private query: (keys: K[]) => Promise<T[]>;
  private stringifyKey: (key: K) => string;

  constructor(options: CachedDataloaderOptions<K, T>) {
    this.cache = new RedisCache<T>(options.cacheOptions);

    this.query = options.query;
    this.stringifyKey = options.keyStringify ?? String;

    this.loader = new DataLoader(async (keys) => {

      const cacheResult = await this.cache.mget(this.stringifyKeys(keys));
      const missingKeys = keys.reduce<{ key: K, index: number}[]>((arr, key, index) => {
        if (cacheResult[index] !== null) return arr;
        return [...arr, { key, index }];
      }, []);

      const getResult = missingKeys.length > 0 ? (await this.query(missingKeys.map(e => e.key))) : [];

      return keys.map((key, i) => {
        if (cacheResult[i] !== null) return cacheResult[i];

        const getIndex = missingKeys.findIndex(e => e.index === i);

        const result = getResult[getIndex] ?? null;
        if (result !== null) this.set(key, result);

        return result;
      });
    }, {
      cache: false,
    });
  }
  async set(key: K, value: T, options?: KeyValueCacheSetOptions) {
    return this.cache.set(this.stringifyKey(key), value, options);
  }

  async get(key: K) {
    return this.loader.load(key);
  }

  async mget(keys: K[]) {
    return this.loader.loadMany(keys);
  }

  async invalidate(key: K | K[]) {
    return this.cache.mdelete(this.stringifyKeys(asArray(key)));
  }
  private stringifyKeys(keys: readonly K[]) {
    return keys.map(key => this.stringifyKey(key));
  }
}