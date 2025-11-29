import type { HoshimiEvents } from "hoshimi";
import type { UsingClient } from "seyfert";
import type { Awaitable } from "seyfert/lib/common/index.js";

interface LavalinkEvent<K extends keyof HoshimiEvents> {
    /**
     * The event name.
     * @type {K}
     */
    name: K;
    /**
     * The event run callback.
     * @type {LavalinkEventRun<K>}
     */
    run: LavalinkEventRun<K>;
    /**
     * The event once property.
     * @type {boolean}
     * @default false
     */
    once?: boolean;
}

type LavalinkEventRun<K extends keyof HoshimiEvents> = (client: UsingClient, ...args: HoshimiEvents[K]) => Awaitable<any>;

export class Lavalink<K extends keyof HoshimiEvents = keyof HoshimiEvents> implements LavalinkEvent<K> {
    /**
     * The file path of the event.
     * @type {string}
     * @readonly
     */
    public filepath?: string;

    /**
     * The event name.
     * @type {K}
     * @readonly
     */
    readonly name: K;
    /**
     * The event run function.
     * @type {LavalinkEventRun<K>}
     * @readonly
     */
    readonly run: LavalinkEventRun<K>;

    /**
     * The event once property.
     * @type {boolean}
     * @readonly
     * @default false
     */
    readonly once: boolean = false;

    constructor(event: LavalinkEvent<K>) {
        this.name = event.name;
        this.once = event.once ?? false;
        this.run = event.run;
    }
}

/**
 *
 * Create a new lavalink event.
 * @param {LavalinkEvent<K>} event The event to create.
 * @returns {Lavalink<K>} The created event.
 */
export const createLavalinkEvent = <K extends keyof HoshimiEvents>(event: LavalinkEvent<K>): LavalinkEvent<K> => new Lavalink<K>(event);
