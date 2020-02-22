"use strict";

const webName = require('./CfApp').webName;
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

module.exports = {
    extraToken: function (token) {
        return new Promise(resolve => {
            jwt.verify(token, webName, function (err, decoded) {
                if (err) {
                    resolve({error: true, message: 'Failed to authenticate token.'});
                } else {
                    resolve({error: false, data: decoded});

                }
            });
        })
    },
    createToken: function (data) {
        return jwt.sign(data, webName, {expiresIn: '219000h'});
    }
};