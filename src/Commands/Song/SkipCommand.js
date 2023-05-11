const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
require("dotenv").config({ path: ".env" });
const colors = require("colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the current song or to a specific song in the queue.")
    .addIntegerOption((option) =>
      option
        .setName("position")
        .setDescription("The position of the song to skip to.")
        .setRequired(false)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const skipToIndex = interaction.options.getInteger("position");
    const voiceChannel = interaction.member.voice.channel;
    const clientVoiceChannel = interaction.guild.members.me.voice.channel;
    const player = interaction.client.player;
    const queue = player.queues.get(interaction.guildId);

    if (!voiceChannel)
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ED4245")
            .setDescription(
              `${process.env.FAIL_EMOJI} You must be in a voice channel to use this command.`
            ),
        ],
        ephemeral: true,
      });

    if (clientVoiceChannel && voiceChannel.id !== clientVoiceChannel.id)
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ED4245")
            .setDescription(
              `${process.env.FAIL_EMOJI} You must be in the same voice channel as me to use this command.`
            ),
        ],
        ephemeral: true,
      });

    if (!queue || queue.songs.length === 1)
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ED4245")
            .setDescription(
              `${process.env.FAIL_EMOJI} There are no songs in the queue.`
            ),
        ],
        ephemeral: true,
      });

    try {
      if (skipToIndex) {
        if (skipToIndex < 1 || skipToIndex > queue.songs.length - 1)
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#ED4245")
                .setDescription(
                  `${process.env.FAIL_EMOJI} Invalid song position.`
                ),
            ],
            ephemeral: true,
          });

        await queue.jump(skipToIndex - 1);

        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(interaction.guild.members.me.displayHexColor)
              .setDescription(
                `${process.env.SUCCESS_EMOJI} Skipped to song at position ${skipToIndex}.`
              ),
          ],
        });
      }

      await queue.skip().catch(() => {});

      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(interaction.guild.members.me.displayHexColor)
            .setDescription(
              `${process.env.SUCCESS_EMOJI} Skipped the current song.`
            ),
        ],
      });
    } catch (error) {
      console.error(
        `${colors.blue(new Date().toLocaleString())} ${colors.white(
          "An error occurred while executing the skip command:\n"
        )} ${colors.yellow(error.stack || error)}}`
      );

      player.voices?.leave(voiceChannel.id);
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ED4245")
            .setDescription(
              `${process.env.FAIL_EMOJI} An error occurred while trying to skip the song.`
            ),
        ],
        ephemeral: true,
      });
    }
  },
};
