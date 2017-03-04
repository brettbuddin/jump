var React            = require('react');
var LinkedStateMixin = require('react-addons-linked-state-mixin');

var Settings = React.createClass({
    mixins: [LinkedStateMixin],
    propTypes: {
        onChange: React.PropTypes.func
    },
    getDefaultProps: function() {
        return {
            onChange: function(){}
        }
    },
    getInitialState: function() {
        return { 
            token: localStorage.getItem('token'),
            focusToken: '',
            openInNewWindow: false
        };
    },
    clearData: function() {
        localStorage.removeItem('repos');
        localStorage.removeItem('last_refresh');
    },

    tokenFocus: function(e) {
        this.setState({focusToken: e.target.value});
    },
    tokenBlur: function(e) {
        if (this.state.token != this.state.focusToken) {
            localStorage.setItem('token', this.state.token);
            this.props.onChange();
        }
    },
    forceRefreshClick: function(e) {
        e.preventDefault();
        this.clearData();
        this.props.onChange();
    },

    render: function () {
        return (
            <div>
                <input 
                    name="token" 
                    type="text" 
                    valueLink={this.linkState('token')}
                    onFocus={this.tokenFocus}
                    onBlur={this.tokenBlur}
                    placeholder="Paste your GitHub Access Token here..."
                    />
                <p>Visit <a href="https://github.com/settings/tokens">Personal Access Tokens</a> to create a new token.
                You will need to give the token the following scopes: <strong>read:org, repo, user</strong>. This token is only stored locally.
                </p>
                <p className="force-refresh"><a href="#" onClick={this.forceRefreshClick}>Force Refresh Repository List</a></p>
            </div>
        );
    }
});

module.exports = Settings;
