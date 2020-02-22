"use strict";
let express = require('express');
const UserSession = require('../../session/UserSession');
const Cache = require('../CfCache');
const CfUpload = require('../CfUpload');
const CfApp = require('../CfApp');
const cfSocialLogin = require('../CfSocialLogin');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../../models/UserModel').MODEL;
const {dataType} = require('./Validate');
const Validate = require('./Validate').run;
const {bin} = require('./Roles');

class ChildRouter {

    constructor(basePath) {
        this.basePath = basePath;
        this.dataType = dataType;
        this.roles = bin.role;
        this.root = this;
        this.registerRouting;
    }

    static responseError(msg, res, data) {
        return res.json({error: true, message: msg, data: data});
    }

    static response(res, data) {
        return res.json(data);
    }

    static responseSuccess(msg, res, data) {
        return res.json({error: false, message: msg, data: data});
    }

    static async renderToView(req, res, data, title) {
        if (!data) {
            data = {};
        }

        if (title) {
            res.bindingRole.config.title = title;
        }
        data.render = res.bindingRole.config;
        data.language = req.language || "vi";
        data.url = `${CfApp.protocol}://${req.get('host')}${req.originalUrl}`;

        data.cacheVersion = Cache.version;
        data.baseUrl = `${CfApp.protocol}://${req.get('host')}`;
        data.webName = CfApp.webName;
        data.userLogin = null;
        data.version = req.version;
        if (UserSession.getUser(req.session) != null) {
            data.userLogin = UserSession.getUser(req.session);
        }
        return res.render(res.bindingRole.config.view, data);

    }

    static async renderOrResponse(req, res, data, title, success=true, message) {
        if (!data) {
            data = {};
        }

        if (res.bindingRole.methods[req.method.toLowerCase()] === 'json' || (req.query.output && req.query.output === 'json')) {
            return res.json({error: !success, message: message, data: data});
        } else {
            if (title) {
                res.bindingRole.config.title = title;
            }
            data.render = res.bindingRole.config;
            data.language = req.language || "vi";
            data.url = `${CfApp.protocol}://${req.get('host')}${req.originalUrl}`;

            data.cacheVersion = Cache.version;
            data.baseUrl = `${CfApp.protocol}://${req.get('host')}`;
            data.webName = CfApp.webName;
            data.userLogin = null;
            if (UserSession.getUser(req.session) != null) {
                data.userLogin = UserSession.getUser(req.session);
            }
            return res.render(res.bindingRole.config.view, data);
        }
    }

    static redirect(res, path) {
        return res.redirect(path);
    }

    registerRouting(io) {

    }

    exportModule(io, app) {
        let router = express.Router();
        app.use((req, res, next) => {
            req.roles = this.roles;
            next();
        });

        for (let basePath in this.registerRouting(io)) {
            let item = this.registerRouting(io)[basePath];

            if (typeof item.methods.post !== 'undefined' && item.methods.post !== null) {
                if (item.config.upload) {
                    if (item.methods.post.length === 1) {
                        router.post(basePath, CfUpload(item.config.upload), Validate);
                        router.post(basePath, item.methods.post[0]);
                    } else if (item.methods.post.length === 2) {
                        router.post(basePath, CfUpload(item.config.upload), Validate);
                        router.post(basePath, item.methods.post[0], item.methods.post[1]);
                    }
                } else {
                    if (item.methods.post.length === 1) {
                        router.post(basePath, Validate);
                        router.post(basePath, item.methods.post[0]);
                    } else if (item.methods.post.length === 2) {
                        router.post(basePath, Validate);
                        router.post(basePath, item.methods.post[0], item.methods.post[1]);
                    }
                }

            }

            if (typeof item.methods.get !== 'undefined' && item.methods.get !== null) {
                if (item.methods.get.length === 1) {
                    router.get(basePath, Validate);
                    router.get(basePath, item.methods.get[0]);
                } else if (item.methods.get.length === 2) {
                    router.get(basePath, Validate);
                    router.get(basePath, item.methods.get[0], item.methods.get[1]);
                }
            }
        }

        if (cfSocialLogin.google.clientID != '' || cfSocialLogin.facebook.clientID != '') {
            app.use(passport.initialize());
            app.use(passport.session());

            passport.serializeUser(function (user, done) {
                done(null, user);
            });

            passport.deserializeUser(function (id, done) {
                UserModel.getUsersById(id).then(function (user) {
                    done(null, user);
                })
            });


            if (cfSocialLogin.google.clientID != '') {
                passport.use(
                    new GoogleStrategy(
                        {
                            clientID: cfSocialLogin.google.clientID,
                            clientSecret: cfSocialLogin.google.clientSecret,
                            callbackURL: cfSocialLogin.google.callbackURL,
                        }, function (token, refreshToken, profile, done) {
                            cfSocialLogin.google.processHandle(token, refreshToken, profile, done);
                        })
                );

                router.get(cfSocialLogin.google.loginUrl, passport.authenticate('google', {
                    scope: cfSocialLogin.google.scope
                }));

                router.get(cfSocialLogin.google.callbackURL, function (req, res, next) {
                    passport.authenticate('google', {failureRedirect: '/'},
                        async function (err, user) {
                            cfSocialLogin.google.doneHandle(err, user, req, res, next);
                        })(req, res, next);
                });
            }

            if (cfSocialLogin.facebook.clientID != '') {
                passport.use('facebook', new FacebookStrategy({
                        clientID: cfSocialLogin.facebook.clientID,
                        clientSecret: cfSocialLogin.facebook.clientSecret,
                        callbackURL: CfApp.domain + cfSocialLogin.facebook.callbackURL,
                        profileFields: cfSocialLogin.facebook.scope,
                    },

                    function (token, refreshToken, profile, done) {
                        process.nextTick(function () {
                            cfSocialLogin.facebook.processHandle(token, refreshToken, profile, done);
                        })
                    }));

                router.get(cfSocialLogin.facebook.callbackURL, function (req, res, next) {
                    passport.authenticate("facebook", {
                        session: false,
                        scope: cfSocialLogin.facebook.scope
                    }, function (err, user) {
                        cfSocialLogin.facebook.doneHandle(err, user, req, res, next);
                    })(req, res, next);
                });
            }
        }
        return router;
    }
}

module.exports = ChildRouter;