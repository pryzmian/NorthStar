import { config } from "seyfert";

/**
 * @typedef YumeLocations
 * @property {string} lavalink
 */

export default config.bot({
    debug: process.argv.includes("--debug"),
    token: process.env.BOT_TOKEN ?? "",
    intents: ["Guilds", "GuildVoiceStates", "GuildMessages", "MessageContent"],
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
