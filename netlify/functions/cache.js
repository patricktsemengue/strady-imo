const cache = new Map();

export const get = (key) => {
    return cache.get(key);
};

export const set = (key, value) => {
    cache.set(key, value);
};
