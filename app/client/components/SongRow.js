var React = require('react'),
    classNames = require('classnames');

/**
 * A helper row class. Sets up either a multivaluedrow or singlevalued row with
 * the appropriate properties.
 * @prop attr - the attribute for this row
 * @prop field - the field this class will represent when open and modify when editing
 * @prop parent - the parent <Song> reference so we can grab the song data and call the onChange function
 * @prop multi - boolean indicating whether or not we should create a MultiValuedRow or SingleValuedRow
 * @prop valueMap - the map of value:displayvalue (one of the maps defined on top)
 */
var SongRow = React.createClass({
  flattenMap: function (map) {
    return Object.keys(map).map(function(key) { return {value: key, display: map[key]}; });
  },

  render: function () {
    var formActive = this.props.formActive,
        value = this.props.value,
        editingvalue = this.props.editingValue,
        valueMap = this.props.valueMap,
        multi = this.props.multi,
        valueDefined = (!multi && (value || typeof value === 'number')) || (multi && value && value.length);

    // if there is a value defined or we're editing, display the row
    if (valueDefined || formActive) {
      // if its a multi valued field, make it a comma separated list
      if (this.props.multi) {
        value = value && value.map(value => value.name).join(', ');
      // if its a mapped field, substitute in the real value. note that multi and map are mutually exclusive
      } else if (valueMap) {
        value = valueMap[value];
      // if its a file... link to it!
      } else if (this.props.file) {
        value = <a href={'/files/' + value} target='_blank'>clickers</a>
      }

      // if we're editing, use an input or drop down instead of a span. hook up the input with the passed in onchange event
      var valueRow;
      if (formActive) {
        // if there is a value map, the editable field will be a drop down
        if (valueMap) {
          var items = this.flattenMap(valueMap);
          items.unshift({value: ''});
          items = items.map(function (item) {
            return <option value={item.value} key={item.value}>{item.display}</option>;
          });
          valueRow = <select className='value' value={editingvalue} onChange={this.props.onChange}>{items}</select>;
        // if its a file it'll be a file thing
        } else if (this.props.file) {
          valueRow = <input className='value' type='file' onChange={this.props.onChange}></input>
        // otherwise the editable field is an input
        } else {
          valueRow = <input className='value' value={editingvalue} onChange={this.props.onChange} placeholder={this.props.placeholder}></input>;
        }
      } else {
        // if a header value is defined render that header. otherwise render a span.
        switch (this.props.h) {
          case 1: valueRow = <h1 className='value'>{value}</h1>; break;
          case 2: valueRow = <h2 className='value'>{value}</h2>; break;
          case 3: valueRow = <h3 className='value'>{value}</h3>; break;
          case 4: valueRow = <h4 className='value'>{value}</h4>; break;
          case 5: valueRow = <h5 className='value'>{value}</h5>; break;
          case 6: valueRow = <h6 className='value'>{value}</h6>; break;
          default: valueRow = <span className='value'>{value}</span>; break;
        }
      }

      var attribute = this.props.attr ? <h6>{this.props.attr}</h6> : null;
      var classes = classNames('song-row', this.props.className);
      return <div className={classes}>{attribute}{valueRow}</div>
    // return nothing if there is no value and we're not editing
    } else {
      return null;
    }
  }
});

module.exports = SongRow;