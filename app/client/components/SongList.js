var React = require('react'),
    Song = require('./Song'),
    SongStore = require('../stores/SongStore');

function getSongsState () {
  return {songs: SongStore.getAll()};
}

/**
 * A SongList.
 * For each song in the song list, render a Song.
 */
var SongList = React.createClass({
  getInitialState: function () {
    return getSongsState();
  },

  componentDidMount: function() {
    SongStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SongStore.removeChangeListener(this._onChange);
  },

  render: function () {
    var songs = this.state.songs.map(function (song) {
      return <Song song={song} key={song.id} />;
    });

    return <ul className="song-list">{songs}</ul>;
  },

  _onChange: function() {
    this.setState(getSongsState());
  }
});

module.exports = SongList;