"use strict";

const CfApp = require('./CfApp');
const _session_version = '1.1.0';
const _session_key = CfApp.protocol + CfApp.domainRelease + CfApp.webName + CfApp.hostProduct + +CfApp.db.host;
const session = require('express-session');

const redis = require("redis");
const redisStore = require('connect-redis')(session);
const client = redis.createClient();

exports.sessionConf = function (app) {
    let ses = session({
        secret: _session_key,
        store: new redisStore({host: 'localhost', port: 6379, client: client, ttl: 365 * 24 * 60 * 60}),
        saveUninitialized: false,
        resave: false,
        cookie: {secure: false, maxAge: 365 * 24 * 60 * 60 * 1000}
    });

    app.use(ses);

    return ses;
};

/**
 * @return {string}
 */
exports.getSessionKey = function GetSessionKey(mainKey) {
    return mainKey + '_' + _session_key + '_' + _session_version;
};