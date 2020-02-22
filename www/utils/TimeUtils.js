"use strict";

let moment = require('moment-timezone');
let timeConf = require('../config/CfTime');

function setTimeZone(date) {
    return moment.tz(date, timeConf._default_tme_zone);
}

exports.getCurrentTime = function () {
    return setTimeZone(new Date()).format('Y-MM-DD H:m:sZ');
};

exports.parseFormat1 = function (oldTimeFormat) {
    return setTimeZone(oldTimeFormat).format('Y-MM-DD | H:m');
};

exports.parseFormat2 = function (oldTimeFormat) {
    return setTimeZone(oldTimeFormat).format('H:mm DD-MM-Y');
};

exports.parseFormat3 = function (oldTimeFormat) {
    return setTimeZone(oldTimeFormat).format('MM-DD-Y');
};

exports.parseTimeFormat4 = function (oldTimeFormat) {
    return setTimeZone(oldTimeFormat).format('HH:mm DD/MM/Y');
};

exports.parseTimeFormat5 = function (oldTimeFormat) {
    return setTimeZone(oldTimeFormat).format('DD/MM/Y');
};

exports.parseTimeFormat6 = function (oldTimeFormat) {
    return setTimeZone(oldTimeFormat).format('Y-MM-DD');
};

exports.parseTimeFormat7 = function (oldTimeFormat) {
    return setTimeZone(oldTimeFormat).format('DD.MM.YYYY');
};

exports.parseTimeFormat8 = function (oldTimeFormat) {
    return setTimeZone(oldTimeFormat).format('DD/MM/YYYY');
};

exports.moment = function (oldTimeFormat, format) {
    return setTimeZone(oldTimeFormat).format(format);
};

exports.parseTimeFormatOption = function (oldTimeFormat, format) {
    return setTimeZone(oldTimeFormat).format(format);
};

exports.convertDateStringToNumber = function (string) {
    let dateExpire = new Date();
    dateExpire.setFullYear(Number(string.split('.')[2]));
    dateExpire.setMonth(Number(string.split('.')[1]));
    dateExpire.setDate(Number(string.split('.')[0]));

    dateExpire.setHours(0, 0, 0, 0);
    return dateExpire.getTime();
};
exports.bidRemaining = function (countDownDate) {
    var now = new Date().getTime();

    var distance = countDownDate - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // Display the result in the element with id="demo"
    return days + " ngày " + hours + " giờ " + minutes + " phút " + seconds + " giây "
}


/**
 * compare time
 * if time1 > time2: return 1
 * if time1 < time2: return 2
 * if time1 = time2: return 0
 * @param time1
 * @param time2
 * @returns {number}
 */
exports.compareTwoTime = function (time1, time2) {
    let a = (new Date(time1)).getTime();
    let b = (new Date(time2)).getTime();
    if (a > b) {
        return 1;
    } else if (b > a) {
        return 2;
    } else {
        return 0;
    }
};

exports.getTimeBetween = function (time1, time2) {
    let a = (new Date(time1)).getTime();
    let b = (new Date(time2)).getTime();
    return (a - b) / (1000);
};

exports.addMinuteToDate = function (dateAdded, minute) {
    return new Date((new Date(dateAdded)).getTime() + minute * 60000);
};

exports.subMinuteToDate = function (subAdded, minute) {
    return new Date((new Date(subAdded)).getTime() - minute * 60000);
};