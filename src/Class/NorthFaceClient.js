const {
  Client,
  Collection,
  GatewayIntentBits,
  Status,
  ActivityType,
} = require("discord.js");
const { NorthPlayer } = require("./NorthPlayer");
const { registerCommands } = require("../Handlers/Commands");
const { registerDiscordEvents } = require("../Handlers/DiscordEvents");
const { registerPlayerEvents } = require("../Handlers/PlayerEvents");
require("dotenv").config({ path: ".env" });

class NorthFace extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ],
      presence: {
        status: Status.Disconnected,
        activities: [
          {
            name: "Just Do it",
            type: ActivityType.Competing,
          },
          {
            name: "Embarrassed by Don Toliver ft. Travis Scott",
            type: ActivityType.Listening,
          },
        ],
      },
    });

    this.commands = new Collection();
    this.player = new NorthPlayer(this);
  }

  async start() {
    await registerCommands(this);
    registerDiscordEvents(this);
    registerPlayerEvents(this);
    await this.login(process.env.TOKEN);
  }
}

module.exports = { NorthFace };
