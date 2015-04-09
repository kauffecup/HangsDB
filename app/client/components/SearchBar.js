var React = require('react');

var SearchBar = React.createClass({
  getInitialState: function () {
    return {searchText: ''};
  },
  handleChange: function(e) {
    this.setState({searchText: e.target.value});
  },
  render: function () {
    return <div className='search-bar'>
             <input placeholder='Search' value={this.state.searchText} onChange={this.handleChange}></input>
           </div>
  }
});

module.exports = SearchBar;