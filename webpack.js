'use strict';
const Path = require('path');


module.exports = {
    entry: Path.join(__dirname, './client'),
    resolve: {
        extensions: ['.js', '.jsx']
    },
    output: {
        path: Path.resolve(__dirname),
        filename: './assets/client'
    },
    module: {
        rules: [{
            test: /\.jsx$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                cacheDirectory: true,
                presets: ['react', 'env']
            }
        }]
    }
};
