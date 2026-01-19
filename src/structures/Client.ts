import { Client } from "seyfert";
import { ActivityType, type GatewayPresenceUpdateData, PresenceUpdateStatus } from "seyfert/lib/types/index.js";
import { NorthStarMiddlewares } from "src/middlewares/index.js";
import { onMiddlewaresError } from "../utils/defaults.js";
import { LavalinkHandler } from "./handlers/Lavalink.js";
import { NorthstarManager } from "./Manager.js";
import { QueueResource } from "./storage/resources/Queue.js";

export class YumeClient extends Client<true> {
    /**
     * The Northstar manager.
     * @type {NorthstarManager}
     * @readonly
     */
    readonly manager: NorthstarManager;

    /**
     * The lavalink event handler.
     * @type {LavalinkHandler}
     * @readonly
     */
    readonly handler: LavalinkHandler;

    constructor() {
        super({
            gateway: {
                properties: {
                    os: process.platform,
                    device: "Discord IOS",
                },
            },
            allowedMentions: {
                parse: ["roles"],
                replied_user: false,
            },
            presence: (): GatewayPresenceUpdateData => ({
                afk: false,
                since: Date.now(),
                status: PresenceUpdateStatus.Online,
                activities: [{ name: "🎧 Just vibing", type: ActivityType.Listening }],
            }),
            commands: {
                reply: () => true,
                prefix: () => {
                    const prefixes: string[] = ["!", "?", "."];
                    return prefixes.map((prefix): string => prefix.toLowerCase());
                },
                deferReplyResponse: ({ client }) => ({
                    content: `<a:typing:1228830697343422535> **${client.me.username}** is thinking...`,
                }),
                defaults: {
                    onMiddlewaresError
                }
            },
        });

        this.manager = new NorthstarManager(this);
        this.handler = new LavalinkHandler(this);
    }

    async init(): Promise<void> {
        this.setServices({
            middlewares: NorthStarMiddlewares,
            cache: {
                disabledCache: {
                    bans: true,
                    overwrites: true,
                    presences: true,
                    stickers: true,
                    roles: true,
                    emojis: true,
                },
            },
        });

        this.cache.queues = new QueueResource(this.cache, this);
        if (this.cache.messages) this.cache.messages.filter = (message) => message.author.id === this.botId;

        await this.handler.start();
        await this.start();
    }
}
