"use strict";

const ObjectId = require('mongoose').Types.ObjectId;
const promise = require('bluebird');
const stringUtils = require('../utils/StringUtils');
const utils = require('../utils/utils');
const BaseModel = require('../config/db/intalizeModel/BaseModel');

class Model extends BaseModel {

    constructor() {
        super(require('../database/UserCol'))
    }

    registerUser(obj) {
        const that = this;
        return new promise(async resolve => {
            obj.email = obj.email.toString().toLowerCase().trim();
            obj.password = stringUtils.md5(obj.password);
            obj.userName = obj.userName.toLowerCase();
            let countUserName = await that.countDataWhere({userName: obj.userName});
            if (countUserName > 0) {
                return resolve({error: true, message: 'Tên đăng nhập đã tồn tại!'})
            }
            let user = await that.insertData(obj);
            return resolve({error: false, user});
        })
    }

    updateUser(userId, obj) {
        const that = this;
        return new promise(async resolve => {

            if (obj.password) {
                obj.password = stringUtils.md5(obj.password);
            }

            if (obj.userName) {
                obj.userName = obj.userName.toLowerCase();

                let countUserName = await that.countDataWhere({userName: obj.userName, _id: {$ne: ObjectId(userId)}});
                if (countUserName > 0) {
                    return resolve({error: true, message: 'Tên đăng nhập đã tồn tại!'})
                }
            }
            await that.updateById(userId, obj);
            return resolve({error: false});
        })
    }

    signInAccount(userName, password) {
        const that = this;
        return new promise(async resolve => {
            let user = await that.getDataWhere({
                userName: userName.toLowerCase(),
                password: stringUtils.md5(password)
            }, that.FIND_ONE());
            if (utils.isEmptyObject(user)) return resolve({error: true, message: "Tài khoản không đúng"});
            delete user.password;
            return resolve({error: false, user});
        })
    }

    getUsersById(id) {
        const that = this;
        return new promise(async resolve => {
            let user = await that.getDataById(id);
            return resolve(user);
        })
    }

    getUsersInIds(ids) {
        const that = this;
        return new promise(async resolve => {
            if (!ids) ids = [];
            ids.forEach(id => {
                id = ObjectId(id);
            });
            let users = await that.getDataWhere({_id: {$in: ids}}, that.FIND_MANY());
            return resolve(users);
        })
    }

    getAllLogistic() {
        const that = this;
        return new promise(async resolve => {
            let users = await that.getDataWhere({type: 1}, that.FIND_MANY());
            return resolve(users);
        })
    }

    getUsersByEmail(email) {
        const that = this;
        return new promise(async resolve => {
            let user = await that.getDataWhere({email}, that.FIND_ONE());
            return resolve(user);
        })
    }

    getAllUsersByType(type) {
        const that = this;
        return new promise(async resolve => {
            let user = await that.getDataWhere({type: Number(type)}, that.FIND_MANY(), {createAt: -1});
            user.forEach(u => {
                delete u.password;
            })
            return resolve(user);
        })
    }

    getAllUsersByTypeAndWhere(type, where) {
        where.type = Number(type);
        const that = this;
        return new promise(async resolve => {
            let user = await that.getDataWhere(where, that.FIND_MANY(), {createAt: -1});
            return resolve(user);
        })
    }

    getAllUsersByCondition(condition) {
        const that = this;
        return new promise(async resolve => {
            let user = await that.getDataWhere(condition, that.FIND_MANY(), {createAt: -1});
            return resolve(user);
        })
    }

    getAllUsersByTypeAndCreate(userCreateId, type) {
        const that = this;
        return new promise(async resolve => {
            let user = await that.getDataWhere({userCreateId, type: Number(type)}, that.FIND_MANY(), {createAt: -1});
            return resolve(user);
        })
    }

    getOneUsersByType(type) {
        const that = this;
        return new promise(async resolve => {
            let user = await that.getDataWhere({type: Number(type)}, that.FIND_ONE());
            return resolve(user);
        })
    }

    lockUser(id) {
        const that = this;
        return new promise(async resolve => {
            await that.updateWhereClause({_id: ObjectId(id), type: {$ne: 0}}, {status: 2});
            return resolve();
        })
    }

    unlockUser(id) {
        const that = this;
        return new promise(async resolve => {
            await that.updateWhereClause({_id: ObjectId(id), type: {$ne: 0}}, {status: 1});
            return resolve();
        })
    }


    chekAccountSystem() {
        const that = this;
        return new promise(async resolve => {
            let admin = await that.getDataWhere({type: 0}, that.FIND_ONE());
            if (!admin) {
                that.insertData({fullName: 'Admin', userName: 'admin', password: stringUtils.md5('12345'), type: 0})
            }
            let thukho = await that.getDataWhere({type: 2}, that.FIND_ONE());
            if (!thukho) {
                that.insertData({fullName: 'Thủ kho', userName: 'thukho', password: stringUtils.md5('12345'), type: 2})
            }
            let ketoan = await that.getDataWhere({type: 3}, that.FIND_ONE());
            if (!ketoan) {
                that.insertData({fullName: 'Kế toán', userName: 'ketoan', password: stringUtils.md5('12345'), type: 3})
            }
            return resolve();
        })
    }

    addNotification(userId, io) {
        const that = this;
        return new promise(async resolve => {
            await that.updateById(userId, {$inc: {notifications: 1}})
            io.emit(userId, {type: 'new-notification'});

            return resolve();
        });
    }

    resetNotification(userId) {
        const that = this;
        return new promise(async resolve => {
            await that.updateById(userId, {notifications: 0});
            return resolve();
        });
    }

    thuKho() {
        const that = this;
        return new promise(async resolve => {
            return resolve(await that.getDataWhere({type: 2}, that.FIND_ONE()));
        });
    }
}

exports.MODEL = new Model();