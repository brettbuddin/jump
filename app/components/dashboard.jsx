var React      = require('react');
var Moment     = require('moment');
var _          = require('underscore');
var Github     = require('../lib/github.js');
var Filter     = require('./filter.jsx');
var Settings   = require('./settings.jsx');
var classnames = require('classnames');

var Dashboard = React.createClass({
    getInitialState: function() {
        return { 
            repos: [], 
            user: {},
            filterHidden:   false,
            fetching: false,
            settingsHidden: true
        }
    },
    componentDidMount: function() {
        var token = localStorage.getItem('token');
        if (_.isNull(token)) {
            return;
        }

        var dashboard = this;
        var now       = Moment();
        var refresh   = function() {
            dashboard.setState({fetching: true});

            Github(token)
                .get('/user/repos')
                .then(function(pages) {
                    Promise
                        .all(pages)
                        .then(_.flatten)
                        .then(function(rawRepos) {
                            var repos = _.map(rawRepos, function(r) {
                                return { id: r.id, name: r.full_name, url: r.html_url };
                            });

                            dashboard.setState({fetching: false});
                            dashboard.setState({repos: repos});
                            localStorage.setItem('repos', JSON.stringify(repos));
                            localStorage.setItem('last_refresh', now.format());
                    })
                .catch(function(err) {
                    console.log(err);
                    dashboard.setState({fetching: false});
                });
            });
        };

        var lastRefresh = Moment(localStorage.getItem('last_refresh'));

        if (!lastRefresh.isValid()) {
            refresh();
            return;
        }

        var jsonRepos = localStorage.getItem('repos');
        if (_.isNull(jsonRepos)) {
            refresh();
            return;
        }
        this.setState({repos: JSON.parse(jsonRepos)});

        if (now.isAfter(lastRefresh.add(1, 'hour'))) {
            refresh();
        }
    },
    toggleSettingsClick: function(e) {
        e.preventDefault();
        this.setState({filterHidden: !this.state.filterHidden, settingsHidden: !this.state.settingsHidden});
    },
    settingsChanged: function() {
        this.componentDidMount();
    },
    render: function() {
        return (
        <div className="dashboard">
            <div className="settings">
                <a href="#" className="settings-toggle" onClick={this.toggleSettingsClick}>{this.state.settingsHidden ? 'Settings' : 'Hide Settings'}</a>
                <div className={this.state.settingsHidden ? 'is-hidden' : ''}>
                    <Settings onChange={this.settingsChanged} />
                </div>
            </div>
            <div className={classnames({
                    'is-hidden': this.state.filterHidden,
                    'is-fetching': this.state.fetching,
                })}>
                <Filter items={this.state.repos} placeholder="Jump to repository..." />
            </div>
        </div>
        );
    }
});

module.exports = Dashboard;
