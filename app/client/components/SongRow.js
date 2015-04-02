var React = require('react'),
    classNames = require('classNames');

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
        editingvalue = editingvalue && editingvalue.join(', ');
      // if its a mapped field, substitute in the real value. note that multi and map are mutually exclusive
      } else if (valueMap) {
        value = valueMap[value];
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
        // otherwise the editable field is an input
        } else {
          valueRow = <input className='value' value={editingvalue} onChange={this.props.onChange} placeholder={this.props.placeholder}></input>;
        }
      } else {
        valueRow  = <span className='value'>{value}</span>;
      }

      var attribute = this.props.attr ? <span className='attr'>{this.props.attr}</span> : null;
      var classes = classNames('song-row', this.props.className);

      return <div className={classes}>{attribute}{valueRow}</div>
    // return nothing if there is no value and we're not editing
    } else {
      return null;
    }
  }
});

module.exports = SongRow;