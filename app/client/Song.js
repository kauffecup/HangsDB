var React = require('react'),
    songController = require('./songController');

var notesMap = {
  0: 'C',
  1: 'C#',
  2: 'D',
  3: 'Eb',
  4: 'E',
  5: 'F',
  6: 'F#',
  7: 'G',
  8: 'Ab',
  9: 'A',
  10: 'Bb',
  11: 'B'
}

var boolMap = {
  0: 'no',
  1: 'yes'
}

var difficultyMap = {
  1: 'easy',
  2: 'medium',
  3: 'hard'
}

var receptionMap = {
  1: 'hated it',
  2: 'liked it',
  3: 'loved it'
}

var typeMap = {
  1: 'handwritten',
  2: 'electronic',
  3: 'copy of electronic'
}

var qualityMap = {
  1: 'poor',
  2: 'respectable',
  3: 'pristine'
}

var partMap = {
  1: 'tenor 1',
  2: 'tenor 2',
  3: 'baritone',
  4: 'bass'
}

/**
 * A helper row class. Sets up either a multivaluedrow or singlevalued row with
 * the appropriate properties.
 * @prop attr - the attribute for this row
 * @prop field - the field this class will represent when open and modify when editing
 * @prop parent - the parent <Song> reference so we can grab the song data and call the onChange function
 * @prop multi - boolean indicating whether or not we should create a MultiValuedRow or SingleValuedRow
 * @prop valueMap - the map of value:displayvalue (one of the maps defined on top)
 */
var Row = React.createClass({
  render: function () {
    var field = this.props.field,
        parent = this.props.parent,
        song = parent.props.song,
        editing = song.editing || song.adding,
        value = song[field],
        editingvalue = parent.state[field],
        valueMap = this.props.valueMap,
        multi = this.props.multi,
        valueDefined = (!multi && (value || typeof value === 'number')) || (multi && value && value.length);

    // if there is a value defined or we're editing, display the row
    if (valueDefined || editing) {
      // if its a multi valued field, wrap each value in its own span
      if (this.props.multi) {
        value = value && value.map(function (value) {
          return <span className='multi-value' key={value.id}>{value.name}</span>;
        });
      // if its a mapped field, substitute in the real value. note that multi and map are mutually exclusive
      } else if (valueMap) {
        value = valueMap[value];
      }

      // if we're editing, use an input or drop down instead of a span. hook up the input with the parent's onchange event
      var valueRow;
      if (editing) {
        // if there is a value map, the editable field will be a drop down
        if (valueMap) {
          var items = flattenMap(valueMap);
          items.unshift({value: ''});
          items = items.map(function (item) {
            return <option value={item.value} key={item.value}>{item.display}</option>;
          });
          valueRow = <select className='value' value={editingvalue} onChange={parent.onChange.bind(parent, field)}>{items}</select>;
        // otherwise the editable field is an input
        } else {
          valueRow = <input className='value' value={editingvalue} onChange={parent.onChange.bind(parent, field)} placeholder={this.props.placeholder}></input>;
        }
      } else {
        valueRow  = <span className='value'>{value}</span>;
      }

      return <div className="song-row">
             <span className='attr'>{this.props.attr}</span>
             {valueRow}
           </div>
    // return nothing if there is no value or we are not editing
    } else {
      return null;
    }
  }
});

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

flattenMap = function (map) {
  return Object.keys(map).map(function(key) { return {value: key, display: map[key]}; });
}

/**
 * A Song.
 * For now, only display the song's name and year.
 * When clicked, a song is "open" and will display everything we know about it
 * @prop song - this song view controller's associated song model
 */
module.exports = React.createClass({
  getInitialState: function () {
    return this.flattenSong();
  },

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
    songController.editSong(this.props.song);
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
    songController.uploadSong(state);
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
        isOpen = song.open || song.adding,
        classes = isOpen ? 'song open' : 'song';

    var interior;
    if (!isOpen) {
      interior = 
        <div className='song-stuffs' onClick={songController.openSong.bind(songController, song)}>
          <span className='song-title'>{song.name}</span>
          <span className='song-year'>{song.original_song_year}</span>
        </div>
      ;
    } else {
      var editSubmitClick, editSubmitText;
      if (song.adding) {
        editSubmitClick = this.uploadSong;
        editSubmitText = 'upload'
      } else if (song.editing) {
        editSubmitClick = songController.onDoneEdit.bind(songController, song);
        editSubmitText = 'submit'
      } else {
        editSubmitClick = this.onEdit;
        editSubmitText = 'edit'
      }
      // TODO: artist once we have more than just artist id songController.openSong(this.props.song)
      // TODO: get arranged semester info from arrangement_semester_id, arrangement_type_id
      interior =
        <div className='song-stuffs'>
          <SongHeader parent={this} />
          <button className='edit-btn sage-btn' onClick={editSubmitClick}>{editSubmitText}</button>
          <Row attr='opb:'             field='artist_id'            parent={this} placeholder='Ke$ha' />
          <Row attr='Arranged by:'     field='arrangers'            parent={this} placeholder='Adam Beckwith, Hasa Question' multi={true} />
          <Row attr='Arranged in:'     field='arranged_semester_id' parent={this} placeholder='Spring 1987'/>
          <Row attr='Soloists:'        field='soloists'             parent={this} placeholder='Roshun Steppedinshit, Matt Damon' multi={true} />
          <Row attr='Directed by:'     field='directors'            parent={this} placeholder='Jron Poffeecoops, Mas Resbin' multi={true} />
          <Row attr='Key:'             field='song_key'             parent={this} valueMap={notesMap} />
          <Row attr='Active:'          field='active'               parent={this} valueMap={boolMap} />
          <Row attr='Difficulty:'      field='difficulty'           parent={this} valueMap={difficultyMap} />
          <Row attr='Genre:'           field='genre'                parent={this} placeholder='Country Sex' />
          <Row attr='Has Choreo:'      field='has_choreo'           parent={this} valueMap={boolMap} />
          <Row attr='Has Syllables:'   field='has_syllables'        parent={this} valueMap={boolMap} />
          <Row attr='Number of Parts:' field='number_of_parts'      parent={this} placeholder='5' />
          <Row attr='Pitch Blown:'     field='pitch_blown'          parent={this} valueMap={notesMap} />
          <Row attr='Quality:'         field='quality'              parent={this} valueMap={qualityMap} />
          <Row attr='Group Reception:' field='reception'            parent={this} valueMap={receptionMap} />
          <Row attr='Solo Range:'      field='solo_voice_part_id'   parent={this} valueMap={partMap} />
          <Row attr='Youtubes:'        field='youtube_url'          parent={this} placeholder='https://www.youtube.com/watch?v=AdYaTa_lOf4' />
          <Row attr='Concerts:'        field='concerts'             parent={this} placeholder='Happy Hour XXXX, Fall Tonic II' multi={true} />
          <Row attr='Semesters:'       field='semesters'            parent={this} placeholder='Spring 2013, Fall 1999' multi={true} />
          <Row attr='Type:'            field='arrangement_type_id'  parent={this} valueMap={typeMap} />
          <Row attr='Notes:'           field='notes'                parent={this} placeholder='This song is smelly.' />
        </div>
      ;
    }
    return <li className={classes}>{interior}</li>;
  }
});