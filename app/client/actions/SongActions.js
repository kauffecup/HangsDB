var AppDispatcher = require('../AppDispatcher'),
    ActionConstants = require('../constants/ActionConstants'),
    requester = require('../requester');

var SongActions = {
  /** Load the initial songs */
  loadInitialSongs: function () {
    requester.loadInitialSongs().then(songs => {
      AppDispatcher.dispatch({
        actionType: ActionConstants.SONGS_LOADED,
        data: songs
      });
    });
  },

  /** Open a song */
  openSong: function (song) {
    AppDispatcher.dispatch({
      actionType: ActionConstants.OPEN_SONG_START,
      songID: song.id
    });
    // only request it if the song hasnt been loaded yet
    if (!song.loaded) {
      requester.loadSong(song.id).then(songJSON => {
        AppDispatcher.dispatch({
          actionType: ActionConstants.SONG_LOADED,
          songID: song.id,
          data: songJSON
        });
      });
    }
  },

  /** Close the currently open song */
  closeOpenSong: function () {
    AppDispatcher.dispatch({actionType: ActionConstants.CLOSE_OPEN_SONG});
  },

  /** Create a song */
  createSong: function () {
    AppDispatcher.dispatch({actionType: ActionConstants.CREATE_SONG});
  },

  /** Upload a song */
  uploadSong: function (songObj) {
    AppDispatcher.dispatch({actionType: ActionConstants.UPLOAD_SONG_START});
    requester.uploadSong(songObj).then(something => {
      // for now, reload the pages
      this.loadInitialSongs();
      AppDispatcher.dispatch({actionType: ActionConstants.UPLOAD_SONG_SUCCESS});
    }, e => {
      // for now, reload the pages
      // TODO need to display a message or something
      this.loadInitialSongs();
      AppDispatcher.dispatch({actionType: ActionConstants.UPLOAD_SONG_FAILURE});
    });
  },

  /** Upload edits to a song */
  uploadEdits: function (song) {
    AppDispatcher.dispatch({
      actionType: ActionConstants.UPLOAD_EDITS,
      songID: song.id
    });
  },

  /** Scroll a song in to view */
  scrollSong: function (domNode) {
    AppDispatcher.dispatch({
      actionType: ActionConstants.SCROLL_SONG,
      node: domNode
    })
  }
};

module.exports = SongActions;