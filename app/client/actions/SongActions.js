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
    // TODO: it feels hacky that this is here? maybe have a separate action for pre-upload and upload?
    // upload all of the editing values as their non-editing-value-name
    var toUpload = {};
    for (var key in songObj) {
      if (songObj.hasOwnProperty(key)) {
        if (key.indexOf('editing_') > -1) {
          // substringing at 8 gives us the "prop" in "editing_prop"
          toUpload[key.substring(8)] = songObj[key];
        }
      }
    }
    AppDispatcher.dispatch({actionType: ActionConstants.UPLOAD_SONG_START});
    requester.uploadSong(toUpload).then(something => {
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

  /** Edit a Song */
  editSong: function (song) {
    AppDispatcher.dispatch({
      actionType: ActionConstants.EDIT_SONG,
      songID: song.id
    });
  },

  /** Edit a field in a song from a change event */
  editField: function (song, field, e) {
    AppDispatcher.dispatch({
      actionType: ActionConstants.EDIT_FIELD,
      songID: song.id,
      field: field,
      newValue: e.target.value
    })
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