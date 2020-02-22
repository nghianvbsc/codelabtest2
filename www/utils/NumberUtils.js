"use strict";

const utils = require('./utils');

exports.priceFormat = function (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
};

exports.baseFormatNumber = function (number, fixLength) {
    return utils.currencyFormat(number, fixLength);
};

exports.randomStartEnd = function (start, end) {
    return Math.floor((Math.random() * end) + start);

};

exports.hienThiSoTienBangChu = function (price) {
    let first = Math.round(Number(price)) + "";

    let firstFormat = first.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
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
    return x.charAt(0).toUpperCase() + x.slice(1)+ ' chẵn';
}