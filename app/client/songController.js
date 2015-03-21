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
      this._songs = songs;
      this.updateCallbacks();
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

  closeSong: function () {
    if (this._openSong) {
      this._openSong.open = false;
    }
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

    });
  }
}