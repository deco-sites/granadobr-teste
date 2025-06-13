/**
 * Generates a cache key string from a URL and an object by concatenating the URL with the object's properties and values.
 *
 * @param {string} url - The base URL to start the cache key.
 * @param {object} obj - The object to generate a cache key from.
 * @returns {string} The generated cache key string.
 */
export default function generateCacheKey<T>(url: string, obj: T): string {
  return `${url}?${buildKey<T>(obj).slice(0, -1)}`;
}

/**
 * Recursively builds a key string from an object's properties and values.
 *
 * @param {any} value - The current value to process.
 * @param {string} [parentKey=''] - The parent key string to prepend.
 * @returns {string} The built key string.
 */
// deno-lint-ignore no-explicit-any
function buildKey<T>(value: T | any, parentKey: string = ""): string {
  if (typeof value !== "object" || value === null) {
    return `${parentKey}:${String(value)},`;
  }

  return Object.keys(value).reduce((acc, key) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    return acc + buildKey<T>(value[key], fullKey);
  }, "");
}
