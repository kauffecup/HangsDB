var React = require('react');

/**
 * This'll be the song's header. Displays the name, nickname, and year of the song.
 * @prop parent - the parent <Song> reference so we can grab the song data and call the onChange function
 */
var SongHeader = React.createClass({
  render: function () {
    var parent = this.props.parent,
        song = parent.props.song,
        editing = song.editing || song.adding;
    if (!editing) {
      return <div className='song-header'>
               <div className='song-name'>{song.name}</div>
               <div className='song-nickname'>{song.nickname ? '(' + song.nickname + ')' : ''}</div>
               <div className='song-year'>{song.original_song_year}</div>
             </div>
    } else {
      return <div className='song-header'>
               <input className='song-name' value={parent.state.name} onChange={parent.onChange.bind(parent, 'name')} placeholder='You Got A "C"'></input>
               <div className='song-nickname'>
                 (<input value={parent.state.nickname} onChange={parent.onChange.bind(parent, 'nickname')} placeholder='YGAC'></input>)
               </div>
               <input className='song-year' value={parent.state.original_song_year} onChange={parent.onChange.bind(parent, 'original_song_year')} placeholder='1776'></input>
             </div>
    }
  }
});

module.exports = SongHeader;