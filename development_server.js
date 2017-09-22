/* eslint-disable no-console */

var http = require('http');
var gaze = require('gaze');
var ecstatic = require('ecstatic');
var colors = require('colors/safe');

var isDevelopment = process.argv[2] === 'develop';

var buildData = require('./build_data')(isDevelopment);
var buildSrc = require('./build_src')(isDevelopment);
var buildCSS = require('./build_css')(isDevelopment);

buildData();
buildSrc();
buildCSS();

if (isDevelopment) {
    gaze(['css/**/*.css'], function(err, watcher) {
        watcher.on('all', function() {
            buildCSS();
        });
    });

    gaze(['data/**/*.{js,json}'], function(err, watcher) {
        watcher.on('all', function() {
            buildData();
        });
    });

    gaze(['modules/**/*.js'], function(err, watcher) {
        watcher.on('all', function() {
            buildSrc();
        });
    });

    http.createServer(
        ecstatic({ root: __dirname, cache: 0 })
    ).listen(8080);

    console.log(colors.red('Listening on :8080'));
}