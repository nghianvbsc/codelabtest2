"use strict";

const authorization = require('./Authorization');

const routing = {
    mainHandel: function (app, io) {
        app.use(authorization.checkAuthorization);

        authorization.initAuths.forEach(function (itemAuth) {
            app.use(new itemAuth().basePath, new itemAuth().exportModule(io, app));
        });

        app.get("/404.html", function (req, res) {
            routing.pageNotFound(req, res);
        });


        app.post("/404.html", function (req, res) {
            routing.pageNotFound(req, res);
        });

        app.use("*", function (req, res) {
            routing.pageNotFound(req, res);
        });


    },

    pageNotFoundView: function (res) {
        return res.render("pages/404.ejs");
    },

    pageNotFoundJson: function (res) {
        return res.json({error: true, message: "Địa chỉ yêu cầu không hợp lệ"});
    },

    pageNotFound: function (req, res) {
        if (req.method == "POST") {
            routing.pageNotFoundJson(res);
        } else {
            routing.pageNotFoundView(res);
        }
    }
};

module.exports = routing;