"use strict";

const ChildRouter = require('../config/router/ChildRouting');

module.exports = class Auth extends ChildRouter {

    constructor() {
        super('/');
    }

    registerRouting(io) {
        return {
            '/': {
                config: {
                    auth: [this.roles.all],
                    view: 'pages/dang-nhap.ejs',
                    title: 'Đăng nhập',
                    get: 'view',
                    post: 'json',
                    validate: {
                        body: {
                            method: ['post'],
                            validate: [
                                {key: 'userName', type: this.dataType.string, name: 'Tên đăng nhập', min: 5, max: 200},
                                {key: 'password', type: this.dataType.string, name: 'Mật khẩu', min: 5, max: 50},
                            ]
                        },
                    },
                },

                methods: {
                    get: [async function (req, res) {
                        return ChildRouter.renderOrResponse(req, res);
                    }],

                    post: [async function (req, res) {

                    }]
                },
            },

        }
    }
};
