var AppDispatcher = require('../AppDispatcher'),
    ActionConstants = require('../constants/ActionConstants'),
    requester = require('../requester');

var SongActions = {
  /** Load the initial songs */
  loadInitialSongs: function () {
    requester.loadInitialSongs().bind(this).then(function (songs) {
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
    requester.loadSong(song.id).bind(this).then(function (songJSON) {
      AppDispatcher.dispatch({
        actionType: ActionConstants.SONG_LOADED,
        songID: song.id,
        data: songJSON
      });
    });
  },

  /** Create a song */
  createSong: function () {
    AppDispatcher.dispatch({actionType: ActionConstants.CREATE_SONG});
  },

  /** Upload a song */
  uploadSong: function (songObj) {
    AppDispatcher.dispatch({actionType: ActionConstants.UPLOAD_SONG_START});
    requester.uploadSong(songObj).bind(this).then(function (something) {
      // for now, reload the pages
      this.loadInitialSongs();
      AppDispatcher.dispatch({actionType: ActionConstants.UPLOAD_SONG_SUCCESS});
    }, function (e) {
      // for now, reload the pages
      // TODO need to display a message or something
      this.loadInitialSongs();
      AppDispatcher.dispatch({actionType: ActionConstants.UPLOAD_SONG_FAILURE});
    });
  },

  /** Edit a Song */
  editSong: function (song) {
    AppDispatcher.dispatch({
      actionType: ActionConstants.EDIT_SONG,
      songID: song.id
    });
  },

  /** Upload edits to a song */
  uploadEdits: function (song) {
    AppDispatcher.dispatch({
      actionType: ActionConstants.UPLOAD_EDITS,
      songID: song.id
    });
  }
};

module.exports = SongActions;