var React     = require('react');
var Score     = require('../lib/score');
var Mousetrap = require('mousetrap');
var _         = require('underscore');

var Filter = React.createClass({
    getDefaultProps: function() {
        return {
            items:       [],          // List of items to operate on
            inputName:   'filter',    // Name of the input field
            placeholder: 'Search...', // Default text of the input field
            delay:       100,         // Minimum allowed result update rate (in milliseconds)
        };
    },
    propTypes: {
        items:         React.PropTypes.array,
        inputName:     React.PropTypes.string,
        placeholder:   React.PropTypes.string,
        delay:         React.PropTypes.number,
    },
    getInitialState: function() {
        return { 
            filtered:   [], // Subset of items that have been scored and filtered
            inputValue: '', // Current value of the input field
            focused: 0,     // Result row that has focus (reset to 0 when inputValue is updated)
        };
    },
    componentDidMount: function() {
        var filter = this;
        var moveUp = function(e, combo) {
            e.preventDefault();
            _.tap(filter.state.focused - 1, function(prev) {
                if (prev < 0) { return; }
                filter.setState({focused: prev});
            });
        };
        var moveDown = function(e, combo) {
            e.preventDefault();
            _.tap(filter.state.focused + 1, function(next) {
                if (next > filter.state.filtered.length) { return; }
                filter.setState({focused: next});
            });
        };
        var clearField = function(e, combo) {
            e.preventDefault();
            filter.setState({inputValue: ''});
            filter.updateResults();
        };
        var open = function(e, combo) {
            e.preventDefault();
            var item = filter.state.filtered[filter.state.focused];
            var resultItem = _.first(document.querySelectorAll('a[data-id="'+item.id+'"]'));
            if (!_.isUndefined(resultItem)) {
                // TODO: This probably won't work in every browser. Investigate and fix.
                var mouseEvent = document.createEvent("MouseEvents");
                mouseEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
                resultItem.dispatchEvent(mouseEvent);
            }
        };

        var inputField = _.first(document.getElementsByName(this.props.inputName));

        Mousetrap(inputField)
            .bind(['ctrl+p', 'up'], moveUp)
            .bind(['ctrl+n', 'down'], moveDown)
            .bind('ctrl+u', clearField)
            .bind(['enter', 'command+shift+enter', 'command+enter'], open);
    },
    onChange: function(e) {
        clearTimeout(this.timer);
        this.setState({focused: 0, inputValue: e.target.value});
        this.timer = setTimeout(this.updateResults, this.props.delay);
    },
    updateResults: function() {
        var items = this.props.items;
        var input = this.state.inputValue;
        var filtered = [];

        if (input.length > 0) {
            // Score and filter operation:
            // 1. Calculate the score of the input string against the name of the item, and wrap
            //    the results in an object that allows the next step to see the score.
            // 2. Sort the list of items based on their score. Reverse the list to get descending order.
            // 3. Filter out the items with a zero score.
            filtered = _.chain(items)
                .map(function(item) { 
                    item.score = Score(input, item.name);
                    return item;
                })
                .sortBy(function(o) { return o.score; }).reverse()
                .filter(function(o) { return o.score > 0; })
                .value();
        }

        this.setState({filtered: filtered});
    },
    render: function() {
        var filter = this;

        return (
            <div className="filter-component">
                <div className="filter-field">
                    <input
                        type="text"
                        onChange={this.onChange}
                        value={this.state.inputValue}
                        name={this.props.inputName}
                        placeholder={this.props.placeholder}
                        autoComplete="false"
                        autoCorrect="false"
                        autoCapitalize="false"
                        spellCheck="false" 
                        autoFocus="autofocus" 
                        />
                </div>
                <ul className="filter-results">
                    {this.state.filtered.map(function(v, i) {
                        return (
                            <li data-focused={(i === filter.state.focused) ? 1 : 0} data-score={v.score} key={v.id}>
                                <a data-id={v.id} href={v.url}>{v.name}</a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
});

module.exports = Filter;
