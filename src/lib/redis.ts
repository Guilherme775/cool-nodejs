import Redis from 'ioredis';

export const redis = new Redis({
    host: "localhost",
    port: 6379,
    keyPrefix: "cache:"
});

export const get = async (key: Redis.KeyType) => {
    const value = await redis.get(key);

    return value ? JSON.parse(value) : null;
}

export const set = (key: Redis.KeyType, value: any, timeExp: number) => {
    return redis.set(key, JSON.stringify(value), "EX", timeExp);
}

export const del = (key: Redis.KeyType) => {
    return redis.del(key)
}

export const delPrefix = async (prefix: string) => {
    const keys = (await redis.keys(`cache:${prefix}:*`)).map(key => key.replace("cache:", ""));

    return keys.map(key => del(key));
}
