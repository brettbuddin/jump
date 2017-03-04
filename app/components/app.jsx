var React     = require('react');
var Dashboard = require('./dashboard.jsx');

var App = React.createClass({
    render: function() {
        return (
        <div className="layout-page-content">
            <Dashboard />
        </div>
        )
    }
});

module.exports = App;
