"use strict";

const stringUtils = require('../../utils/StringUtils');
const NumberUtils = require('../../utils/NumberUtils');

module.exports = function (app) {

    app.locals.randomString = function () {
        return `${stringUtils.randomStringFixLengthOnlyAlphabet(5)}`;
    };
    app.locals.slugLink = function (str) {
        return `${stringUtils.slugLink(str)}`
    };
    app.locals.createMaDonHang = function (index) {
        index = '0000000000000000000000' + index;
        let maxLength = 5;
        let leftLength = index.length - maxLength;
        return 'DH-' + index.substring(leftLength, index.length);
    }

    app.locals.createMaVayDonHang = function (index) {
        index = '0000000000000000000000' + index;
        let maxLength = 5;
        let leftLength = index.length - maxLength;
        return 'VA.DH-' + index.substring(leftLength, index.length);
    }

    app.locals.createMaNhapHang = function (index) {
        index = '0000000000000000000000' + index;
        let maxLength = 5;
        let leftLength = index.length - maxLength;
        return 'NH-' + index.substring(leftLength, index.length);
    }

    app.locals.createMaHoaDon = function (type, index, indexHoaDon = 0) {
        type = type == 1 ? 'GS' : 'VC'
        index = '0000000000000000000000' + index;
        let maxLength = 5;
        let leftLength = index.length - maxLength;
        return 'HD.' + type + '-' + indexHoaDon + '' + index.substring(leftLength, index.length);
    }

    app.locals.createMaVanChuyen = function (index) {
        index = '0000000000000000000000' + index;
        let maxLength = 5;
        let leftLength = index.length - maxLength;
        return 'VC-' + index.substring(leftLength, index.length);
    }

    app.locals.createMaGiamSat = function (index) {
        index = '0000000000000000000000' + index;
        let maxLength = 5;
        let leftLength = index.length - maxLength;
        return 'GS-' + index.substring(leftLength, index.length);
    }

    app.locals.createMaXuatKho = function (index) {
        if (!index) index = 1;
        index = '0000000000000000000000' + index;
        let maxLength = 5;
        let leftLength = index.length - maxLength;
        return 'XK-' + index.substring(leftLength, index.length);
    }

    app.locals.createIndexXuatKho = function(index) {
        if (!index) index = 1;
        index = '000000' + index;
        let maxLength = 5;
        let leftLength = index.length - maxLength;
        return index.substring(leftLength, index.length);
    }

    app.locals.formatDateInput = function (input) {
        if (input && input.trim() != '') {
            if (input.includes('/')) {
                let val = input.split("/");
                return `${val[2]}${val[1]}${val[0]}`;
            } else if (input.includes('.')) {
                let val = input.split(".");
                return `${val[2]}${val[1]}${val[0]}`;
            } else if (input.includes('-')){
                let val = input.split(".");
                return `${val[2]}${val[1]}${val[0]}`;
            } else {
                return input
            }
        } else {
            return input;
        }
    }

    app.locals.hienThiSoTienBangChu = function (price) {
        let first = Math.round(Number(price)) + "";

        let firstFormat = NumberUtils.baseFormatNumber(first);
        let firstArr = firstFormat.split(".");
        let config3Name = {
            0: 'đồng',
            1: 'nghìn',
            2: 'triệu',
            3: 'tỉ',
        };

        let configText = {
            0: 'không',
            1: 'một',
            2: 'hai',
            3: 'ba',
            4: 'bốn',
            5: 'năm',
            6: 'sáu',
            7: 'bảy',
            8: 'tám',
            9: 'chín',
        };

        let nameTextArr = [];

        let indexName = 0;
        for (let i = firstArr.length - 1; i >= 0; i--) {
            let nameText = '';
            let boSoThu3 = false;
            let boSoThu2 = false;
            let indexCount = 0;
            for (let i2 = firstArr[i].length - 1; i2 >= 0; i2--) {
                nameText = nameText.trim();
                switch (indexCount) {
                    case 0:
                        if (firstArr[i][i2] == '0') {
                            if (!firstArr[i][i2 - 1] || firstArr[i][i2 - 1] == '0' || firstArr[i][i2 - 1] == '1') {

                            } else {

                            }
                            boSoThu3 = true;
                        } else if (firstArr[i][i2] == '5') {
                            if (!firstArr[i][i2 - 1] || firstArr[i][i2 - 1] == '0') {
                                nameText = 'năm' + nameText;
                            } else {
                                nameText = 'lăm' + nameText;
                            }

                            boSoThu3 = false;
                        } else if (firstArr[i][i2] == '1') {
                            if (!firstArr[i][i2 - 1] || firstArr[i][i2 - 1] == '1' || firstArr[i][i2 - 1] == '0') {
                                nameText = 'một' + nameText;
                            } else {
                                nameText = 'mốt' + nameText;
                            }

                            boSoThu3 = false;
                        } else {
                            nameText = configText[firstArr[i][i2]] + nameText;
                            boSoThu3 = false;
                        }
                        break;
                    case 1:
                        if (firstArr[i][i2] == '0') {
                            if (boSoThu3) {

                            } else {
                                nameText = 'lẻ ' + nameText;
                            }
                            boSoThu2 = true;
                        } else if (firstArr[i][i2] == '1') {
                            if (boSoThu3) {
                                nameText = 'mười ' + nameText
                            } else {
                                if (firstArr[i][i2 - 1]) {
                                    nameText = 'mười ' + nameText
                                } else {
                                    nameText = 'mười ' + nameText
                                }
                            }
                        } else {
                            nameText = configText[firstArr[i][i2]] + ' mươi ' + nameText
                        }

                        break;
                    case 2:
                        nameText = configText[firstArr[i][i2]] + ' trăm ' + nameText;
                        break;
                }
                indexCount++;
                nameText = nameText.trim();
            }

            nameText = nameText + ' ' + config3Name[indexName];
            nameText = nameText.trim();
            nameTextArr.push(nameText);
            indexName++;
        }

        let newArr = [];
        for (let i = nameTextArr.length - 1; i >= 0; i--) {
            newArr.push(nameTextArr[i]);
        }
        let x = newArr.join(", ");
        return x.charAt(0).toUpperCase() + x.slice(1);

    }

};