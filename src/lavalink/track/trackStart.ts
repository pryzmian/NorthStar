import { Embed } from "seyfert";
import { createLavalinkEvent } from "../../structures/classes/Lavalink.js";
import { TimeFormat } from "../../utils/time.js";

export default createLavalinkEvent({
    name: "trackStart",
    run: async (client, player, track) => {
        if (!(player.textId && player.voiceId)) return;
        if (!track) return;

        const duration = track.info.isStream ? "🔴 Live" : (TimeFormat.toDotted(track.info.length) ?? "Unknown Duration");

        const embed = new Embed()
            .setTitle("▶️ Now Playing")
            .setDescription(
                `**${track.toHyperlink()}** [\`${duration}\`]\n> Requested by <@${track.requester.id}>\n> Author: **${track.info.author}**`,
            )
            .setThumbnail(track.info.artworkUrl ?? "")
            .setColor("Blurple");

        const message = await client.messages.write(player.textId, { embeds: [embed] });
        if (message) player.data.set("messageId", message.id);
    },
});
