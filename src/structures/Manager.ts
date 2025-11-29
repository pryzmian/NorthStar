import { Hoshimi } from "hoshimi";
import type { UsingClient } from "seyfert";

export class NorthstarManager extends Hoshimi {
    constructor(client: UsingClient) {
        super({
            nodes: [
                {
                    host: process.env.LAVALINK_HOST,
                    port: parseInt(process.env.LAVALINK_PORT),
                    password: process.env.LAVALINK_PASSWORD,
                    secure: Boolean(process.env.LAVALINK_SECURE),
                },
            ],
            sendPayload: (guildId, payload) => {
                if (typeof guildId !== "string" || typeof guildId === "undefined")
                    return client.logger.warn("Manager#sendPayload: guildId is not a string.");

                return client.gateway.send(client.gateway.calculateShardId(guildId), payload);
            },
        });
    }
}
