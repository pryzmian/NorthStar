import { LoadType } from "hoshimi";
import { Command, createStringOption, Declare, type GuildCommandContext, Middlewares, Options } from "seyfert";
import { EmbedColors } from "seyfert/lib/common/index.js";
import { MessageFlags } from "seyfert/lib/types/index.js";
import { TimeFormat } from "../../utils/time.js";
import { omitKeys } from "../../utils/utils.js";

const options = {
    query: createStringOption({
        description: "The song or playlist to play",
        required: true,
        autocomplete: async (interaction) => {
            const { client, member, guildId } = interaction;

            if (!(guildId && member)) {
                return interaction.respond([{ name: "This command can only be used in a guild.", value: "noGuild" }]);
            }

            if (!client.manager.isUseable()) {
                return interaction.respond([{ name: "The music service is currently unavailable.", value: "noManager" }]);
            }

            const query = interaction.getInput().trim();
            if (!query) return interaction.respond([{ name: "Type to search for songs or playlists...", value: "emptyQuery" }]);

            const res = await client.manager.search({
                query,
                requester: omitKeys(member.user, ["client"]),
            });

            if (!res.tracks.length) return interaction.respond([{ name: "No results found for the given query.", value: "noResults" }]);

            return interaction.respond(
                res.tracks.slice(0, 10).map((track) => ({
                    name: `${track.info.title} - ${track.info.author} (${TimeFormat.toDotted(track.info.length)})`,
                    value: track.info.uri,
                })),
            );
        },
    }),
};

@Declare({
    name: "play",
    description: "Plays a song or adds it to the queue.",
    aliases: ["p"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Options(options)
@Middlewares(["InVoiceChannel","InSameVoiceChannel"])
export default class PlayCommand extends Command {
    override async run(ctx: GuildCommandContext<typeof options>) {
        const { client, channelId, author, options } = ctx;
        const { query } = options;

        if (!client.manager.isUseable())
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: EmbedColors.Red,
                        description: "❌ | The music service is currently unavailable. Please try again later.",
                    },
                ],
            });

        const bot = await ctx.me("flow");
        const memberVoiceState = await ctx.member.voice().catch(() => null);
        const botVoiceState = await bot.voice().catch(() => null);

        await ctx.deferReply();

        const player = client.manager.createPlayer({
            guildId: ctx.guildId,
            voiceId: memberVoiceState!.channelId!,
            textId: channelId,
            volume: 100,
            selfDeaf: true,
        });

        if (!player.connected) await player.connect();

        const { loadType, playlist, tracks } = await client.manager.search({
            query,
            requester: omitKeys(author, ["client"]),
        });

        const memberVoiceChannel = await memberVoiceState!.channel();
        if (memberVoiceChannel?.isStage() && botVoiceState?.suppress) await botVoiceState.setSuppress(false);

        switch (loadType) {
            case LoadType.Empty:
            case LoadType.Error: {
                return ctx.editOrReply({
                    embeds: [
                        {
                            color: EmbedColors.Red,
                            description: `\`❌\` | No results found for the given query.\n\`${query}\``,
                        },
                    ],
                });
            }
            case LoadType.Search:
            case LoadType.Track: {
                const track = tracks[0];
                player.queue.add(track);

                if (!player.playing) await player.play();

                const duration = track.info.isStream ? "🔴 Live" : (TimeFormat.toDotted(track.info.length) ?? "Unknown Duration");

                return ctx.editOrReply({
                    embeds: [
                        {
                            color: EmbedColors.Green,
                            description: `\`✅\` | Added **${track.toHyperlink()}** [${duration}] to the queue.`,
                        },
                    ],
                });
            }
            case LoadType.Playlist: {
                player.queue.add(tracks);

                if (!player.playing) await player.play();

                if (playlist) {
                    return ctx.editOrReply({
                        embeds: [
                            {
                                color: EmbedColors.Green,
                                description: `\`✅\` | Added playlist **${playlist.info.name}** (${tracks.length} tracks) to the queue.`,
                            },
                        ],
                    });
                }
            }
        }
    }
}
