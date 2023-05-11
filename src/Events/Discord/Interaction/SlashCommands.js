const { Events, BaseInteraction } = require("discord.js");
const colors = require("colors");

module.exports = {
  name: Events.InteractionCreate,
  once: false,

  /**
   * @param {BaseInteraction} interaction
   */

  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.inGuild()) return;

    const client = interaction.client;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(
        `${colors.blue(new Date().toLocaleString())} ${colors.red(
          "An error ocurred while executing a command:"
        )} ${colors.yellow(error.stack || error)}`
      );
    }
  },
};
