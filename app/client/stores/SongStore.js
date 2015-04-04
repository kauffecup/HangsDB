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
  // alphabetize the names before setting them - TODO this'll go away when SQL sorts the names for us
  _songs = newSongs.sort(function (a, b) {
    var A = a.name.toLowerCase();
    var B = b.name.toLowerCase();
    if (A < B) {return -1;} else if (A > B) {return  1;} else {return 0;}
  });
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
  if (_currentlyOpenSongID) {
    // if the song we're closing is a fresh puppy, remove it.
    // this assumes that the adding song is always at the end
    if (_songs[_songsIDMap[_currentlyOpenSongID]].adding)
      _songs.pop();
    // otherwise, simply set open to false
    else {
      update(_currentlyOpenSongID, {open: false});
      cancelEdit(_currentlyOpenSongID);
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

/**
 * Prepare a song for editing
 * @param  {SongID}
 */
function editSong (id) {
  var editingState = {editing: true}, song = _songs[_songsIDMap[id]];
  for (var prop in song) {
    if (song.hasOwnProperty(prop)) {
      if (prop !== 'id') {
        editingState['editing_' + prop] = song[prop];
      }
    }
  }
  editingState.editing_arrangers = editingState.editing_arrangers && editingState.editing_arrangers.map(s => s.name);
  editingState.editing_directors = editingState.editing_directors && editingState.editing_directors.map(s => s.name);
  editingState.editing_semesters = editingState.editing_semesters && editingState.editing_semesters.map(s => s.name);
  editingState.editing_soloists  = editingState.editing_soloists  && editingState.editing_soloists.map(s => s.name);
  editingState.editing_concerts  = editingState.editing_concerts  && editingState.editing_concerts.map(s => s.name);
  update(id, editingState);
}

function editField (id, field, newValue) {
  if (field === 'editing_arrangers' || field === 'editing_soloists' || field === 'editing_directors' || field === 'editing_concerts' || field === 'editing_semesters')
    newValue = newValue.split(', ');

  var newState = {};
  newState[field] = newValue;
  update(id, newState)
}

/**
 * Cancel a song's edit
 * @param  {SongID}
 */
function cancelEdit (id) {
  update(id, {editing: false}); 
}

/**
 * Join a mutlivalued array of objects that have name properties with a comma
 */
function joinMulti (multi) {
  return multi.map(function (value) {
    return value.name;
  }).join(', ');
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

    case ActionConstants.EDIT_SONG:
      editSong(action.songID);
      SongStore.emitChange();
      break;

    case ActionConstants.EDIT_FIELD:
      editField(action.songID, action.field, action.newValue);
      SongStore.emitChange();
      break;

    case ActionConstants.UPLOAD_EDITS:
      cancelEdit(action.songID);
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