var React = require('react'),
    SongActions = require('./actions/SongActions'),
    ActionConstants = require('./constants/ActionConstants'),
    AppDispatcher = require('./AppDispatcher'),
    Animations = require('./animations/Animations'),
// react modules
    SearchBar = require('./components/SearchBar'),
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
                <SearchBar />
                <h3>welcome to Sage.</h3>
              </div>
              <div className="app" ref="scrollNode">
                <SongList />
              </div>
              <button className='add-song-button sage-btn' onClick={SongActions.createSong}>+</button>
            </div>;
  },

  /**
   * When this is in dom land, register this view controller and kick
   * off the inital song load.
   */
  componentDidMount: function () {
    SongActions.loadInitialSongs();

    // Register callback to handle all updates
    // TODO: how bad is it to have this here? should we have a separate dispatcher for this kinda thing?
    // we need to have something like this here so that we can reference the scroll node
    AppDispatcher.register(function (action) {
      switch(action.actionType) {
        case ActionConstants.SCROLL_SONG:
          Animations.scrollIntoView(action.node, React.findDOMNode(this.refs.scrollNode));
          break;
      }
    }.bind(this));
  }
});

// Now we render the app in the page
React.initializeTouchEvents(true);
React.render(<Sage />, document.body);