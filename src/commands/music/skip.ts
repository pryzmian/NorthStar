import { Command, createIntegerOption, Declare, type GuildCommandContext, Options } from "seyfert";
import { EmbedColors } from "seyfert/lib/common/it/constants.js";
import { MessageFlags } from "seyfert/lib/types/index.js";

const options = {
    position: createIntegerOption({
        description: "The position of the song in the queue to skip to.",
        required: false,
    }),
};

@Declare({
    name: "skip",
    description: "Skips the current song or skips to a specific position in the queue.",
    aliases: ["s", "next"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Options(options)
export default class SkipCommand extends Command {
    override async run(ctx: GuildCommandContext<typeof options>) {
        const { client, options } = ctx;

        const state = await ctx.member.voice();
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
        const bot = await me.voice();

        if (bot && bot.channelId !== state.channelId)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: EmbedColors.Red,
                        description: "❌ | I am already playing music in another voice channel.",
                    },
                ],
            });

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

        if (!player.queue.totalSize) {
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: EmbedColors.Red,
                        description: "❌ | The queue is empty.",
                    },
                ],
            });
        }

        await ctx.deferReply();

        const { position } = options;
        const current = player.queue.current;

        if (!position) {
            await player.skip(undefined, false);
            return ctx.editOrReply({
                embeds: [
                    {
                        color: EmbedColors.Green,
                        description: `⏭️ | Skipped ${current?.toHyperlink()}`,
                    },
                ],
            });
        }

        if (position < 1 || position > player.queue.size) {
            return ctx.editOrReply({
                embeds: [
                    {
                        color: EmbedColors.Red,
                        description: `❌ | The position must be between 1 and ${player.queue.size}`,
                    },
                ],
            });
        }

        await player.skip(position, false);
        return ctx.editOrReply({
            embeds: [
                {
                    color: EmbedColors.Green,
                    description: `⏭️ | Skipped to song at position ${position} in the queue.`,
                },
            ],
        });
    }
}
