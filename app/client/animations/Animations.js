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
    Velocity(domNode, 'scroll', {
      duration: 500,
      easing: 'ease-out',
      container: containerNode,
      offset: -50
    });
  }
};

module.exports = Animations;