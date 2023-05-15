const colors = require('colors');
require('dotenv').config({ path: '.env' });
const { EmbedBuilder } = require('discord.js');
const { Queue, Song, Events } = require('distube');

module.exports = {
  name: Events.PLAY_SONG,
  once: false,

  /**
   * @param {Queue} queue
   * @param {Song} song
   */
  async execute(queue, song) {
    try {
      const lastMessage = await queue.textChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(
              song.metadata.interaction.guild.members.me.displayHexColor
            )
            .setAuthor({ name: "Now Playing" })
            .setDescription(
              `[${song.metadata.trackArtist} - ${song.metadata.trackName}](${song.metadata.trackURL})`
            )
            .setThumbnail(song.metadata.trackThumbnail)
            .setFooter({
              text: `Requested by ${song.user.tag}`,
              iconURL: song.user.displayAvatarURL(),
            }),
        ],
      });

      queue.lastMessage = lastMessage.id;
    } catch (error) {
      console.error(
        `${colors.blue(Date.now().toLocaleString())} ${colors.white(
          'An error occurred while executing the playSong event:\n'
        )} ${colors.yellow(error.stack || error)}`
      );
    }
  },
};
