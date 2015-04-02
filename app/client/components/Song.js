var React = require('react'),
    SongConstants = require('../constants/SongConstants'),
    SongActions = require('../actions/SongActions'),
    classNames = require('classNames'),
// react components
    Row = require('./SongRow');

/**
 * A Song.
 * For now, only display the song's name and year.
 * When clicked, a song is "open" and will display everything we know about it
 * @prop song - this song view controller's associated song model
 */
var Song = React.createClass({
  /**
   * Whenever a new song the user is added is put in the dom, scroll it in to view
   */
  componentDidMount: function () {
    if (this.props.song.adding)
      SongActions.scrollSong(this.getDOMNode());
  },

  /**
   * When this is being removed, clean up the document handler
   */
  componentWillUnmount: function () {
    document.removeEventListener('click', this.documentClickHandler);
  },

  /**
   * This is the event that we put on the document when a song is open... it closes the song.
   */
  documentClickHandler: function (e) {
    if (!this.getDOMNode().contains(e.target))
      SongActions.closeOpenSong();
  },

  /**
   * Render as a single row if the song is closed.
   * If it is open, display all the information about this song
   */
  render: function () {
    var song = this.props.song,
        isOpen = song.open || song.adding,
        classes = classNames('song', {'open': isOpen});

    var interior;
    if (!isOpen) {
      // if we're closed, remove the document click event that we registered
      document.removeEventListener('click', this.documentClickHandler);

      // configure the dom for the interior
      interior = 
        <div className='song-stuffs' onClick={SongActions.openSong.bind(SongActions, song)}>
          <Row className='song-name'   value={song.name}        />
          <Row className='song-artist' value={song.artist_name} />
        </div>
      ;
    } else {
      // if we're open, add a document click event that will close the song when clicked outside
      document.addEventListener('click', this.documentClickHandler);

      // configure the dom for the interior
      var editSubmitClick, editSubmitText;
      if (song.adding) {
        editSubmitClick = SongActions.uploadSong.bind(SongActions, song);
        editSubmitText = 'upload'
      } else if (song.editing) {
        editSubmitClick = SongActions.uploadEdits.bind(SongActions, song);
        editSubmitText = 'submit'
      } else {
        editSubmitClick = SongActions.editSong.bind(SongActions, song);
        editSubmitText = 'edit'
      }

      // this is the nick name row! we define it up here because we dont want the parens to be there
      // when there is no nickname! woo!
      var formActive = song.editing || song.adding;
      var nicknameRow = (song.nickname || formActive) ?
          <div className='song-nickname'>
            (<Row formActive={formActive} value={song.nickname} editingValue={song.editing_nickname} onChange={SongActions.editField.bind(SongActions, song, 'editing_nickname')} placeholder='YGAC' />)
          </div>
          : null;

      interior =
        <div className='song-stuffs'>
          <div className='song-header'>
            <Row className='song-name' formActive={formActive} value={song.name} editingValue={song.editing_name} onChange={SongActions.editField.bind(SongActions, song, 'editing_name')} placeholder='You Got A "C"' />
            {nicknameRow}
            <Row formActive={formActive} value={song.original_song_year} editingValue={song.editing_original_song_year} onChange={SongActions.editField.bind(SongActions, song, 'editing_original_song_year')}  placeholder='1983' />
            <Row className='song-artist' formActive={formActive} value={song.artist_name} editingValue={song.editing_artist_name} onChange={SongActions.editField.bind(SongActions, song, 'editing_artist_name')} placeholder='Sebastian' />
          </div>
          <button className='edit-btn sage-btn' onClick={editSubmitClick}>{editSubmitText}</button>
          <Row attr='Arranged by:'     formActive={formActive} value={song.arrangers}          editingValue={song.editing_arrangers}           onChange={SongActions.editField.bind(SongActions, song, 'editing_arrangers')}           placeholder='Adam Beckwith, Hasa Question' multi={true} />
          <Row attr='Arranged in:'     formActive={formActive} value={song.arranged_semester}  editingValue={song.editing_arranged_semester}   onChange={SongActions.editField.bind(SongActions, song, 'editing_arranged_semester')}   placeholder='Spring 1987'/>
          <Row attr='Soloists:'        formActive={formActive} value={song.soloists}           editingValue={song.editing_soloists}            onChange={SongActions.editField.bind(SongActions, song, 'editing_soloists')}            placeholder='Roshun Steppedinshit, Matt Damon' multi={true} />
          <Row attr='Directed by:'     formActive={formActive} value={song.directors}          editingValue={song.editing_directors}           onChange={SongActions.editField.bind(SongActions, song, 'editing_directors')}           placeholder='Jron Poffeecoops, Mas Resbin' multi={true} />
          <Row attr='Key:'             formActive={formActive} value={song.song_key}           editingValue={song.editing_song_key}            onChange={SongActions.editField.bind(SongActions, song, 'editing_song_key')}            valueMap={SongConstants.notesMap} />
          <Row attr='Active:'          formActive={formActive} value={song.active}             editingValue={song.editing_active}              onChange={SongActions.editField.bind(SongActions, song, 'editing_active')}              valueMap={SongConstants.boolMap} />
          <Row attr='Difficulty:'      formActive={formActive} value={song.difficulty}         editingValue={song.editing_difficulty}          onChange={SongActions.editField.bind(SongActions, song, 'editing_difficulty')}          valueMap={SongConstants.difficultyMap} />
          <Row attr='Genre:'           formActive={formActive} value={song.genre}              editingValue={song.editing_genre}               onChange={SongActions.editField.bind(SongActions, song, 'editing_genre')}               placeholder='Country Sex' />
          <Row attr='Has Choreo:'      formActive={formActive} value={song.has_choreo}         editingValue={song.editing_has_choreo}          onChange={SongActions.editField.bind(SongActions, song, 'editing_has_choreo')}          valueMap={SongConstants.boolMap} />
          <Row attr='Has Syllables:'   formActive={formActive} value={song.has_syllables}      editingValue={song.editing_has_syllables}       onChange={SongActions.editField.bind(SongActions, song, 'editing_has_syllables')}       valueMap={SongConstants.boolMap} />
          <Row attr='Number of Parts:' formActive={formActive} value={song.number_of_parts}    editingValue={song.editing_number_of_parts}     onChange={SongActions.editField.bind(SongActions, song, 'editing_number_of_parts')}     placeholder='5' />
          <Row attr='Pitch Blown:'     formActive={formActive} value={song.pitch_blown}        editingValue={song.editing_pitch_blown}         onChange={SongActions.editField.bind(SongActions, song, 'editing_pitch_blown')}         valueMap={SongConstants.notesMap} />
          <Row attr='Quality:'         formActive={formActive} value={song.quality}            editingValue={song.editing_quality}             onChange={SongActions.editField.bind(SongActions, song, 'editing_quality')}             valueMap={SongConstants.qualityMap} />
          <Row attr='Group Reception:' formActive={formActive} value={song.reception}          editingValue={song.editing_reception}           onChange={SongActions.editField.bind(SongActions, song, 'editing_reception')}           valueMap={SongConstants.receptionMap} />
          <Row attr='Solo Range:'      formActive={formActive} value={song.solo_voice_part_id} editingValue={song.editing_solo_voice_part_id}  onChange={SongActions.editField.bind(SongActions, song, 'editing_solo_voice_part_id')}  valueMap={SongConstants.partMap} />
          <Row attr='Youtubes:'        formActive={formActive} value={song.youtube_url}        editingValue={song.editing_youtube_url}         onChange={SongActions.editField.bind(SongActions, song, 'editing_youtube_url')}         placeholder='https://www.youtube.com/watch?v=AdYaTa_lOf4' />
          <Row attr='Concerts:'        formActive={formActive} value={song.concerts}           editingValue={song.editing_concerts}            onChange={SongActions.editField.bind(SongActions, song, 'editing_concerts')}            placeholder='Happy Hour XXXX, Fall Tonic II' multi={true} />
          <Row attr='Semesters:'       formActive={formActive} value={song.semesters}          editingValue={song.editing_semesters}           onChange={SongActions.editField.bind(SongActions, song, 'editing_semesters')}           placeholder='Spring 2013, Fall 1999' multi={true} />
          <Row attr='Type:'            formActive={formActive} value={song.arrangement_type_id}editingValue={song.editing_arrangement_type_id} onChange={SongActions.editField.bind(SongActions, song, 'editing_arrangement_type_id')} valueMap={SongConstants.typeMap} />
          <Row attr='Notes:'           formActive={formActive} value={song.notes}              editingValue={song.editing_notes}               onChange={SongActions.editField.bind(SongActions, song, 'editing_notes')}               placeholder='This song is smelly.' />
        </div>
      ;
    }
    return <li className={classes}>{interior}</li>;
  }
});

module.exports = Song;