"use strict";
const StringUtils = require("../../utils/StringUtils");
const FileUtils = require("../../utils/FileUtils");

let config = {
    dataType: {
        number: 1,
        string: 2,
        date: 3,
        file: 4,
        email: 5,
    },

    /**
     *
     * @param data [{key: '', type: 1, min: 1, max: 1, name: '', require: 'require', in: ['', '']}]
     */
    check: function (data, req) {
        let error = false,
            message = '';
        data.forEach((e) => {
            if (!e.type) {
                e.mL = this.dataType.string;
            }
            if (!e.require) {
                e.require = 'require'
            }

            switch (e.type) {
                case 1:
                    if (Number(e.value) != NaN) {
                        if (e.min) {
                            if (Number(e.value) < Number(e.min)) {
                                error = true;
                                message = `${e.name || 'Dữ liệu'} phải lớn hơn ${e.min}`
                            }
                        }

                        if (e.max) {
                            if (Number(e.value) > Number(e.max)) {
                                error = true;
                                message = `${e.name || 'Dữ liệu'} phải nhỏ hơn ${e.max}`
                            }
                        }

                        if (e.in) {
                            if (!e.in.includes(Number(e.value))) {
                                error = true;
                                message = `${e.name || 'Dữ liệu'} phải thuộc các giá trị ${e.in.join(", ")}`
                            }
                        }
                    } else {
                        if (e.require == 'require') {
                            error = true;
                            message = `${e.name || 'Dữ liệu'} không được rỗng`
                        }
                    }
                    break;
                case 2:
                    if (e.value) {
                        if (e.min) {
                            if (e.value.length < Number(e.min)) {
                                error = true;
                                message = `${e.name || 'Dữ liệu'} phải lớn hơn ${e.min} ký tự`
                            }
                        }

                        if (e.max) {
                            if (e.value.length > Number(e.max)) {
                                error = true;
                                message = `${e.name || 'Dữ liệu'} phải nhỏ hơn ${e.max} ký tự`
                            }
                        }

                        if (e.in) {
                            if (!e.in.includes(e.value)) {
                                error = true;
                                message = `${e.name || 'Dữ liệu'} phải thuộc các giá trị ${e.in.join(", ")}`
                            }
                        }
                    } else {
                        if (e.require == 'require') {
                            error = true;
                            message = `${e.name || 'Dữ liệu'} không được rỗng`
                        }
                    }
                    break;
                case 3:
                    if (e.value) {
                        if (Date.parse(e.value) == 0) {
                            error = true;
                            message = `${e.name || 'Dữ liệu'} không hợp lệ`
                        } else {
                            if (e.min) {
                                if (Date.parse(e.value) < Date.parse(e.min)) {
                                    error = true;
                                    message = `${e.name || 'Dữ liệu'} phải lớn hơn ${e.min}`
                                }
                            }

                            if (e.max) {
                                if (Date.parse(e.value) > Date.parse(e.max)) {
                                    error = true;
                                    message = `${e.name || 'Dữ liệu'} phải nhỏ hơn ${e.max}`
                                }
                            }

                            if (e.in) {
                                if (!e.in.includes(e.value)) {
                                    error = true;
                                    message = `${e.name || 'Dữ liệu'} phải thuộc các giá trị ${e.in.join(", ")}`
                                }
                            }
                        }
                    } else {
                        if (e.require == 'require') {
                            error = true;
                            message = `${e.name || 'Dữ liệu'} không được rỗng`
                        }
                    }
                    break;
                case 4:
                    if (req.files && req.files[e.key]) {
                        if (e.min) {
                            if (req.files[e.key].length < Number(e.min)) {
                                error = true;
                                message = `Phải gửi tối thiểu ${e.min} ${e.name || 'File'}`
                            }
                        }
                    } else {
                        if (e.require == 'require') {
                            error = true;
                            message = `Yêu cầu bắt buộc gửi file ${e.name || ''}`
                        }
                    }
                    break;
                case 5:
                    if (e.value) {
                        if (!StringUtils.validEmail(e.value)) {
                            error = true;
                            message = `${e.name || 'Email'} không hợp lệ`
                        }
                    } else {
                        if (e.require == 'require') {
                            error = true;
                            message = `${e.name || 'Dữ liệu'} không được rỗng`
                        }
                    }
                    break;
            }
        });

        return {error, message}
    }
};


module.exports = {
    dataType: config.dataType,
    run: function (req, res, next) {
        if (req.files) {
            let upload = {};
            for (let key in req.files) {
                upload[key] = [];
                req.files[key].forEach(f => {
                    upload[key].push({
                        path: `/${FileUtils.updatePath(f.path)}`,
                        name:f.originalname
                    })
                })
            }
            req.upload = upload;
        }

        if (res.bindingRole && res.bindingRole.config && res.bindingRole.config.validate) {
            let cpData = [];
            for (let inData in res.bindingRole.config.validate) {
                let validateConfig = res.bindingRole.config.validate[inData];
                if (!validateConfig.method) {
                    console.error("Bạn chưa cấu hình method cho validate tại đường dẫn: " + req.path)
                }
                try {
                    if (validateConfig.method.includes(req.method.toString().toLowerCase())) {
                        let validateData = req[inData];
                        validateConfig.validate.forEach((e, index) => {
                            validateConfig.validate[index].value = validateData[e.key];
                        });
                        cpData = cpData.concat(validateConfig.validate);
                    }
                } catch (e) {
                    console.error(e);
                }
            }
            if (cpData.length === 0) {
                next();
            } else {
                let check = config.check(cpData, req);
                if (check.error) {
                    return res.json({error: true, message: check.message})
                } else {
                    next();
                }
            }
        } else {
            next();
        }
    }
};