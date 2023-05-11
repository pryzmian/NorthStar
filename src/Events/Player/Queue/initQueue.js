const colors = require("colors");
const { Queue, Events } = require("distube");

module.exports = {
  name: Events.INIT_QUEUE,
  once: true,

  /**
   * @param {Queue} queue
   */
  execute(queue) {
    try {
      queue.autoplay = false;
      queue.volume = 100;
    } catch (error) {
      console.error(
        `${colors.blue(new Date().toLocaleString())}] ${colors.white(
          "An error occurred while executing the initQueue event:\n"
        )} ${colors.red(error.stack || error)} ${colors.white("\n\n")}`
      );
    }
  },
};
