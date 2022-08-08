import Redis from 'ioredis';


export const simpleRateLimit = async (redis: Redis.Redis, key: string, msLimit: number) => {

  const now = Date.now();
  const last = await redis.get(key);

  if (last) {

    const diff = now - Number(last);
    if (diff < msLimit) {
      return false;
    }
  }

  await redis.set(key, now.toString());

  return true;
}