"use strict";

const crypto = require('crypto');
const md5 = require('md5');

exports.md5 = function (value) {
    return md5(value);
};

exports.sha1 = function (value) {
    return crypto.createHash('sha1').update(JSON.stringify(value)).digest('hex');
};

exports.randomString = function () {
    return crypto.randomBytes(64).toString('hex');
};

exports.randomStringFixLength = function (count) {

    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    for (let i = 0; i < count; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

exports.randomStringFixLengthOnlyAlphabet = function (count) {

    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < count; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

exports.randomStringNumber = function (count) {

    let text = "";
    let possible = "0123456789";
    for (let i = 0; i < count; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};


exports.getBytes = function (string) {
    string = (string == null) ? "" : string;
    return Buffer.byteLength(string, 'utf8')
};

exports.encode = function (text) {
    text = (text == null) ? "" : text;
    return new Buffer(text + '').toString('base64')
};

exports.decode = function (text) {
    text = (text == null) ? "" : text;
    return new Buffer(text + '', 'base64').toString('ascii');
};

exports.replaceAll = function (str, find, replace) {
    while (str.indexOf(find) > -1) {
        str = str.replace(find, replace);
    }
    return str;
};

exports.validURL = function (str) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(str);
};

exports.validUserName = function (userName) {
    var usernameRegex = /^[a-zA-Z0-9]+$/;
    var validUsername = userName.match(usernameRegex);
    return validUsername != null
};

exports.validEmail = function (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

exports.validPhone = function (phone) {
    var re = /^(\+84|0)+(3|6|8)+([0-9]{8})\b$/;
    return re.test(phone);
};


exports.removeUtf8 = function (str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    // str = str.replace(/\W+/g, ' ');
    str = str.replace(/\s/g, '-');
    str = str.replace(/[^a-zA-Z0-9]/g, '_');

    let max = 10;
    for (let index = max; index >= 0; index--) {
        let inc_ = "";
        for (let index2 = 0; index2 <= index; index2++) {
            inc_ += "_";
        }
        str = str.replace(inc_, '_');
    }
    return str;
};
exports.slugLink = function (str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    // str = str.replace(/\W+/g, ' ');
    str = str.replace(/\s/g, '-');
    str = str.replace(/[^a-zA-Z0-9]/g, '-');

    let max = 10;
    for (let index = max; index >= 0; index--) {
        let inc_ = "";
        for (let index2 = 0; index2 <= index; index2++) {
            inc_ += "-";
        }
        str = str.replace(inc_, '-');
    }
    return str;
};

exports.setStyleDate = function (date){
    // Date (DD/MM/YYYY)
    var inc = date.split('/');
    var str=inc[1]+"/"+inc[0]+"/"+inc[2];
    return str;
};

exports.listCharacter = function () {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
};


exports.createMaDonHang = function (index) {
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'DH-' + index.substring(leftLength, index.length);
}

exports.createMaVayDonHang = function (index) {
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'VA.DH-' + index.substring(leftLength, index.length);
}

exports.createMaNhapHang = function (index) {
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'NH-' + index.substring(leftLength, index.length);
}

exports.createMaHoaDon = function (type, index, indexHoaDon = 0) {
    type = type == 1 ? 'GS' : 'VC'
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'HD.' + type + '-' + indexHoaDon + '' + index.substring(leftLength, index.length);
}

exports.createMaVanChuyen = function (index) {
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'VC-' + index.substring(leftLength, index.length);
}

exports.createMaGiamSat = function (index) {
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'GS-' + index.substring(leftLength, index.length);
}

exports.createMaXuatKho = function (index) {
    if (!index) index = 1;
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'XK-' + index.substring(leftLength, index.length);
}

exports.createIndexXuatKho = function(index) {
    if (!index) index = 1;
    index = '000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return index.substring(leftLength, index.length);
}