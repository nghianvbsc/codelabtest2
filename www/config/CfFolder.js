"use strict";

const mainApp = require('../../app');
const minify = require('express-minify');
const fs = require('fs');

module.exports = function (app) {
    app.use(minify());

    app.use('/template/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/template/'));
    app.use('/views/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/views/'));
    app.use('/share-image/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/share-image/'));
    app.use('/language/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/language/'));
    app.use('/notify/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/notify/'));
    app.use('/files/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/files/'));
    app.use('/.well-known/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/.well-known/'));
};