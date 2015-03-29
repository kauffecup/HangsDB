var React = require('react'),
    SongConstants = require('../constants/SongConstants'),
    SongActions = require('../actions/SongActions'),
    Row = require('./SongRow');

/**
 * A Song.
 * For now, only display the song's name and year.
 * When clicked, a song is "open" and will display everything we know about it
 * @prop song - this song view controller's associated song model
 */
var Song = React.createClass({
  /**
   * The only state we keep track of and is used for when we're in edit mode and
   * the song is treated as a form.
   */
  getInitialState: function () {
    return this.flattenSong();
  },

  /**
   * This onChange event is used for when the user's typing in the song-as-a-form
   */
  onChange: function (prop, e) {
    var newState = this.state;
    newState[prop] = e.target.value;
    this.setState(newState);
  },

  /**
   * When the user clicks the edit button, set the state of this <Song>
   * (now acting as a form) and prepare the song for editing
   */
  onEdit: function () {
    this.setState(this.flattenSong());
    SongActions.editSong(this.props.song);
  },

  /**
   * Return a flattened song.
   * Flattens multivalued fields into a single string so they can be
   * edited by the form, nah mean?
   */
  flattenSong: function () {
    // make sure we dont modify the actual song
    var state = JSON.parse(JSON.stringify(this.props.song));
    // flatten all multivalued fields
    state.arrangers = state.arrangers && this.joinMulti(state.arrangers);
    state.soloists = state.soloists && this.joinMulti(state.soloists);
    state.directors = state.directors && this.joinMulti(state.directors);
    state.concerts = state.concerts && this.joinMulti(state.concerts);
    state.semesters = state.semesters && this.joinMulti(state.semesters);
    return state;
  },

  /**
   * Join a mutlivalued array of objects that have name properties with a comma
   */
  joinMulti: function (multi) {
    return multi.map(function (value) {
      return value.name;
    }).join(', ');
  },

  splitMulti: function (multi) {
    if (!multi) return;
    return multi.split(',').map(function(str) {return str.trim()});
  },

  uploadSong: function () {
    var state = this.state;
    state.arrangers = this.splitMulti(state.arrangers);
    state.soloists = this.splitMulti(state.soloists);
    state.directors = this.splitMulti(state.directors);
    state.concerts = this.splitMulti(state.concerts);
    state.semesters = this.splitMulti(state.semesters);
    SongActions.uploadSong(state);
  },

  /**
   * This is the event that we put on the document when a song is open... it closes the song.
   */
  documentClickHandler: function() {
    SongActions.closeOpenSong();
  },

  /**
   * Stop immediate propagation of an event. This is used so that we can put a click event
   * on the document for clicking outside of a song.
   * @param  {Event}
   */
  stopImmediate: function (e) {
    e.nativeEvent.stopImmediatePropagation();
  },

  /**
   * Render as a single row if the song is closed.
   * If it is open, display all the information about this song
   */
  render: function () {
    var song = this.props.song,
        isOpen = song.open || song.adding,
        classes = isOpen ? 'song open' : 'song';

    var interior;
    if (!isOpen) {
      // if we're closed, remove the document click event that we registered
      document.removeEventListener('click', this.documentClickHandler);
      // configure the dom for the interior
      interior = 
        <div className='song-stuffs' onClick={SongActions.openSong.bind(SongActions, song)}>
          <span className='song-title'>{song.name}</span>
          <span className='song-year'>{song.original_song_year}</span>
        </div>
      ;
    } else {
      // if we're open, add a document click event that will close the song when clicked outside
      document.addEventListener('click', this.documentClickHandler);
      // configure the dom for the interior
      var editSubmitClick, editSubmitText;
      if (song.adding) {
        editSubmitClick = this.uploadSong;
        editSubmitText = 'upload'
      } else if (song.editing) {
        editSubmitClick = SongActions.uploadEdits.bind(SongActions, song);
        editSubmitText = 'submit'
      } else {
        editSubmitClick = this.onEdit;
        editSubmitText = 'edit'
      }
      // TODO: artist once we have more than just artist id
      // TODO: get arranged semester info from arrangement_semester_id, arrangement_type_id
      interior =
        <div className='song-stuffs' onClick={this.stopImmediate}>
          <SongHeader parent={this} />
          <button className='edit-btn sage-btn' onClick={editSubmitClick}>{editSubmitText}</button>
          <Row attr='opb:'             field='artist_id'            parent={this} placeholder='Ke$ha' />
          <Row attr='Arranged by:'     field='arrangers'            parent={this} placeholder='Adam Beckwith, Hasa Question' multi={true} />
          <Row attr='Arranged in:'     field='arranged_semester_id' parent={this} placeholder='Spring 1987'/>
          <Row attr='Soloists:'        field='soloists'             parent={this} placeholder='Roshun Steppedinshit, Matt Damon' multi={true} />
          <Row attr='Directed by:'     field='directors'            parent={this} placeholder='Jron Poffeecoops, Mas Resbin' multi={true} />
          <Row attr='Key:'             field='song_key'             parent={this} valueMap={SongConstants.notesMap} />
          <Row attr='Active:'          field='active'               parent={this} valueMap={SongConstants.boolMap} />
          <Row attr='Difficulty:'      field='difficulty'           parent={this} valueMap={SongConstants.difficultyMap} />
          <Row attr='Genre:'           field='genre'                parent={this} placeholder='Country Sex' />
          <Row attr='Has Choreo:'      field='has_choreo'           parent={this} valueMap={SongConstants.boolMap} />
          <Row attr='Has Syllables:'   field='has_syllables'        parent={this} valueMap={SongConstants.boolMap} />
          <Row attr='Number of Parts:' field='number_of_parts'      parent={this} placeholder='5' />
          <Row attr='Pitch Blown:'     field='pitch_blown'          parent={this} valueMap={SongConstants.notesMap} />
          <Row attr='Quality:'         field='quality'              parent={this} valueMap={SongConstants.qualityMap} />
          <Row attr='Group Reception:' field='reception'            parent={this} valueMap={SongConstants.receptionMap} />
          <Row attr='Solo Range:'      field='solo_voice_part_id'   parent={this} valueMap={SongConstants.partMap} />
          <Row attr='Youtubes:'        field='youtube_url'          parent={this} placeholder='https://www.youtube.com/watch?v=AdYaTa_lOf4' />
          <Row attr='Concerts:'        field='concerts'             parent={this} placeholder='Happy Hour XXXX, Fall Tonic II' multi={true} />
          <Row attr='Semesters:'       field='semesters'            parent={this} placeholder='Spring 2013, Fall 1999' multi={true} />
          <Row attr='Type:'            field='arrangement_type_id'  parent={this} valueMap={SongConstants.typeMap} />
          <Row attr='Notes:'           field='notes'                parent={this} placeholder='This song is smelly.' />
        </div>
      ;
    }
    return <li className={classes}>{interior}</li>;
  }
});

module.exports = Song;