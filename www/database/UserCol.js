"use strict";

const BASE_COLL = require('../config/db/intalizeDb/BaseColl');
module.exports = BASE_COLL("users", {
    fullName: String,
    userName: String,
    email: {type: String, default: ''},
    address: {type: String, default: ''},
    password: String,
    phone: {type: String, default: ''},
    picture: String,
    birthday: Number,
    status: {type: Number, default: 1}, // 1 active || 2 block
    type: Number, // 0: super Admin || 1 : Logistic || 2 : Thu kho || 3 : Ke toan || 4 kế toán kho || 5 : Van chuyen || 6: nguoi dung Admin || 7 : nguoi dung thuong
});