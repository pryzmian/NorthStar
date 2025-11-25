/**
 * English language file for NorthStar
 */
module.exports = {
  commands: {
    play: {
      name: "play",
      description: "Play a song by name or url.",
      options: {
        song: {
          name: "song",
          description: "The song to play.",
        },
      },
    },
    skip: {
      name: "skip",
      description: "Skip the current song or to a specific song in the queue.",
      options: {
        position: {
          name: "position",
          description: "The position of the song to skip to.",
        },
      },
    },
    clearQueue: {
      name: "clear-queue",
      description: "Empty the queue.",
    },
    removeTrack: {
      name: "remove-track",
      description: "Remove a song from the queue.",
      options: {
        position: {
          name: "position",
          description: "The position of the song to delete.",
        },
      },
    },
  },

  messages: {
    errors: {
      notInVoiceChannel: "You must be in a voice channel to use this command.",
      notInSameVoiceChannel:
        "You must be in the same voice channel as me to use this command.",
      noSongsInQueue: "There are no songs in the queue.",
      invalidSongPosition: "Invalid song position.",
      cannotRemoveCurrentSong: "You cannot remove the currently playing song.",
      positionOutOfRange: (max) =>
        `The position must be between 1 and ${max}.`,
      errorPlayingSong: "An error occurred while trying to play the song.",
      errorSkippingSong: "An error occurred while trying to skip the song.",
      errorRemovingSong: "An error occurred while trying to remove the song.",
      errorClearingQueue: "An error occurred while trying to clear the queue.",
    },
    success: {
      searchingSong: (query) => `Searching for \`${query}\`...`,
      skippedToPosition: (position) => `Skipped to song at position ${position}.`,
      skippedCurrentSong: "Skipped the current song.",
      removedTrack: (position) => `Removed track at position \`#${position}\`.`,
      queueCleared: "The queue has been cleared.",
    },
  },
};
