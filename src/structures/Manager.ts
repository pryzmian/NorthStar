import { Hoshimi } from "hoshimi";
import type { UsingClient } from "seyfert";
import { NorthStarQueueStorage } from "./storage/Queue.js";

export class NorthstarManager extends Hoshimi {
    constructor(client: UsingClient) {
        super({
            nodes: [
                {
                    host: process.env.LAVALINK_HOST,
                    port: parseInt(process.env.LAVALINK_PORT),
                    password: process.env.LAVALINK_PASSWORD,
                    secure: process.env.LAVALINK_SECURE === "true",
                    id: process.env.LAVALINK_ID,
                },
            ],
            sendPayload: (guildId, payload) => {
                if (typeof guildId !== "string" || typeof guildId === "undefined")
                    return client.logger.warn("Manager#sendPayload: guildId is not a string.");

                return client.gateway.send(client.gateway.calculateShardId(guildId), payload);
            },
            queueOptions: {
                storage: new NorthStarQueueStorage(client),
            }
        });
    }
}
