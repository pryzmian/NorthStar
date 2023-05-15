require("dotenv").config({ path: ".env" });
const { DisTube, Song } = require("distube");
const SpotifyInfo = require("spotify-url-info")(fetch);
const { customPlayerConfig } = require("../Utils/BotConfig");
const { ChatInputCommandInteraction } = require("discord.js");
const { SoundCloudPlugin, SearchType } = require("@distube/soundcloud");

class CustomDisTubePlayer extends DisTube {
  constructor(client) {
    super(client, customPlayerConfig);

    this.spotify = SpotifyInfo;
    this.soundcloud = new SoundCloudPlugin();
  }

  /**
   * Remove a song from the queue.
   * @param {ChatInputCommandInteraction} interaction Command interaction.
   * @param {Number} index Song index.
   * @returns {Boolean} True if the song was successfully removed.
   */
  removeFromQueue(interaction, index) {
    // Get the queue.
    const queue = this.queues.get(interaction.guild.id);

    if (typeof index !== "number")
      throw new TypeError("Index must be a number.");
    if (!interaction instanceof ChatInputCommandInteraction)
      throw new TypeError(
        "Interaction must be an instance of ChatInputCommandInteraction."
      );

    // Check if the index is valid.
    if (index < 1 || index > queue.songs.length)
      throw new RangeError(
        "Index range must be between 1 and the queue length."
      );

    // Remove the song from the queue.
    queue.songs.splice(index - 1, 1);

    return true;
  }

  /**
   * Clear the queue.
   * @param {ChatInputCommandInteraction} interaction Command interaction.
   * @returns {Boolean} True if the queue was successfully cleared.
   */
  clearQueue(interaction) {
    const queue = this.queues.get(interaction.guild.id);
    if (Array.isArray(queue.songs)) queue.songs = [];

    return true;
  }

  /**
   * Play a song from Spotify.
   * @param {ChatInputCommandInteraction} interaction Command interaction.
   * @param {String} url Spotify song URL.
   * @returns {Promise<Song>}
   */
  async playTrack(interaction, url) {

    const fetched = await this.spotify.getData(url);
    console.log(fetched);

    const spotifyURL = `https://open.spotify.com/track/${fetched.id}`;

    // convert uri to url

    await this.play(interaction.member.voice.channel, spotifyURL, {
      member: interaction.member,
      textChannel: interaction.channel,
      metadata: { 
        interaction: interaction,
        trackName: fetched.name,
        trackArtist: fetched.artists.map((artist) => artist.name).join(", "),
        trackURL: spotifyURL,
        trackThumbnail: fetched.coverArt.sources[0].url,
      },
    });
  }
}

module.exports = { CustomDisTubePlayer };
