const {
  Client,
  Collection,
  GatewayIntentBits,
  Status,
  ActivityType,
} = require("discord.js");
const path = require("node:path");
const { CustomDisTubePlayer } = require("./NorthPlayer");
const { registerCommands } = require("../Handlers/Commands");
const { registerDiscordEvents } = require("../Handlers/DiscordEvents");
const { registerPlayerEvents } = require("../Handlers/PlayerEvents");
const { LangsHandler } = require("../Locales");
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
    this.player = new CustomDisTubePlayer(this);
    this.langs = new LangsHandler();
  }

  async start() {
    // Load languages
    await this.loadLanguages();
    
    await registerCommands(this);
    registerDiscordEvents(this);
    registerPlayerEvents(this);
    await this.login(process.env.TOKEN);
  }

  /**
   * Load language files from the Locales/langs directory
   */
  async loadLanguages() {
    const langsPath = path.join(__dirname, "../Locales/langs");
    await this.langs.load(langsPath);
    
    // Set default language (English)
    this.langs.defaultLang = "en";
    
    // Set up locale aliases for Discord locales
    this.langs.aliases = [
      ["en", ["en-US", "en-GB"]],
      ["es", ["es-ES", "es-419"]],
    ];
    
    console.log(
      `\x1b[34m${new Date().toLocaleString()}\x1b[0m \x1b[37mLoaded ${
        Object.keys(this.langs.values).length
      } language(s): ${Object.keys(this.langs.values).join(", ")}\x1b[0m`
    );
  }

  /**
   * Get localized text for a user based on their locale
   * @param {string} userLocale - The user's locale (e.g., "en-US", "es-ES")
   * @returns {Proxy} A proxy for accessing locale strings
   */
  t(userLocale) {
    return this.langs.get(userLocale || this.langs.defaultLang);
  }
}

module.exports = { NorthFace };
