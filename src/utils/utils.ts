import { pathToFileURL } from "node:url";

/**
 * Omit keys from an object.
 * @param {T} obj The object to omit keys.
 * @param {K[]} keys The keys to omit.
 * @returns {Omit<T, K>} The object without the keys.
 */
export const omitKeys = <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> =>
    Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key as K))) as Omit<T, K>;

/**
 *
 * Import a file dynamically.
 * @param {string} path The path to the file.
 * @returns {Promise<T>} The imported file.
 */
export const customImport = <T>(path: string): Promise<T> =>
    import(`${pathToFileURL(path)}?update=${Date.now()}`).then((x) => x.default ?? x) as Promise<T>;
