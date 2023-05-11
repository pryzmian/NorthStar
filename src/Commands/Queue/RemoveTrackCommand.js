const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
require("dotenv").config({ path: ".env" });
const colors = require("colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-track")
    .setDescription("Remove a song from the queue.")
    .addIntegerOption((option) =>
      option
        .setName("position")
        .setDescription("The position of the song to delete.")
        .setRequired(true)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const removeTrackIndex = interaction.options.getInteger("position");
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
              `${process.env.FAIL_EMOJI || '❌'} You must be in a voice channel to use this command.`
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
              `${process.env.FAIL_EMOJI || '❌'} You must be in the same voice channel as me to use this command.`
            ),
        ],
        ephemeral: true,
      });

    if (!queue || queue.songs.length === 0)
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ED4245")
            .setDescription(
              `${process.env.FAIL_EMOJI || '❌'} There are no songs in the queue.`
            ),
        ],
        ephemeral: true,
      });

    if (removeTrackIndex - 1 === 0)
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ED4245")
            .setDescription(
              `${process.env.FAIL_EMOJI || '❌'} You cannot remove the currently playing song.`
            ),
        ],
        ephemeral: true,
      });

    try {
      if (removeTrackIndex < 1 || removeTrackIndex > queue.songs.length - 1)
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#ED4245")
              .setDescription(
                `${process.env.FAIL_EMOJI || '❌'} The position must be between 1 and ${
                  queue.songs.length - 1
                }.`
              ),
          ],
          ephemeral: true,
        });

      player.removeTrack(interaction, removeTrackIndex);

      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#57F287")
            .setDescription(
              `${process.env.SUCCESS_EMOJI || '✅'} Removed track at position \`#${removeTrackIndex}\`.`
            ),
        ],
      });
    } catch (error) {
      console.error(
        `${colors.blue(new Date().toLocaleString())} ${colors.white(
          "An error occurred while executing the remove-track command:\n"
        )} ${colors.yellow(error.stack || error)}}`
      );

      player.voices?.leave(voiceChannel.id);
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ED4245")
            .setDescription(
              `${process.env.FAIL_EMOJI || '❌'} An error occurred while trying to remove the song.`
            ),
        ],
        ephemeral: true,
      });
    }
  },
};
