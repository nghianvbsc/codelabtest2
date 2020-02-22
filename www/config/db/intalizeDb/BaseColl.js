"use strict";

var DATABASE = require('./DbConnect');
var Schema = require('mongoose').Schema;
var random = require('mongoose-simple-random');

module.exports = function (dbName, dbOb) {
    dbOb.createAt = Number;
    dbOb.modifyAt = Number;
    let s = new Schema(dbOb);
    s.plugin(random);

    return DATABASE.model(dbName, s);
};