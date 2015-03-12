// first we load in the node modules
var React = require('react'),
    http = require('http'),
// then we load in our react modules
    SongList = require('./SongList');

/**
 * A Sage Class.
 * Maintains an array of songs that are displayed.
 */
var Sage = React.createClass({
  getInitialState: function () {
    return {
      songs: []
    };
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
            </div>;
  },

  /**
   * When this is in dom land, query the arrangements and update
   * the state of the app.
   */
  componentDidMount: function () {
    // TODO: need a much much much better way to keep scope
    var _this = this;
    http.get('/arrangements', function (res) {
      var __this = _this;
      res.on('data', function (data) {
        try {
        __this.setState({
          songs: JSON.parse(data)
        });
        } catch (e) {
          // for now do nothing
        }
      });
    });
  }
});

// Now we render the app in the page
React.render(Sage(), document.body);