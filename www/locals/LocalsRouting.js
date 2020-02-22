"use strict";

const timeHelper = require('./module/TimeHelpers');
const numberHelper = require('./module/NumberHelpers');
const string = require('./module/String');

module.exports = function (app) {
    timeHelper(app);
    numberHelper(app);
    string(app);
};