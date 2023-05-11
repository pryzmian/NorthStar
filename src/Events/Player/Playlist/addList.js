const colors = require("colors");
require("dotenv").config({ path: ".env" });
const { EmbedBuilder } = require("discord.js");
const { Queue, Playlist, Events } = require("distube");

module.exports = {
  name: Events.ADD_LIST,
  once: false,

  /**
   * @param {Queue} queue
   * @param {Playlist} playlist
   */
  async execute(queue, playlist) {
    try {
      return await playlist.metadata.interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(
              playlist.metadata.interaction.guild.members.me.displayHexColor
            )
            .setDescription(`🎶 Queued \`${playlist.songs.length} songs\` from playlist \`${playlist.name}\``),
        ],
      });
    } catch (error) {
      console.error(
        `[${colors.blue(new Date())}] ${colors.white(
          "An error occurred while executing the addList event:\n"
        )} ${colors.yellow(error.stack || error)}`
      );
    }
  },
};
