import Redis from 'ioredis';


export const simpleRateLimit = async (redis: Redis.Redis, key: string, msLimit: number) => {

  const last = await redis.get(key);

  const now = Date.now();

  if (last) {

    const diff = now - Number(last);
    
    if (diff < msLimit) {
      return false;
    }
  }

  await redis.set(key, now.toString());

  return true;
}