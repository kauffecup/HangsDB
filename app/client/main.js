var React = require('react'),
    songController = require('./songController'),
// react modules
    SongList = require('./SongList'),
    AddSongForm = require('./AddSongForm');

/**
 * A Sage Class.
 * Maintains an array of songs that are displayed.
 */
var Sage = React.createClass({
  getInitialState: function () {
    return {songs: []};
  },

  /**
   * When the songs update, set the state of main
   */
  _onSongsUpdate: function (songs) {
    this.setState({songs: songs});
  },

  /**
   * The sage app currently consists only of a title and a
   * song list.
   */
  render: function () {
    return  <div className="sage">
              <h1>Sage</h1>
              <p>welcome to Sage.</p>
              <SongList songs={this.state.songs} />
              <AddSongForm />
            </div>;
  },

  /**
   * When this is in dom land, register this view controller and kick
   * off the inital song load.
   */
  componentDidMount: function () {
    songController.registerCallback(this._onSongsUpdate.bind(this));
    songController.loadInitialSongs();
  }
});

// Now we render the app in the page
React.render(Sage(), document.body);