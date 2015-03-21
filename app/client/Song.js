var React = require('react'),
    songController = require('./songController');

/**
 * A single valued row to be shown when a song is "open"
 * @prop attr - the attribute that this row represents
 * @prop value - the value that this row represents
 */
var SingleValuedRow = React.createClass({
  render: function () {
    if (this.props.value) {
      return <div className="song-row">
               <span className='attr'>{this.props.attr}</span>
               <span className='value'>{this.props.value}</span>  
             </div>
      ;
    } else {
      return null;
    }
  }
});

/**
 * A Multi valued row to be shown when a song is "open"
 * @prop attr - the attribute that this row represents
 * @prop values - an array of values to be wrapped in their own spans
 */
var MultiValuedRow = React.createClass({
  render: function () {
    var value;
    if (this.props.values) {
      var value = this.props.values.map(function (value) {
        return <span>{value.name}</span>;
      });
    }
    return <SingleValuedRow attr={this.props.attr} value={value} />;
  }
});

/**
 * Private helper method to convert a binary 0/1 (can be undefined)
 * mysql value to a 'yes' or 'no' string
 */
function binaryToYesNo (thing) {
  if (typeof thing === 'number')
    return thing ? 'yes' : 'no';
  else
    return '';
}

/**
 * A Song.
 * For now, only display the song's name and year.
 * When clicked, a song is "open" and will display everything we know about it
 * @prop song - this song view controller's associated song model
 */
module.exports = React.createClass({
  onClick: function () {
    if (!this.props.song.open) {
      songController.openSong(this.props.song);
    }
  },

  /**
   * Render as a single row if the song is closed.
   * If it is open, display all the information about this song
   */
  render: function () {
    var song = this.props.song,
        isOpen = song.open,
        classes = isOpen ? 'song open' : 'song';

    var interior;
    if (!isOpen) {
      interior = 
        <div className='song-stuffs'>
          <span className='song-title'>{song.name}</span>
          <span className='song-year'>{song.original_song_year}</span>
        </div>
      ;
    } else {
      // TODO: artist once we have more than just artist id
      // TODO: get arranged semester info from arrangement_semester_id, arrangement_type_id
      interior =
        <div className='song-stuffs'>
          <div className='song-header'>
            <h1>{song.name}</h1>
            <h2>{song.nickname ? '(' + song.nickname + ')' : ''}</h2>
            <h3>{song.original_song_year}</h3>
          </div>
          <MultiValuedRow attr='Arranged by:' values={song.arrangers} />
          <MultiValuedRow attr='Soloists:'    values={song.soloists} />
          <MultiValuedRow attr='Directed by:' values={song.directors} />
          <SingleValuedRow attr='Key:' value={song.song_key} />
          <SingleValuedRow attr='Active:' value={binaryToYesNo(song.active)} />
          <SingleValuedRow attr='Difficulty:' value={song.difficulty} />
          <SingleValuedRow attr='Genre:' value={song.genre} />
          <SingleValuedRow attr='Has Choreo:' value={binaryToYesNo(song.has_choreo)} />
          <SingleValuedRow attr='Has Syllables:' value={binaryToYesNo(song.has_syllables)} />
          <SingleValuedRow attr='Number of Parts:' value={song.number_of_parts} />
          <SingleValuedRow attr='Pitch Blown:' value={song.pitch_blown} />
          <SingleValuedRow attr='Quality:' value={song.quality} />
          <SingleValuedRow attr='Group Reception:' value={song.reception} />
          <SingleValuedRow attr='Solo Range:' value={song.pitch_blown} />
          <SingleValuedRow attr='Youtubes:' value={song.youtube_url} />
          <MultiValuedRow attr='Concerts in:' values={song.concerts} />
          <MultiValuedRow attr='Semesters:'   values={song.semesters} />
          <SingleValuedRow attr='Notes:' value={song.notes} />
        </div>
      ;
    }

    return <li className={classes} onClick={this.onClick}>{interior}</li>;
  }
});