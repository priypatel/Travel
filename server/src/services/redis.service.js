import { Redis } from '@upstash/redis';

let redis;

function getRedis() {
  if (!redis) {
    if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) return null;
    redis = new Redis({ url: process.env.REDIS_URL, token: process.env.REDIS_TOKEN });
  }
  return redis;
}

export async function redisGet(key) {
  try {
    const client = getRedis();
    if (!client) return null;
    return await client.get(key);
  } catch {
    return null;
  }
}

export async function redisSet(key, value, ttlSeconds) {
  try {
    const client = getRedis();
    if (!client) return;
    await client.set(key, value, { ex: ttlSeconds });
  } catch { /* ignore cache errors */ }
}

export async function redisDel(key) {
  try {
    const client = getRedis();
    if (!client) return;
    await client.del(key);
  } catch { /* ignore */ }
}
