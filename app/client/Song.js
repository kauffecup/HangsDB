var React = require('react'),
    songController = require('./songController');

/**
 * A single valued row to be shown when a song is "open"
 * @prop attr - the attribute that this row represents
 * @prop value - the value that this row represents
 * @prop editing - if we're editing this song
 * @prop editingvalue - the value to display when editing this song
 *       should be hooked up to state in a <Song />
 * @prop onChange - function to execute when editing, on change
 */
var SingleValuedRow = React.createClass({
  render: function () {
    if (this.props.value || typeof this.props.value === 'number' || this.props.editing) {
      var valueRow = this.props.editing ?
        <input className='value' value={this.props.editingvalue} onChange={this.props.onChange}></input> :
        <span className='value'>{this.props.value}</span>;

      return <div className="song-row">
               <span className='attr'>{this.props.attr}</span>
               {valueRow}
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
 * @prop editing - if we're editing this song
 */
var MultiValuedRow = React.createClass({
  render: function () {
    var value;
    if (this.props.values) {
      value = this.props.values.map(function (value) {
        return <span>{value.name}</span>;
      });
    }
    return <SingleValuedRow attr={this.props.attr} value={value} editing={this.props.editing} editingvalue={value} onChange={this.props.onChange} />;
  }
});

/**
 * A helper row class. Sets up either a multivaluedrow or singlevalued row with
 * the appropriate properties.
 * @prop attr = the attribute for this row
 * @prop field - the field this class will represent when open and modify when editing
 * @prop parent - the parent <Song> reference so we can grab the song data and call the onChange function
 */
var Row = React.createClass({
  render: function () {
    var field = this.props.field,
        parent = this.props.parent,
        song = parent.props.song,
        editing = song.editing;
    if (!this.props.multi || editing)
      return <SingleValuedRow attr={this.props.attr} value={song[field]} editing={editing} editingvalue={editing && parent.state[field]} onChange={parent.onChange.bind(parent, field)} />
    else
      return <MultiValuedRow attr={this.props.attr} values={song[field]} />
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
 * Join a mutlivalued array of objects that have name properties with a comma
 */
function joinMulti (multi) {
  return multi.map(function (value) {
    return value.name;
  }).join(', ');
}

/**
 * A Song.
 * For now, only display the song's name and year.
 * When clicked, a song is "open" and will display everything we know about it
 * @prop song - this song view controller's associated song model
 */
module.exports = React.createClass({
  onChange: function (prop, e) {
    var newState = this.state;
    newState[prop] = e.target.value;
    this.setState(newState);
  },

  /**
   * On click we open the song (unless it's already open)
   */
  onClick: function () {
    if (!this.props.song.open) {
      songController.openSong(this.props.song);
    }
  },

  /**
   * When the user clicks the edit button, set the state of this <Song>
   * (now acting as a form) and prepare the song for editing
   */
  onEdit: function () {
    // make sure we dont modify the actual song
    var state = JSON.parse(JSON.stringify(this.props.song));
    // flatten all multivalued fields
    state.arrangers = state.arrangers && joinMulti(state.arrangers);
    state.soloists = state.soloists && joinMulti(state.soloists);
    state.directors = state.directors && joinMulti(state.directors);
    state.concerts = state.concerts && joinMulti(state.concerts);
    state.semesters = state.semesters && joinMulti(state.semesters);
    this.setState(state);
    songController.editSong(this.props.song);
  },

  submitEdit: function () {
    songController.onDoneEdit(this.props.song);
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
          <button className='edit-btn sage-btn' onClick={song.editing ? this.submitEdit : this.onEdit}>{song.editing ? 'submit' : 'edit'}</button>
          <Row attr='Arranged by:' field='arrangers' parent={this} multi={true} />
          <Row attr='Soloists:' field='soloists' parent={this} multi={true} />
          <Row attr='Directed by:' field='directors' parent={this} multi={true} />
          <Row attr='Key:' field='song_key' parent={this} />
          <Row attr='Active:' field='active' parent={this} />
          <Row attr='Difficulty:' field='difficulty' parent={this} />
          <Row attr='Genre:' field='genre' parent={this} />
          <Row attr='Has Choreo:' field='has_choreo' parent={this} />
          <Row attr='Has Syllables:' field='has_syllables' parent={this} />
          <Row attr='Number of Parts:'  field='number_of_parts' parent={this} />
          <Row attr='Pitch Blown:'  field='pitch_blown' parent={this} />
          <Row attr='Quality:'  field='quality' parent={this} />
          <Row attr='Group Reception:'  field='reception' parent={this} />
          <Row attr='Solo Range:'  field='solo_voice_part_id' parent={this} />
          <Row attr='Youtubes:'  field='youtube_url' parent={this} />
          <Row attr='Concerts:'  field='concerts' parent={this} multi={true} />
          <Row attr='Semesters:'  field='semesters' parent={this} multi={true} />
          <Row attr='Notes:'  field='notes' parent={this} />
        </div>
      ;
    }

    return <li className={classes} onClick={this.onClick}>{interior}</li>;
  }
});