var AppDispatcher = require('../AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    ActionConstants = require('../constants/ActionConstants'),
    assign = require('object-assign');

var CHANGE_EVENT = 'change';

/** @type {Array} The array of songs */
var _songs = [],
/** @type {Object<SongID, index>} A map of song ids to their index in the _songs array for fast lookup */
    _songsIDMap = {},
/** @type {SongID} The id of the currently open song (if there is one) */
    _currentlyOpenSongID;

/**
 * Set the _songs array with an array of new values
 * @param {JSON}
 */
function setSongs (newSongs) {
  _songs = newSongs;
  _songsIDMap = {}
  _songs.forEach(function (song, index) {
    _songsIDMap[song.id] = index;
  }.bind(this))
}

/**
 * Update a song id with new props
 * @param  {SongID}
 * @param  {Object of new props}
 */
function update(id, updates) {
  _songs[_songsIDMap[id]] = assign({}, _songs[_songsIDMap[id]], updates);
}

/**
 * Create a new blank song, ripe for filling in data
 */
function createSong () {
  closeOpenSong();
  _songs.push({adding: true, id: 'tempid', open: true});
  _songsIDMap['tempid'] = _songs.length - 1;
  _currentlyOpenSongID = 'tempid';
}

/**
 * Open a song! Show it's info!
 * @param  {SongID}
 */
function openSong (id) {
  closeOpenSong();
  _currentlyOpenSongID = id;
  update(id, {open: true, loading: true && !_songs[_songsIDMap[id]].loaded});
}

/**
 * Close the currently open song (if there is one)
 */
function closeOpenSong () {
  if (_currentlyOpenSongID && _songs[_songsIDMap[_currentlyOpenSongID]]) {
    // if the song we're closing is a fresh puppy, remove it.
    // this assumes that the adding song is always at the end
    if (_songs[_songsIDMap[_currentlyOpenSongID]].adding)
      _songs.pop();
    // otherwise, simply set open to false
    else {
      update(_currentlyOpenSongID, {open: false});
    }
    _currentlyOpenSongID = null;
  }
}

/**
 * Update a song with new info from da server
 * @param  {SongID}
 * @param  {JSON}
 */
function loadSong (id, songJSON) {
  update(id, songJSON);
  update(id, {loading: false, loaded: true});
}

var SongStore = assign({}, EventEmitter.prototype, {
  /**
   * Get the entire collection of Songs.
   * @return {object}
   */
  getAll: function () {
    return _songs;
  },

  /**
   * Emit a change... this was a great comment!
   */
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch(action.actionType) {
    case ActionConstants.SONGS_LOADED:
      setSongs(action.data);
      SongStore.emitChange();
      break;

    case ActionConstants.OPEN_SONG_START:
      openSong(action.songID);
      SongStore.emitChange();
      break;

    case ActionConstants.SONG_LOADED:
      loadSong(action.songID, action.data);
      SongStore.emitChange();
      break;

    case ActionConstants.CREATE_SONG:
      createSong();
      SongStore.emitChange();

    case ActionConstants.UPLOAD_EDITS:
      SongStore.emitChange();
      break;

    case ActionConstants.CLOSE_OPEN_SONG:
      closeOpenSong();
      SongStore.emitChange();
      break;

    case ActionConstants.UPLOAD_SONG_START:
    case ActionConstants.UPLOAD_SONG_SUCCESS:
    case ActionConstants.UPLOAD_SONG_FAILURE:
      break;

    // no op
    default:
  }
});

module.exports = SongStore;