import { Command, Declare, type GuildCommandContext } from "seyfert";
import { EmbedColors } from "seyfert/lib/common/it/constants.js";
import { MessageFlags } from "seyfert/lib/types/index.js";

@Declare({
    name: "stop",
    description: "Stops the music and clears the queue.",
    aliases: ["leave", "disconnect"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
export default class StopCommand extends Command {
    override async run(ctx: GuildCommandContext) {
        const { client, member } = ctx;

        const state = await member.voice();
        if (!state)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: EmbedColors.Red,
                        description: "❌ | You must be in a voice channel to use this command.",
                    },
                ],
            });

        const me = await ctx.me();
        const botState = await me.voice();

        if (botState && botState.channelId !== state.channelId) {
            return ctx.editOrReply({
                embeds: [
                    {
                        color: EmbedColors.Red,
                        description: "❌ | I am already playing music in another voice channel.",
                    },
                ],
            });
        }

        const player = client.manager.getPlayer(ctx.guildId);
        if (!player)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: EmbedColors.Red,
                        description: "❌ | No player found for this guild.",
                    },
                ],
            });
        
        await player.stop(true);

        return ctx.editOrReply({
            embeds: [
                {
                    color: EmbedColors.Green,
                    description: "⏹️ | Stopped the music and cleared the queue. Thank you for listening!",
                },
            ],
        });
    }
}