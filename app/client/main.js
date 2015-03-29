var React = require('react'),
    SongActions = require('./actions/SongActions'),
// react modules
    SongList = require('./components/SongList');

/**
 * A Sage Class.
 * Maintains an array of songs that are displayed.
 */
var Sage = React.createClass({
  /**
   * The sage app currently consists only of a title and a song list.
   */
  render: function () {
    return  <div className="sage">
              <div className="header">
                <h1>Sage</h1>
                <p>welcome to Sage.</p>
              </div>
              <div className="app">
                <SongList />
                <button className='add-song-button sage-btn' onClick={SongActions.createSong}>+</button>
              </div>
            </div>;
  },

  /**
   * When this is in dom land, register this view controller and kick
   * off the inital song load.
   */
  componentDidMount: function () {
    SongActions.loadInitialSongs();
  }
});

// Now we render the app in the page
React.render(<Sage />, document.body);