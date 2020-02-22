"use strict";
const multer = require('multer');
const stringUtils = require('../utils/StringUtils');
const fileUtils = require('../utils/FileUtils');
const BASE_DIR = require('../../app').BASE_DIR;

module.exports = function (arrayUpload) {
    let upload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                let mimetype = file.mimetype;
                let folder = 'files/' + mimetype.split("/")[0] + "s/";
                fileUtils.checkAndCreateFolder(BASE_DIR + "/" + folder, () => {
                    cb(null, folder);
                });
            },

            filename: function (req, file, cb) {
                let originalnameArr = file.originalname.split(".");
                let newFileName = `${stringUtils.md5(file.originalname + stringUtils.randomString() + new Date().getTime())}.${originalnameArr[originalnameArr.length - 1]}`;
                cb(null, newFileName);
            }
        })
    });

    let config = [];
    arrayUpload.forEach(a => {
        config.push({
            name: a.name,
            maxCount: a.maxCount,
        })
    });

    return upload.fields(arrayUpload);
};