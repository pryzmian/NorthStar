import type { HoshimiEvents } from "hoshimi";
import type { UsingClient } from "seyfert";
import { BaseHandler } from "seyfert/lib/common/index.js";
import { customImport } from "../../utils/utils.js";
import type { Lavalink } from "../classes/Lavalink.js";

type LavalinkEventParameters = HoshimiEvents[keyof HoshimiEvents];
type LavalinkEventNames = keyof HoshimiEvents;

export class LavalinkHandler extends BaseHandler {
    /**
     * Filter to only include .ts or .js files.
     * @param path The path to filter
     * @returns {boolean}
     */
    override filter: (path: string) => boolean = (path: string) => path.endsWith(".ts") || path.endsWith(".js");

    /**
     * The lavalink events collection.
     * @type {Map<string, Lavalink>}
     */
    readonly values: Map<LavalinkEventNames, Lavalink> = new Map<LavalinkEventNames, Lavalink>();

    /**
     * The client instance.
     * @type {UsingClient}
     */
    readonly client: UsingClient;

    constructor(client: UsingClient) {
        super(client.logger);
        this.client = client;
    }

    /**
     * Loads the handler.
     * @returns {Promise<void>}
     */
    public async load(): Promise<void> {
        const files = await this.loadFilesK<{ default: Lavalink }>(
            await this.getFiles(await this.client.getRC().then((x) => x.locations.lavalink)),
        );

        for (const file of files) {
            const event: Lavalink = file.file.default;
            if (!event) {
                this.logger.warn(`${file.name} doesn't export by \`export default new Lavaink({ ... })\``);
                continue;
            }

            if (!event.name) {
                this.logger.warn(`${file.name} doesn't have a \`name\` property`);
                continue;
            }

            if (typeof event.run !== "function") {
                this.logger.warn(`${file.name} doesn't have a \`run\` function`);
                continue;
            }

            const run = (...args: LavalinkEventParameters) => event.run(this.client, ...args);

            event.filepath = file.path;

            if (event.once) this.client.manager.once(event.name, run);
            else this.client.manager.on(event.name, run);

            this.values.set(event.name, event);
        }
    }

    /**
     * Reload a specific event.
     * @param {LavalinkEventNames} name The event name.
     * @returns {Promise<void>} Boo! A promise.
     */
    public async reload(name: LavalinkEventNames): Promise<void> {
        const oldEvent: Lavalink | undefined = this.values.get(name);
        if (!oldEvent?.filepath) return;

        this.client.manager.removeListener(oldEvent.name, oldEvent.run as never);

        const newEvent: Lavalink = await customImport<Lavalink>(oldEvent.filepath);
        if (!newEvent) return;

        newEvent.filepath = oldEvent.filepath;

        const run = (...args: LavalinkEventParameters) => newEvent.run(this.client, ...args);

        if (newEvent.once) this.client.manager.once(newEvent.name, run);
        else this.client.manager.on(newEvent.name, run);

        this.values.set(newEvent.name, newEvent);
    }

    /**
     *
     * Reload all manager events.
     * @returns {Promise<void>} A promise? Now that's a surprise.
     */
    public async reloadAll(): Promise<void> {
        for (const name of this.values.keys()) {
            await this.reload(name);
        }
    }
}
