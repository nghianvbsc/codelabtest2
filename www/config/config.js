"use strict";

let viewConf = require('./CfView');
let folderConf = require('./CfFolder');
let sessionConf = require('./CfSession');
let requestConf = require('./CfRequest');
let socketConf = require('./CfSocket');
let cookieConf = require('./CfCookie');

module.exports = function (app, io) {
    cookieConf.register(app);
    let session = sessionConf.sessionConf(app);
    socketConf(session, io);
    viewConf(app);
    folderConf(app);
    requestConf(app);
};