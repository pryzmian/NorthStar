import { type QueueJson, QueueStorageAdapter, type RestOrArray } from "hoshimi";
import { CacheFrom, type UsingClient } from "seyfert";

export class NorthStarQueueStorage extends QueueStorageAdapter {
    /**
     * The client instance.
     * @type {UsingClient}
     */
    private readonly client: UsingClient;

    constructor(client: UsingClient) {
        super();
        this.client = client;
    }

    /**
     * Gets a value from the queue storage.
     * @param key The key to get.
     * @returns {ReturnCache<QueueJson | undefined>} The value from the queue storage.
     */
    override get(key: string) {
        const queue = this.client.cache.queues.get(this.buildKey(this.namespace, key));
        return this.parse(queue);
    }

    /**
     * Sets a value in the queue storage.
     * @param key The key to set.
     * @param value The value to set.
     * @returns {Awaitable<void>} A promise that resolves when the value is set.
     */
    override set<T extends QueueJson>(key: string, value: T) {
        return this.client.cache.queues.set(CacheFrom.Test, this.buildKey(this.namespace, key), this.stringify(value));
    }

    /**
     * Deletes a key from the queue storage.
     * @param key The key to delete.
     * @returns {Awaitable<boolean>} Whether the key was deleted.
     */
    override async delete(key: string) {
        try {
            await this.client.cache.queues.remove(this.buildKey(this.namespace, key));
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Clears all keys in the queue storage.
     * @returns {Awaitable<void>} A promise that resolves when the storage is cleared.
     */
    override async clear() {
        return this.client.cache.queues.flush();
    }

    /**
     * Checks if a key exists in the queue storage.
     * @param key The key to check.
     * @returns {boolean} Whether the key exists.
     */
    override has(key: string) {
        return this.get(this.buildKey(this.namespace, key)) !== undefined;
    }

    /**
     * Parses a value into a QueueJson object.
     * @param value The value to parse.
     * @returns {QueueJson} The parsed QueueJson object.
     */
    override parse(value: unknown): QueueJson {
        if (typeof value === "string") {
            if (!value.length) return {} as QueueJson;
            return JSON.parse(value) as QueueJson;
        }

        if (value && typeof value === "object") {
            if (!Object.keys(value).length) return {} as QueueJson;
            return value as QueueJson;
        }

        return {} as QueueJson;
    }

    /**
     * Stringifies a value into a string.
     * @param value The value to stringify.
     * @returns {R} The stringified value.
     */
    override stringify<R = string>(value: unknown) {
        return typeof value === "string" ? (value as R) : (JSON.stringify(value) as R);
    }

    /**
     * Build a key from the given parts.
     * @param {string[]} parts The parts to build the key from.
     * @returns {string} The built key.
     */
    override buildKey(...parts: RestOrArray<string>): string {
        const flattern = parts.flat();
        return flattern.join(":");
    }
}