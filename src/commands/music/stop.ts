import { Command, Declare, type GuildCommandContext, Middlewares } from "seyfert";
import { EmbedColors } from "seyfert/lib/common/it/constants.js";
import { MessageFlags } from "seyfert/lib/types/index.js";

@Declare({
    name: "stop",
    description: "Stops the music and clears the queue.",
    aliases: ["leave", "disconnect"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["InVoiceChannel","InSameVoiceChannel"])
export default class StopCommand extends Command {
    override async run(ctx: GuildCommandContext) {
        const { client } = ctx;

        const player = client.manager.getPlayer(ctx.guildId);
        if (!player)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: EmbedColors.Red,
                        description: "`❌` | No player found for this guild.",
                    },
                ],
            });

        await player.stop(true);

        return ctx.editOrReply({
            embeds: [
                {
                    color: EmbedColors.Green,
                    description: "`⏹️` | Stopped the music and cleared the queue. Thank you for listening!",
                },
            ],
        });
    }
}
