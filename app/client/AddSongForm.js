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
    // put default value at start of array
    items.unshift(<option value=''></option>);
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
    return <input type="text" placeholder={this.props.placeholder || ''} value={value} onChange={this.handleChange} />;
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
      arrType : '',
      soloRange : '',
      quality : '',
      hasSyllables : '',
      isActive : '',
      hasChoreo : '',
      numParts : '',
      arrangedby : '',
      arrangedSemester : '',
      soloists : '',
      key: '',
      pitchBlown : '',
      difficulty : '',
      reception : '',
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
      arrType : this.state.arrType,
      soloRange : this.state.soloRange,
      quality : this.state.quality,
      hasSyllables : this.state.hasSyllables,
      isActive : this.state.isActive,
      hasChoreo : this.state.hasChoreo,
      numParts : this.state.numParts,
      arrangedby : (this.state.arrangedby || '').split(',').map(function(str) {return str.trim()}),
      arrangedSemester : this.state.arrangedSemester,
      soloists : (this.state.soloists || '').split(',').map(function(str) {return str.trim()}),
      key : this.state.key,
      pitchBlown : this.state.pitchBlown,
      difficulty : this.state.difficulty,
      reception : this.state.reception,
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
        <div className='header'>
          <div>shut up roshun i made this last night.</div>
          <button type='button' className='close-form-button sage-btn' onClick={this.closeForm}>x</button>
        </div>

        <div className='form-section'>
          <div className='form-section-header'>About the song</div>

          <div className='form-row'>
            Name of Song:
            <Input propChange='name' placeholder='You Got a "C"' changeFunc={this.updateFormState} />

            Abbreviation:
            <Input propChange='nickname' placeholder='YGAC' changeFunc={this.updateFormState} />
          </div>

          <div className='form-row'>
            Originally Performed By:
            <Input propChange='opb' placeholder='Matt Damon' changeFunc={this.updateFormState} />

            Year:
            <Input propChange='originalYear' placeholder='1983' changeFunc={this.updateFormState} />
          </div>

          <div className='form-row'>
            Genre:
            <Input propChange='genre' placeholder='Country Sex' changeFunc={this.updateFormState} />

            Solo Range:
            <DropDown propChange='soloRange' items={[{display:'Tenor 1',value:1}, {display:'Tenor 2',value:2}, {display:'Baritone',value:3}, {display:'Bass',value:4}]} changeFunc={this.updateFormState}/>
          </div>
        </div>

        <div className='form-section'>
          <div className='form-section-header'>About the arrangement</div>

          <div className='form-row'>
            Arranged By (comma separated):
            <Input propChange='arrangedby' placeholder='Adam Beckwith, Hasa Question' changeFunc={this.updateFormState} />

          </div>

          <div className='form-row'>
            Semester Arranged:
            <Input propChange='arrangedSemester' placeholder='Fall 2013' changeFunc={this.updateFormState} />

            Type of Arrangement Scan:
            <DropDown propChange='arrType' items={[{display:'Handwritten', value:1}, {display:'Electronic', value:2}, {display:'Copy of Electronic',value:3}]} changeFunc={this.updateFormState} />

          </div>

          <div className='form-row'>
            Quality of scan:
            <DropDown propChange='quality' items={[{display:'poor', value:1}, {display:'average', value:2}, {display:'good',value:3}]} changeFunc={this.updateFormState} />

            Has Syllables:
            <DropDown propChange='hasSyllables' items={[{display:'no', value:false}, {display: 'yes', value:true}]} changeFunc={this.updateFormState} />

            Number of parts:
            <Input propChange='numParts' placeholder='4' changeFunc={this.updateFormState} />
          </div>


        </div>

        <div className='form-section'>
          <div className='form-section-header'>About the performance</div>

          <div className='form-row'>
            Soloist(s) (comma):
            <Input propChange='soloists' placeholder='Jonathan Kaufman, Jordan Toth' changeFunc={this.updateFormState} />
          </div>

          <div className='form-row'>
            Concerts (comma):
            <Input propChange='concertsIn' placeholder='Happy Hour XXI, Fall Tonic II' changeFunc={this.updateFormState} />

            Semesters (comma):
            <Input propChange='semestersIn' placeholder="Spring 1888, Spring 1889, Fall 2015" changeFunc={this.updateFormState} />
          </div>

          <div className='form-row'>
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
          </div>

          <div className='form-row'>
            Active:
            <DropDown propChange='isActive' items={[{display:'no', value:false}, {display: 'yes', value:true}]} changeFunc={this.updateFormState} />

            Has Choreo:
            <DropDown propChange='hasChoreo' items={[{display:'no', value:false}, {display: 'yes', value:true}]} changeFunc={this.updateFormState} />

            Group Reception:
            <DropDown propChange='reception' items={[{display:'hated it', value:1}, {display:'liked it', value:2}, {display:'loved it',value:3}]} changeFunc={this.updateFormState} />
          </div>

          <div className='form-row'>
            MDs who have MDed this:
            <Input propChange='mds' placeholder="Sam Breslin, Christian Bale, Roshun Steppedinshit" changeFunc={this.updateFormState} />
          </div>

          <div className='form-row'>
            Youtube link:
            <Input propChange='youtubeLink' placeholder="https://www.youtube.com/watch?v=AdYaTa_lOf4" changeFunc={this.updateFormState} />
          </div>
        </div>

        <div className='form-section'>
          <div className='form-section-header'>Any additional notes</div>
          <TextArea propChange='notes' changeFunc={this.updateFormState} />
        </div>

        <button type='button' className='submit-song-button sage-btn' onClick={this.onSubmit}>submit</button>
      </form>
      :
      <button className='add-song-button sage-btn' onClick={this.openForm}>+</button>;
  }
});