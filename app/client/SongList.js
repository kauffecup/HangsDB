var React = require('react'),
    Song = require('./Song');

/**
 * A SongList.
 * For each song in the song list, render a Song.
 */
module.exports = React.createClass({
  render: function () {
    var songArr = this.props.songs || [];
    var songs = songArr.map(function (song) {
      return <Song song={song} />;
    });

    return <ul className="song-list">{songs}</ul>;
  }
});