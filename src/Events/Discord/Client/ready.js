const { Client, Events } = require("discord.js");
const colors = require("colors");

module.exports = {
  name: Events.ClientReady,
  once: true,

  /**
   * @param {Client} client
   */

  execute(client) {
    console.log(
      `${colors.blue(new Date())} ${colors.white(
        `Logged in as ${client.user.tag}`
      )}`
    );
  },
};
