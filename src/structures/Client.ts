import { RedisAdapter } from "@slipher/redis-adapter";
import { Client } from "seyfert";
import { ActivityType, type GatewayPresenceUpdateData, PresenceUpdateStatus } from "seyfert/lib/types/index.js";
import { LavalinkHandler } from "./handlers/Lavalink.js";
import { NorthstarManager } from "./Manager.js";

export class YumeClient extends Client<true> {
    /**
     * The Northstar manager.
     * @type {NorthstarManager}
     */
    readonly manager: NorthstarManager;

    /**
     * The lavalink event handler.
     * @type {LavalinkHandler}
     */
    readonly handler: LavalinkHandler;

    constructor() {
        super({
            gateway: {
                properties: {
                    os: process.platform,
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
            },
        });

        this.manager = new NorthstarManager(this);
        this.handler = new LavalinkHandler(this);
    }

    async init(): Promise<void> {
        this.setServices({
            cache: {
                adapter: new RedisAdapter({
                    redisOptions: {
                        url: process.env.REDIS_URL,
                    },
                }),
                disabledCache: {
                    bans: true,
                    overwrites: true,
                    presences: true,
                    stickers: true,
                    messages: true,
                    roles: true,
                    emojis: true,
                },
            },
        });

        await this.handler.load();
        await this.start();
    }
}
