"use strict";

const hostProduct = require('./CfMode').hostProduct;
const databaseProduct = require('./CfMode').databaseProduct;

let config = {
    protocol: 'http',
    domainRelease: 'example.com',
    webName: 'Example',
    hostProduct: '',
    postProduct: '80',

    hostDev: 'localhost',
    postDev: '5000',

    dbProduct: {
        name: '',
        user: '',
        password: '',
        host: '',
        port: '27017'
    },

    dbDev: {
        name: 'phongontinh',
        user: '',
        password: '',
        host: 'localhost',
        port: '27017'
    },

};
module.exports = {
    ...config,
    host: (!hostProduct) ? config.hostDev : config.hostProduct,
    post: (!hostProduct) ? config.postDev : config.postProduct,
    domain: (!hostProduct) ? 'http://' + config.hostDev + ':' + config.postDev : config.protocol + "://" + config.domainRelease,
    db: databaseProduct ? config.dbProduct : config.dbDev
};