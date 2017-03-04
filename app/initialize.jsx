var ReactDOM = require('react-dom');
var React    = require('react');
var App      = require('./components/app.jsx');

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(<App/>, document.getElementById('app'));
}, false);
