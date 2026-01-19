import { config } from "seyfert";
import { GatewayIntentBits } from "seyfert/lib/types";

/**
 * @typedef YumeLocations
 * @property {string} lavalink
 */

export default config.bot({
    debug: process.argv.includes("--debug"),
    token: process.env.BOT_TOKEN ?? "",
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildVoiceStates,
    ],
    /**
     * @type {import("seyfert").RuntimeConfig["locations"] & YumeLocations}
     */
    locations: {
        base: process.argv.includes("--dev") ? "src" : "dist",
        events: "events",
        commands: "commands",
        lavalink: "lavalink",
    },
});
