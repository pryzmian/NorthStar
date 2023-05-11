const fs = require("node:fs");
const colors = require("colors");
const path = require("node:path");
const { REST, Routes } = require("discord.js");
const { NorthFace } = require('../Class/NorthFaceClient');

/**
 * Register commands to the Discord API.
 * @param {NorthFace} client 
 */
async function registerCommands(client) {
  const commands = [];

  const commandFolders = fs.readdirSync(path.join("./src/Commands"));
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(path.join("./src/Commands", folder))
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(path.join("../Commands", folder, file));

      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
      delete require.cache[
        require.resolve(path.join("../Commands", folder, file))
      ];
    }
  }

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log(
      `${colors.blue(new Date().toLocaleString())} ${colors.white(
        "Started refreshing application (/) commands."
      )}`
    );

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log(
      `${colors.blue(new Date().toLocaleString())} ${colors.white(
        "Successfully reloaded application (/) commands."
      )}`
    );
  } catch (error) {
    console.error(
      `${colors.blue(new Date().toLocaleString())} ${colors.red(
        "An error occurred while reloading application (/) commands."
      )}`,
      error
    );
  }
}

module.exports = { registerCommands };