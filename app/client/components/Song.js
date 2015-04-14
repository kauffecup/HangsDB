var React = require('react/addons'),
    SongConstants = require('../constants/SongConstants'),
    SongActions = require('../actions/SongActions'),
    classNames = require('classnames'),
    Animations = require('../animations/Animations'),
// react components
    TransitionGroup = React.addons.TransitionGroup,
    Row = require('./SongRow');

// These will be the song rows displayed when a song is closed
var SongClosedRows = [
  {field: 'name',        class: 'song-name',  h: 5},
  {field: 'artist_name', class: 'song-artist'}
];

// These will be the song rows displayed in the header when the song is open
var SongHeaderRows = [
  {field: 'name',               placeholder: 'You Got A "C"', class: 'song-name', h: 2},
  {field: 'nickname',           placeholder: 'YGAC',          class: 'song-nickname', h: 3},
  {field: 'original_song_year', placeholder: '1983', h: 4},
  {field: 'artist_name',        placeholder: 'Sebastian',     class: 'song-artist', h: 4}
];

// These will be the song rows displayed in the body when the song is open
var SongBodyRows = [
  {attr: 'Arranged by:',     field: 'arrangers',           placeholder: 'Adam Beckwith, Hasa Question', multi: true},
  {attr: 'Arranged in:',     field: 'arranged_semester',   placeholder: 'Spring 1883'},
  {attr: 'Soloists:',        field: 'soloists',            placeholder: 'Roshun Steppedinshit, Matt Damon', multi: true},
  {attr: 'Directed by:',     field: 'directors',           placeholder: 'Jron Poffeecoops, Mas Resbin', multi: true},
  {attr: 'Key:',             field: 'song_key',            valueMap: SongConstants.notesMap},
  {attr: 'Active:',          field: 'active',              valueMap: SongConstants.boolMap},
  {attr: 'Difficulty:',      field: 'difficulty',          valueMap: SongConstants.difficultyMap},
  {attr: 'Genre:',           field: 'genre',               placeholder: 'Country Sex'},
  {attr: 'Has Choreo:',      field: 'has_choreo',          valueMap: SongConstants.boolMap},
  {attr: 'Has Syllables:',   field: 'has_syllables',       valueMap: SongConstants.boolMap},
  {attr: 'Number of Parts:', field: 'number_of_parts',     placeholder: '5'},
  {attr: 'Pitch Blown:',     field: 'editing_pitch_blown', valueMap: SongConstants.notesMap},
  {attr: 'Quality:',         field: 'quality',             valueMap: SongConstants.qualityMap},
  {attr: 'Group Reception:', field: 'reception',           valueMap: SongConstants.receptionMap},
  {attr: 'Solo Range:',      field: 'solo_voice_part_id',  valueMap: SongConstants.partMap},
  {attr: 'Youtubes:',        field: 'youtube_url',         placeholder: 'https://www.youtube.com/watch?v=AdYaTa_lOf4'},
  {attr: 'Concerts:',        field: 'concerts',            placeholder: 'Happy Hour XXXX, Fall Tonic II', multi: true},
  {attr: 'Semesters:',       field: 'semesters',           placeholder: 'Spring 2013, Fall 1999', multi: true},
  {attr: 'Type:',            field: 'arrangement_type_id', valueMap: SongConstants.typeMap},
  {attr: 'PDF:',             field: 'pdf',                 file: true},
  {attr: 'Finale:',          field: 'finale',              file: true},
  {attr: 'Song:',            field: 'song',                file: true},
  {attr: 'Notes:',           field: 'notes',               placeholder: 'This song is smelly.'}
];

/**
 * A Song.
 * For now, only display the song's name and year.
 * When clicked, a song is "open" and will display everything we know about it
 * @prop song - this song view controller's associated song model
 */
var Song = React.createClass({
  getInitialState: function () {
    return {
      formActive: this.props.song.editing || this.props.song.adding
    }
  },

  /**
   * Whenever a new song the user is added is put in the dom, scroll it in to view
   */
  componentDidMount: function () {
    if (this.props.song.adding) {
      SongActions.scrollSong(this.getDOMNode());
      Animations.expandOut(this.getDOMNode());
    }
  },

  /**
   * When this is being removed, clean up the document handler
   */
  componentWillUnmount: function () {
    document.removeEventListener('click', this.documentClickHandler);
  },

  /**
   * Animate a song open or closed
   */
  componentDidUpdate: function () {
    var songOpen = this.props.song.open;

    if (songOpen) {
      Animations.expandOut(this.getDOMNode());
    } else {
      Animations.collapseIn(this.getDOMNode());
    }
  },

  /**
   * This is the event that we put on the document when a song is open... it closes the song.
   */
  documentClickHandler: function (e) {
    if (!this.getDOMNode().contains(e.target)) {
      this.cancelEdit();
      SongActions.closeOpenSong();
    }
  },

  /**
   * Construct and return a song row
   * @param  {SongModel}
   * @param  {Object} options are class, attr, field, placeholder, multi, valuemap
   */
  constructRow: function (song, opts) {
    return <Row className={opts.class}
                attr={opts.attr}
                formActive={this.state.formActive}
                value={opts.file ? song[opts.field + '_url'] : song[opts.field]}
                editingValue={this.state['editing_' + opts.field]}
                onChange={opts.file ? this.handleFile.bind(this, 'editing_' + opts.field) : this.onChange.bind(this, 'editing_' + opts.field)}
                placeholder={opts.placeholder}
                multi={opts.multi}
                valueMap={opts.valueMap}
                file={opts.file}
                key={song.id + opts.field}
                h={opts.h} />
  },

  /**
   * Render as a single row if the song is closed.
   * If it is open, display all the information about this song
   */
  render: function () {
    var song = this.props.song,
        isOpen = song.open,
        classes = classNames('song', {'open': isOpen, 'loading': song.loading});

    var button;
    if (song.adding) {
      button = <button className='edit-btn sage-btn' onClick={this.uploadSong}>upload</button>
    } else if (song.editing) {
      button = <button className='edit-btn sage-btn' onClick={this.uploadEdits}>submit</button>
    } else {
      button = <button className='edit-btn sage-btn' onClick={this.prepareForEdit}>edit</button>
    }

    var headerRows, transitionContent, onClick;
    if (isOpen) {
      document.addEventListener('click', this.documentClickHandler);
      headerRows = SongHeaderRows.map(row => this.constructRow(song, row));
      var bodyRows = SongBodyRows.map(row => this.constructRow(song, row));
      transitionContent = (song.loaded || song.adding) ? <SongBody button={button} bodyRows={bodyRows} /> : null;
    } else {
      document.removeEventListener('click', this.documentClickHandler);
      headerRows = SongClosedRows.map(row => this.constructRow(song, row));
      onClick = SongActions.openSong.bind(SongActions, song);
    }

    return <li className={classes} key={song.id} onClick={onClick}>
             <div className='song-header'>{headerRows}</div>
             <TransitionGroup>{transitionContent}</TransitionGroup>
           </li>;
  },

  onChange: function (field, e) {
    var newState = {};
    newState[field] = e.target.value;
    this.setState(newState);
  },

  /**
   * when a file is passed to the input field, retrieve the contents as a
   * base64-encoded data URI and save it to the component's state
   */
  handleFile: function (field, e) {
    var state = {};
    state[field] = e.target.files[0];
    this.setState(state);
  },

  uploadSong: function () {
    var toUpload = {};
    for (var key in this.state) {
      if (this.state.hasOwnProperty(key) && key.indexOf('editing_') > -1) {
        var value = this.state[key];
        if (key === 'editing_arrangers' || key === 'editing_soloists' || key === 'editing_directors' || key === 'editing_concerts' || key === 'editing_semesters')
          value = value.split(',').map(s => s.trim());
        // substringing at 8 gives us the "prop" in "editing_prop"
        toUpload[key.substring(8)] = value;
      }
    }
    SongActions.uploadSong(toUpload);
  },

  prepareForEdit: function () {
    var song = this.props.song;
    var formState = {formActive: true};
    for (var prop in song) {
      if (song.hasOwnProperty(prop)) {
        if (prop !== 'id') {
          formState['editing_' + prop] = song[prop];
        }
      }
    }
    formState.editing_arrangers = formState.editing_arrangers && formState.editing_arrangers.map(s => s.name).join(', ');
    formState.editing_directors = formState.editing_directors && formState.editing_directors.map(s => s.name).join(', ');
    formState.editing_semesters = formState.editing_semesters && formState.editing_semesters.map(s => s.name).join(', ');
    formState.editing_soloists  = formState.editing_soloists  && formState.editing_soloists.map(s => s.name).join(', ');
    formState.editing_concerts  = formState.editing_concerts  && formState.editing_concerts.map(s => s.name).join(', ');
    this.setState(formState);
  },

  uploadEdits: function () {
    this.cancelEdit();
  },

  cancelEdit: function () {
    this.setState({formActive: false});
  }
});

/**
 * Helper Body class so that we can have entering and leaving animations
 */
var SongBody = React.createClass({
  componentWillEnter: function (callback) {
    Animations.expandDown(this.getDOMNode()).then(callback);
  },
  componentWillLeave: function (callback) {
    Animations.collapseUp(this.getDOMNode()).then(callback);
  },
  render: function () {
    return <div className='song-body'>{this.props.button}{this.props.bodyRows}</div>
  }
});

module.exports = Song;