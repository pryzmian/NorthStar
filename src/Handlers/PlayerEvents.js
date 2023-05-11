const fs = require("node:fs");
const colors = require("colors");
const path = require("node:path");
const { NorthFace } = require("../Class/NorthFaceClient");

/**
 * Register events to the DisTube client.
 * @param {NorthFace} client 
 */
function registerPlayerEvents(client) {
  const eventsFolder = fs.readdirSync(path.join("./src/Events/Player"));
  for (const folder of eventsFolder) {
    const eventsFiles = fs
      .readdirSync(path.join("./src/Events/Player", folder))
      .filter((file) => file.endsWith(".js"));

    for (const file of eventsFiles) {
      const event = require(path.join("../Events/Player", folder, file));

      if (event.once) {
        client.player.once(event.name, (...args) => event.execute(...args));
      } else {
        client.player.on(event.name, (...args) => event.execute(...args));
      }

      delete require.cache[
        require.resolve(path.join("../Events/Player", folder, file))
      ];
    }
  }

  console.log(
    `${colors.blue(new Date().toLocaleString())} ${colors.white(
      "Player events loaded."
    )}`
  );
}

module.exports = { registerPlayerEvents };
