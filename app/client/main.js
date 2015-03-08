var JSX = require('node-jsx'),
    React = require('react');

React.render(
  <div className="window">
    <h1>Sage</h1>
    <p>welcome to Sage.</p>
  </div>,
  document.getElementById('body')
);