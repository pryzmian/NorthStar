/**
 * Spanish language file for NorthStar
 */
module.exports = {
  commands: {
    play: {
      name: "reproducir",
      description: "Reproduce una canción por nombre o URL.",
      options: {
        song: {
          name: "cancion",
          description: "La canción a reproducir.",
        },
      },
    },
    skip: {
      name: "saltar",
      description:
        "Salta la canción actual o a una canción específica en la cola.",
      options: {
        position: {
          name: "posicion",
          description: "La posición de la canción a la que saltar.",
        },
      },
    },
    clearQueue: {
      name: "limpiar-cola",
      description: "Vacía la cola de reproducción.",
    },
    removeTrack: {
      name: "quitar-cancion",
      description: "Quita una canción de la cola.",
      options: {
        position: {
          name: "posicion",
          description: "La posición de la canción a eliminar.",
        },
      },
    },
  },

  messages: {
    errors: {
      notInVoiceChannel:
        "Debes estar en un canal de voz para usar este comando.",
      notInSameVoiceChannel:
        "Debes estar en el mismo canal de voz que yo para usar este comando.",
      noSongsInQueue: "No hay canciones en la cola.",
      invalidSongPosition: "Posición de canción inválida.",
      cannotRemoveCurrentSong:
        "No puedes eliminar la canción que se está reproduciendo actualmente.",
      positionOutOfRange: (max) =>
        `La posición debe estar entre 1 y ${max}.`,
      errorPlayingSong:
        "Ocurrió un error al intentar reproducir la canción.",
      errorSkippingSong: "Ocurrió un error al intentar saltar la canción.",
      errorRemovingSong: "Ocurrió un error al intentar eliminar la canción.",
      errorClearingQueue: "Ocurrió un error al intentar limpiar la cola.",
    },
    success: {
      searchingSong: (query) => `Buscando \`${query}\`...`,
      skippedToPosition: (position) =>
        `Saltado a la canción en la posición ${position}.`,
      skippedCurrentSong: "Se saltó la canción actual.",
      removedTrack: (position) =>
        `Se eliminó la canción en la posición \`#${position}\`.`,
      queueCleared: "La cola ha sido limpiada.",
    },
  },
};
