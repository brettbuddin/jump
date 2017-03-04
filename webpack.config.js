var path    = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname + "/app",
    entry: {
        javascript: "./entry.js",
        html: "./assets/index.html",
    },
    devtool: 'source-map',
    output: {
        path: __dirname + "/build",
        filename: "javascripts/app.js",
    },
    module: {
        loaders: [
            { 
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ['react']
                }
            },
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]",
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ]
}
