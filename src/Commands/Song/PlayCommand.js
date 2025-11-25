const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
require("dotenv").config({ path: ".env" });
const colors = require("colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song by name or url.")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The song to play.")
        .setRequired(true)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const searchInput = interaction.options.getString("song");
    const voiceChannel = interaction.member.voice.channel;
    const clientVoiceChannel = interaction.guild.members.me.voice.channel;
    const player = interaction.client.player;
    const t = interaction.client.t(interaction.locale);

    if (!voiceChannel)
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ED4245")
            .setDescription(
              `${process.env.FAIL_EMOJI} ${t.messages.errors.notInVoiceChannel.get()}`
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
              `${process.env.FAIL_EMOJI} ${t.messages.errors.notInSameVoiceChannel.get()}`
            ),
        ],
        ephemeral: true,
      });

    try {
      // if the user is not in a voice channel, join the channel
      if (!clientVoiceChannel) await player.voices.join(voiceChannel);

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(interaction.guild.members.me.displayHexColor)
            .setDescription(
              `${process.env.LOAD_EMOJI} ${t.messages.success.searchingSong(searchInput).get()}`
            ),
        ],
      });

      await player.playTrack(interaction, searchInput);
    } catch (error) {
      console.error(
        `${colors.blue(new Date().toLocaleString())} ${colors.white(
          "An error occurred while executing the play command:\n"
        )} ${colors.yellow(error.stack || error)}}`
      );

      player.voices?.leave(voiceChannel.id);
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ED4245")
            .setDescription(
              `${process.env.FAIL_EMOJI} ${t.messages.errors.errorPlayingSong.get()}`
            ),
        ],
        ephemeral: true,
      });
    }
  },
};
