/**
 * Removes properties with `undefined` or `null` values from an object.
 *
 * @template T - The type of the object.
 * @param {T} obj - The object to be cleaned.
 * @returns {T} - A new object with all properties that have `undefined` or `null` values removed.
 *
 * @example
 * const dirtyObject = { a: 1, b: undefined, c: null, d: 4 };
 * const cleanedObject = cleanObject(dirtyObject);
 * console.log(cleanedObject); // Output: { a: 1, d: 4 }
 */
export function cleanObject<T>(obj: T): T {
  const cleanedObj: Partial<T> = {};
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      cleanedObj[key] = obj[key];
    }
  }
  return cleanedObj as T;
}
