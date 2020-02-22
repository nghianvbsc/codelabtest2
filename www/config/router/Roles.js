"use strict";
const CfRole = require('../CfRole');
const UserSession = require('../../session/UserSession');
const CfJws = require('../CfJws');

CfRole.role.all = -1;
CfRole.role.noAccount = -2;
CfRole.role.account = -3;

module.exports = {
    bin: CfRole,

    authorization: function (req, res, next) {
        let currentRole = [];

        for (let itemRole in this.bin.role) {
            if (res.bindingRole.config.auth.includes(this.bin.role[itemRole])) {
                currentRole.push(this.bin.role[itemRole]);
            }
        }

        let user;
        if (req.query.output && req.query.output === 'json') {
            let token = req.headers['access-token'];
            req.version = 'api';
            if (token) {
                if (currentRole.includes(-1) || currentRole.includes(-2)) {
                    CfJws.extraToken(token).then(function (rslCheckToken) {
                        if (rslCheckToken.error) {
                            continuE();
                        } else {
                            user = rslCheckToken.data;
                            continuE();
                        }
                    })
                } else {
                    CfJws.extraToken(token).then(function (rslCheckToken) {
                        if (rslCheckToken.error) {
                            return res.json({error: true, message: "Mã token đã hết hạn hoặc không hợp lệ"});
                        } else {
                            user = rslCheckToken.data;
                            continuE();
                        }
                    })
                }

            } else {
                if (currentRole.includes(-1) || currentRole.includes(-2)) {
                    CfJws.extraToken(token).then(function (rslCheckToken) {
                        if (rslCheckToken.error) {
                            continuE();
                        } else {
                            user = rslCheckToken.data;
                            continuE();
                        }
                    })
                } else {
                    return res.json({error: true, message: "Cần gửi tham số token hợp lệ"});
                }
            }
        } else {
            req.version = 'web';
            user = UserSession.getUser(req.session);
            continuE();
        }


        function continuE() {
            req.user = user;
            if (currentRole.includes(-1)) {
                next();
            } else if (currentRole.includes(-2)) {
                if (!user) {
                    next();
                } else {
                    if (res.bindingRole.config[req.method.toLowerCase()] == 'json') {
                        return res.json({error: true, message: "Vượt quền truy cập"});
                    } else {
                        res.redirect("/");
                    }
                }
            } else if (currentRole.includes(-3)) {
                if (user) {
                    next();
                } else {
                    if (res.bindingRole.config[req.method.toLowerCase()] == 'json') {
                        return res.json({error: true, message: "Vượt quền truy cập"});
                    } else {
                        res.redirect("/");
                    }
                }
            } else {
                if (!user) {
                    if (req.version == 'web') {
                        if (res.bindingRole.config[req.method.toLowerCase()] == 'json') {
                            return res.json({error: true, message: "Vượt quền truy cập"});
                        } else {
                            res.redirect("/");
                        }
                    } else {
                        return res.json({error: true, message: "Vượt quền truy cập"});
                    }

                } else {
                    if (currentRole.includes(user[CfRole.nameAttribute])) {
                        next();
                    } else {
                        if (res.bindingRole.config[req.method.toLowerCase()] == 'json') {
                            return res.json({error: true, message: "Vượt quền truy cập"});
                        } else {
                            res.redirect("/");
                        }
                    }
                }
            }
        }
    }
};