var React = require('react'),
    http = require('http'),
    querystring = require('querystring');

var DropDown = React.createClass({
  handleChange: function (event) {
    this.setState({value: event.target.value});
    this.props.changeFunc(this.props.propChange, event.target.value);
  },
  render: function () {
    var items = this.props.items.map(function (item) {
      return <option value={item.value || item}>{item.display || item}</option>;
    });
    var value = (this.state && this.state.value) || '';
    return <select className='sage-drop-down' value={value} onChange={this.handleChange}>{items}</select>;
  }
});

var Input = React.createClass({
  handleChange: function (event) {
    this.setState({value: event.target.value});
    this.props.changeFunc(this.props.propChange, event.target.value);
  },
  render: function() {
    var value = (this.state && this.state.value) || '';
    return <input type="text" value={value} onChange={this.handleChange} />;
  }
});

var TextArea = React.createClass({
  handleChange: function (event) {
    this.setState({value: event.target.value});
    this.props.changeFunc(this.props.propChange, event.target.value);
  },
  render: function() {
    var value = (this.state && this.state.value) || '';
    return <textarea value={value} onChange={this.handleChange}></textarea>;
  }
});

/**
 * An AddSongForm
 */
module.exports = React.createClass({
  getInitialState: function () {
    return {
      opened: false,
      name: '',
      nickname: ''
    };
  },

  openForm: function () {
    this.setState({opened: true});
  },

  closeForm: function () {
    this.setState({
      opened: false,
      name : '',
      nickname : '',
      opb : '',
      year : '',
      genre : '',
      arrType : 1,
      soloRange : 1,
      quality : 1,
      hasSyllables : false,
      isActive : false,
      hasChoreo : false,
      numParts : '',
      arrangedby : '',
      arrangedSemester : '',
      soloists : '',
      key: 0,
      pitchBlown : 0,
      difficulty : 1,
      reception : 1,
      mds : '',
      youtubeLink : '',
      concertsIn : '',
      semestersIn : '',
      notes : ''
    });
  },

  updateFormState: function (state, newValue) {
    var stateObj = {};
    stateObj[state] = newValue;
    this.setState(stateObj);
  },

  onSubmit: function () {
    var postData = querystring.stringify({
      name : this.state.name,
      nickname : this.state.nickname,
      opb : this.state.opb,
      year : this.state.originalYear,
      genre : this.state.genre,
      arrType : this.state.arrType || 1,               // TODO: define default through getinitialstate
      soloRange : this.state.soloRange || 1,           // TODO: define default through getinitialstate
      quality : this.state.quality || 1,               // TODO: define default through getinitialstate
      hasSyllables : this.state.hasSyllables || false, // TODO: define default through getinitialstate
      isActive : this.state.isActive || false,         // TODO: define default through getinitialstate
      hasChoreo : this.state.hasChoreo || false,       // TODO: define default through getinitialstate
      numParts : this.state.numParts,
      arrangedby : (this.state.arrangedby || '').split(',').map(function(str) {return str.trim()}),
      arrangedSemester : this.state.arrangedSemester,
      soloists : (this.state.soloists || '').split(',').map(function(str) {return str.trim()}),
      key : this.state.key || 0,         // TODO: define default through getinitialstate
      pitchBlown : this.state.pitchBlown || 0,         // TODO: define default through getinitialstate
      difficulty : this.state.difficulty || 1,
      reception : this.state.reception || 1,
      mds : (this.state.mds || '').split(',').map(function(str) {return str.trim()}),
      youtubeLink : this.state.youtubeLink,
      concertsIn : (this.state.concertsIn || '').split(',').map(function(str) {return str.trim()}),
      semestersIn : (this.state.semestersIn || '').split(',').map(function(str) {return str.trim()}),
      notes : this.state.notes
    });

    // TODO this really needs to not be in the onsubmit code
    var options = {
      path: '/upload',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };
    var req = http.request(options, function (res) {});
    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
    // write data to request body
    req.write(postData);
    req.end();

    this.closeForm();
  },

  render: function () {
    return this.state.opened ?
      <form className='add-song-form'>
        <button type='button' className='close-form-button' onClick={this.closeForm}>x</button>
        <div>shut up roshun i made this last night.</div>

        <div className='form-section'>
          <div className='form-section-header'>About the song</div>

          Name of Song:
          <Input propChange='name' changeFunc={this.updateFormState} />

          Abbreviation:
          <Input propChange='nickname' changeFunc={this.updateFormState} />

          Originally Performed By:
          <Input propChange='opb' changeFunc={this.updateFormState} />

          Year:
          <Input propChange='originalYear' changeFunc={this.updateFormState} />

          Genre:
          <Input propChange='genre' changeFunc={this.updateFormState} />

          Solo Range:
          <DropDown propChange='soloRange' items={[{display:'Tenor 1',value:1}, {display:'Tenor 2',value:2}, {display:'Baritone',value:3}, {display:'Bass',value:4}]} changeFunc={this.updateFormState}/>
        </div>

        <div className='form-section'>
          <div className='form-section-header'>About the arrangement</div>

          Quality of scan:
          <DropDown propChange='quality' items={[1,2,3,4,5,6,7,8,9,10]} changeFunc={this.updateFormState} />

          Has Syllables:
          <DropDown propChange='hasSyllables' items={[{display:'no', value:false}, {display: 'yes', value:true}]} changeFunc={this.updateFormState} />

          Type of Arrangement Scan:
          <DropDown propChange='arrType' items={[{display:'Handwritten Original', value:1}, {display:'Electronic', value:2}, {display:'Copy of Handwritten',value:3}, {display:'Copy of Electronic',value:4}]} changeFunc={this.updateFormState} />

          Number of parts:
          <Input propChange='numParts' changeFunc={this.updateFormState} />

          Arranged By (comma separated, BITCH):
          <Input propChange='arrangedby' changeFunc={this.updateFormState} />

          Arranged (has to be in format "Spring 2009" or "Fall 1983"):
          <Input propChange='arrangedSemester' changeFunc={this.updateFormState} />
        </div>

        <div className='form-section'>
          <div className='form-section-header'>About the performance</div>

          Soloist(s) (separate by commas BITCH):
          <Input propChange='soloists' changeFunc={this.updateFormState} />

          Active:
          <DropDown propChange='isActive' items={[{display:'no', value:false}, {display: 'yes', value:true}]} changeFunc={this.updateFormState} />

          Key:
          <DropDown propChange='key'
            items={[{display:'C', value:0},
              {display:'C#',  value: 1},
              {display: 'D',  value: 2},
              {display: 'Eb', value: 3},
              {display: 'E',  value: 4},
              {display: 'F',  value: 5},
              {display: 'F#', value: 6},
              {display: 'G',  value: 7},
              {display: 'Ab', value: 8},
              {display: 'A',  value: 9},
              {display: 'Bb', value: 10},
              {display: 'B',  value: 11}]}
            changeFunc={this.updateFormState} />

          Pitch Blown:
          <DropDown propChange='pitchBlown'
            items={[{display:'C', value:0},
              {display:'C#',  value: 1},
              {display: 'D',  value: 2},
              {display: 'Eb', value: 3},
              {display: 'E',  value: 4},
              {display: 'F',  value: 5},
              {display: 'F#', value: 6},
              {display: 'G',  value: 7},
              {display: 'Ab', value: 8},
              {display: 'A',  value: 9},
              {display: 'Bb', value: 10},
              {display: 'B',  value: 11}]}
            changeFunc={this.updateFormState} />
          
          Difficulty:
          <DropDown propChange='difficulty' items={[{display: 'Easy', value: 1}, {display:'Medium',value:2}, {display:'Hard',value:3}]} changeFunc={this.updateFormState} />

          Has Choreo:
          <DropDown propChange='hasChoreo' items={[{display:'no', value:false}, {display: 'yes', value:true}]} changeFunc={this.updateFormState} />

          Group Reception:
          <DropDown propChange='reception' items={[1,2,3,4,5,6,7,8,9,10]} changeFunc={this.updateFormState} />
          
          MDs who have MDed this (comma separated with no AND - 'Jonathan Kaufman, Roshun Brestone')
          <Input propChange='mds' changeFunc={this.updateFormState} />

          Youtube link (empty if none):
          <Input propChange='youtubeLink' changeFunc={this.updateFormState} />

          Performed in (comma separated with no and - 'Happy Hour XX, Fall Tonic XXX'):
          <Input propChange='concertsIn' changeFunc={this.updateFormState} />

          Semesters done (comma separated with no and - 'Spring 2009, Fall 2014'):
          <Input propChange='semestersIn' changeFunc={this.updateFormState} />
        </div>

        <div className='form-section'>
          <div className='form-section-header'>Any additional notes</div>
          <TextArea propChange='notes' changeFunc={this.updateFormState} />
        </div>

        <button type='button' className='submit-song-button' onClick={this.onSubmit}>submit</button>
      </form>
      :
      <button className='add-song-button' onClick={this.openForm}>+</button>;
  }
});