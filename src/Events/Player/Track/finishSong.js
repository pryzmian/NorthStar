const colors = require("colors");
const { Queue, Song, Events } = require("distube");

module.exports = {
  name: Events.FINISH_SONG,
  once: false,

  /**
   * @param {Queue} queue
   * @param {Song} song
   */

  async execute(queue, song) {
    try {
      const msg = await queue.textChannel.messages.fetch(queue.lastMessage);
      if (!msg) return;

      if (msg.deletable) await msg.delete().catch(() => {});
    } catch (error) {
      console.error(
        `${colors.blue(Date.now())} ${colors.white(
          "An error occurred while executing the finishSong event:\n"
        )} ${colors.yellow(error.stack || error)}`
      );
    }
  },
};
