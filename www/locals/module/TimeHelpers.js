"use strict";

const timeUtils = require('../../utils/TimeUtils');

module.exports = function (app) {
    app.locals.convertDateShow1 = function (date) {
        return timeUtils.parseTimeFormat4(date);
    };

    app.locals.convertDateShow2 = function (date) {
        return timeUtils.parseTimeFormat5(date);
    };

    app.locals.convertDateShow3 = function (date, format) {
        return timeUtils.parseTimeFormatOption(date, format);
    }

    app.locals.convertDateShow4 = function (date) {
        return timeUtils.parseTimeFormat6(date);
    };

    app.locals.moment = function (date, format) {
        return timeUtils.moment(date, format);
    };

    app.locals.currentDate = function () {
        let d = new Date();
        let month = d.getMonth() + 1;
        if (month < 10) month = `0${month}`;
        let date = d.getDate();
        if (date < 10) date = `0${date}`;

        return `${date}/${month}/${d.getFullYear()}`
    };

    app.locals.currentDateAdded = function (add) {
        let d = new Date();
        d.setDate(d.getDate() + add);
        let month = d.getMonth() + 1;
        if (month < 10) month = `0${month}`;
        let date = d.getDate();
        if (date < 10) date = `0${date}`;

        return `${date}/${month}/${d.getFullYear()}`
    };
};