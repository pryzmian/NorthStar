const colors = require("colors");
require("dotenv").config({ path: ".env" });
const { EmbedBuilder } = require("discord.js");
const { Queue, Song, Events } = require("distube");

module.exports = {
  name: Events.ADD_SONG,
  once: false,

  /**
   * @param {Queue} queue
   * @param {Song} song
   */
  async execute(queue, song) {
    try {
      return await song.metadata.interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(
              song.metadata.interaction.guild.members.me.displayHexColor
            )
            .setDescription(
              `🎶 Added [${song.metadata.trackArtist} - ${song.metadata.trackName}](${song.metadata.trackURL}) to the queue !`
            ),
        ],
      });
    } catch (error) {
      console.error(
        `[${colors.blue(new Date())}] ${colors.white(
          "An error occurred while executing the addSong event:\n"
        )} ${colors.yellow(error.stack || error)}`
      );
    }
  },
};
