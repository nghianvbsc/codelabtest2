"use strict";

let mailer = require("nodemailer");
let cfMailer = require('../config/CfMailer');
let {webName} = require('../config/CfApp');

module.exports = function (to, subject, content, attachments = [], callback) {
    let smtpTransport = mailer.createTransport({
        service: cfMailer.service,
        auth: {
            user: cfMailer.email,
            pass: cfMailer.password,
        }
    });

    let mail = {
        from: webName,
        to: to,
        subject: subject,
        html: content,
        attachments:attachments,
    };

    smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
            if (callback == null || typeof callback == "undefined") {
            } else {
                callback({error: true, message: "send mail error!"});
            }
        } else {
            if (callback == null || typeof callback == "undefined") {
            } else {
                callback({error: false, message: "send mail success!"});
            }
        }
        smtpTransport.close();
    });
};