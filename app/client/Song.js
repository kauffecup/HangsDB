var React = require('react');

/**
 * A Song.
 * For now, only display the song's name.
 */
module.exports = React.createClass({
  render: function () {
    return <li className="song">{this.props.song.name}</li>;
  }
});