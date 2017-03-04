var URI = require('urijs');
var _   = require('underscore');

function GitHub(token) {

    function getAllPages(uri, token, cb) {
        var results = [];

        return (function recurse() {
            return fetch(uri, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': 'token '+token
                }
            }).then(function(resp) {
                results.push(resp.json());

                var next       = null;
                var linkHeader = resp.headers.get('link');
                var links      = linkHeader.split(/\s*,\s*/g);

                _.each(links, function(l) {
                    next = /rel="next"/.test(l) ? l : next;
                });

                if (next) {
                    next = (/<(.*)>/.exec(next) || [])[1];
                }
                if (!next) {
                    return results;
                } else {
                    uri = next;
                    return recurse();
                }

            }, function(){});
        })();
    }

    return {
        uri: new URI('https://api.github.com'),
        token: token,
        get: function(path) {
            return getAllPages(_.clone(this.uri).path(path).toString(), this.token);
        }
    };
};

module.exports = GitHub;
