var requester = require('./requester');

module.exports = {
  /** {Array.<Callback Function>} An array of reqct view controllers that want to
    * be notified when song state changes */
  _registeredCallbacks: [],
  /** {Array.<SongModel> An array of song models. Whenever this changes, all
    * registered controllers are notified */
  _songs: [],
  /** {SongModel} The song thats currently open */
  _openSong: undefined,

  /**
   * Load the initial songs and maintain this._songs
   */
  loadInitialSongs: function () {
    requester.loadInitialSongs().bind(this).then(function (songs) {
      // add a 'key' prop for better React performance
      songs.forEach(function (song) {
        song['key'] = song.id;
      });
      this._songs = songs;
      this.updateCallbacks();
    }, function (e) {
      // TODO: error handling
    });
  },

  /**
   * Register a callback function. This function will be called immediately,
   * and whenever the _songs array updates
   */
  registerCallback: function (callback) {
    callback(this._songs);
    this._registeredCallbacks.push(callback);
  },

  /**
   * Notifiy all of the registered callback when the songs get updated
   */
  updateCallbacks: function () {
    for (var i = 0; i < this._registeredCallbacks.length; i++) {
      this._registeredCallbacks[i](this._songs);
    }
  },

  /**
   * Open a song and fill it out with the servers response
   */
  openSong: function (song) {
    this.closeSong();
    song.open = true;
    this._openSong = song;
    return this.loadSong(song);
  },

  /**
   * Close the currently open song. Because we only support one being open 
   * at a time, this does not take any arguments.
   */
  closeSong: function () {
    if (this._openSong) {
      this._openSong.open = false;
      this._openSong.editing = false;
    }
    this.updateCallbacks();
  },

  /**
   * Edit a song - set its editing property true and notifiy any state observers
   */
  editSong: function (song) {
    song.editing = true;
    this.updateCallbacks();
  },

  /**
   * When done editing, submit the edit, set editing to false, and notify state observers
   */
  onDoneEdit: function (song, edits) {
    // TODO: submit edit
    this.cancelEditSong(song);
  },

  /**
   * If the user hits cancel, set editing to false, and notify state observers
   */
  cancelEditSong: function (song) {
    song.editing = false;
    this.updateCallbacks();
  },

  /**
   * Fetch a songs data and mix it in with this song
   */
  loadSong: function (song) {
    requester.loadSong(song.id).bind(this).then(function (songJSON) {
      for (var attrname in songJSON) {
        song[attrname] = songJSON[attrname];
      }
      this.updateCallbacks();
    }, function (e) {
      // TODO: error handling
    });
  }
}