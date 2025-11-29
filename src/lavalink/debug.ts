import { DebugLevels } from "hoshimi";
import { createLavalinkEvent } from "../structures/classes/Lavalink.js";

export default createLavalinkEvent({
    name: "debug",
    run: async (client, level, message) => {
        const isDebugEnabled = await client.getRC().then((x) => x.debug);
        if (isDebugEnabled) client.logger.debug(`[Lavalink] [${DebugLevels[level]}] ${message}`);
    },
});
