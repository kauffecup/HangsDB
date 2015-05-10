var Velocity = require('velocity-animate');

/**
 * An animations helper class.
 */
var Animations = {
  /**
   * Scroll a domnode into view relative to a container dom node
   * @param  {The dom node we want to scroll in to view}
   * @param  {The parent with the scroll bar}
   */
  scrollIntoView: function (domNode, containerNode) {
    return Velocity(domNode, 'scroll', {
      duration: 500,
      easing: 'ease-out',
      container: containerNode,
      offset: -50
    });
  },

  /**
   * Expand a dom node! This'll be used when opening a song.
   * @param  {The dom node, we're expandin}
   */
  expandOut: function (domNode) {
    return Velocity(domNode, {
      'margin-left': -20,
      'margin-right': -20,
      'margin-top': 20,
      'margin-bottom': 20
    }, {
      duration: 100
    });
  },

  /**
   * The oposite of expandOut
   * @param  {The dom node, we're collapsin}
   */
  collapseIn: function (domNode) {
    return Velocity(domNode, {
      'margin-left': 0,
      'margin-right': 0,
      'margin-top': 0,
      'margin-bottom': 0
    }, {
      duration: 100
    });
  },

  /**
   * Expand a dom node from 0-open vertically
   * @param  {The dom node, we're expandin}
   */
  expandDown: function (domNode) {
    return Velocity(domNode, {
      'max-height': 1200
    }, {
      duration: 400
    });
  },

  /**
   * The opposite of expand down
   * @param  {The dom node we're collapsin}
   */
  collapseUp: function (domNode) {
    return Velocity(domNode, {
      'max-height': [0, domNode.clientHeight]
    }, {
      duration: 100
    });
  }
};

module.exports = Animations;