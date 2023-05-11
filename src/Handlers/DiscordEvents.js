const fs = require("node:fs");
const colors = require("colors");
const path = require("node:path");
const { NorthFace } = require("../Class/NorthFaceClient");

/**
 * Register events to the Discord client.
 * @param {NorthFace} client 
 */
function registerDiscordEvents(client) {
  const eventsFolder = fs.readdirSync(path.join("./src/Events/Discord"));
  for (const folder of eventsFolder) {
    const eventsFiles = fs
      .readdirSync(path.join("./src/Events/Discord", folder))
      .filter((file) => file.endsWith(".js"));

    for (const file of eventsFiles) {
      const event = require(path.join("../Events/Discord", folder, file));

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }

      delete require.cache[
        require.resolve(path.join("../Events/Discord", folder, file))
      ];
    }
  }

  console.log(
    `${colors.blue(new Date().toLocaleString())} ${colors.white(
      "Discord events loaded."
    )}`
  );
}

module.exports = { registerDiscordEvents };
