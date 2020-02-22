"use strict";
const XLSX = require('xlsx');
const XLSXStyle = require('xlsx-style');
const columKey = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const numberPattern = /\d+/g;
const wordPattern = /[A-Z]+/g;
const APP = require('../../app')
const TimeUtils = require('../utils/TimeUtils');
const NumberUtils = require('../utils/NumberUtils');
// let configs = [
//     {
//         name: 'STT',
//         key: 'index',
//         require: true,
//     },
//     {
//         name: 'STT trong DM',
//         key: 'indexMenu',
//         require: true,
//     },
//     {
//         name: 'Danh mục hàng hóa',
//         key: 'category',
//         require: true,
//     },
//     {
//         name: 'Tên thương mại dự thầu',
//         key: 'name',
//         require: true,
//     },
//     {
//         name: 'Quy cách đóng gói',
//         key: 'specifications',
//         require: true,
//     },
//     {
//         name: 'Đặc tính thông số kỹ thuật',
//         key: 'feature',
//         require: true,
//     },
//     {
//         name: 'Cở sở SX/ Xuất xứ',
//         key: 'origin',
//         require: true,
//     },
//     {
//         name: 'ĐVT',
//         key: 'unit',
//         require: true,
//     },
//     {
//         name: 'Số lượng',
//         key: 'count',
//         require: true,
//     },
//     {
//         name: 'Đơn giá (có VAT)',
//         key: 'price',
//         require: true,
//     },
//     {
//         name: 'Thành tiền (VND)',
//         key: 'total',
//         require: true,
//     },
// ];

exports.getData = function (configs, file) {
    let data = XLSX.readFile(file, {raw: true});
    let dataFile = {};
    for (let keySheet in data.Sheets) {
        let checkRowStart = false;
        let columKeySheet = columKey;
        let dataSheet = data.Sheets[keySheet];
        try {
            let countRow = Number(dataSheet['!ref'].split(':')[1].match(numberPattern)[0]);
            let objKey = [];
            let checkHaveKey = 0;
            let countKeyReuire = 0
            configs.forEach(config => {
                if (config.require) {
                    countKeyReuire++
                }
            })
            dataFile[keySheet] = [];
            if (columKey.includes(dataSheet['!ref'].split(':')[1].match(wordPattern)[1])) {
                columKeySheet = columKeySheet.slice(0, columKey.indexOf(dataSheet['!ref'].split(':')[1].match(wordPattern)[1]) + 1)
            }

            for (let i = 1; i <= countRow; i++) {
                if (!checkRowStart) {
                    objKey = [];
                    columKeySheet.forEach(column => {
                        if (dataSheet[`${column}${i}`]) {
                            let value = dataSheet[`${column}${i}`].v.toString().trim();
                            configs.forEach((config) => {
                                if (config.name.toString().trim().toLowerCase() == value.trim().toLowerCase()) {
                                    if (config.require) {
                                        checkHaveKey++;
                                    }
                                    objKey.push({
                                        column,
                                        key: config.key,
                                        require: config.require
                                    })
                                }
                            })
                        }
                    });
                    if (checkHaveKey == countKeyReuire) {
                        checkRowStart = true
                    }
                } else {
                    let countValue = 0;
                    let dataRow = {};
                    objKey.forEach(item => {
                        if (dataSheet[`${item.column}${i}`]) {
                            dataRow[item.key] = dataSheet[`${item.column}${i}`].v.toString().trim();
                            if (item.key == 'dateExpire' || item.key == 'endDate') {
                                if (dataRow[item.key] != '' && !dataRow[item.key].includes('-') && !dataRow[item.key].includes('.') && !dataRow[item.key].includes('/')) {
                                    dataRow[item.key] = dataRow[item.key].substr(6, 2) + '.' + dataRow[item.key].substr(4, 2) + '.' + dataRow[item.key].substr(0, 4)
                                }
                            }
                        }
                        if (item.require && dataSheet[`${item.column}${i}`]) {
                            countValue++;
                        }
                        if (!item.require && !dataSheet[`${item.column}${i}`]) {
                            dataRow[item.key] = ''
                        }
                    });
                    if (Number(countValue) == Number(countKeyReuire)) {
                        dataFile[keySheet].push(dataRow)
                    } else {
                        checkRowStart = false;
                    }
                }
            }
        } catch (e) {

        }

    }
    return dataFile
};

exports.getDataHoaDonExcel = function (listProducts, fullName, address, maSoThue) {
    let allTotalMoney = 0
    let allTaxMoney = 0
    let allTotalMoneyTax = 0
    listProducts.forEach(item => {
        allTotalMoney += item.totalMoney
        allTaxMoney += item.taxMoney
    })
    allTotalMoneyTax += allTotalMoney + allTaxMoney
    let data = XLSXStyle.readFile(`./files-mau/VSDT.xlsx`, {raw: true, cellStyles: true});
    let check = false
    let dataKey = {
        'B': 'index',
        'C': 'name',
        'E': 'stockName',
        'F': 'endDate',
        'G': 'specifications',
        'H': 'count',
        'I': 'price',
        'K': 'totalMoney',
        'L': 'taxPercent',
        'M': 'taxMoney',
        'N': 'totalMoneyTax'
    }
    for (let keySheet in data.Sheets) {
        if (!check) {
            let lengthData = (listProducts.length - 1) * 2
            let rowMax = Number(data.Sheets[keySheet]['!ref'].split(':')[1].substr(1))
            let listMerges = []
            data.Sheets[keySheet]['!merges'].forEach(item => {
                if (item.s.r > 22 || item.e.r > 22) {
                    item.s.r += lengthData
                    item.e.r += lengthData
                }
                if ((item.e.r <= 22) && (item.s.r >= 21)) {
                    for (let i = 1; i < listProducts.length; i++) {
                        listMerges.push({
                            s: {c: 2, r: item.s.r + i * 2},
                            e: {c: 3, r: item.e.r + i * 2}
                        })
                    }
                }
            })
            delete data.Sheets[keySheet]['M9'].s
            let time = TimeUtils.parseTimeFormat8(new Date().getTime())
            data.Sheets[keySheet]['M9'].t = 's'
            data.Sheets[keySheet]['M9'].v = time
            data.Sheets[keySheet]['M9'].w = time
            data.Sheets[keySheet]['M9'].h = time
            data.Sheets[keySheet]['M9'].r = `<t>${time}</t>`
            let stringMoney = NumberUtils.hienThiSoTienBangChu(allTotalMoneyTax)
            data.Sheets[keySheet]['C12'].v = fullName
            data.Sheets[keySheet]['C12'].w = fullName
            data.Sheets[keySheet]['C12'].h = fullName
            data.Sheets[keySheet]['C12'].r = `<t>${fullName}</t>`
            data.Sheets[keySheet]['C14'].v = address
            data.Sheets[keySheet]['C14'].w = address
            data.Sheets[keySheet]['C14'].h = address
            data.Sheets[keySheet]['C14'].r = `<t>${address}</t>`
            data.Sheets[keySheet]['F16'].v = maSoThue
            data.Sheets[keySheet]['F16'].w = maSoThue
            data.Sheets[keySheet]['F16'].h = maSoThue
            data.Sheets[keySheet]['F16'].r = `<t>${maSoThue}</t>`
            data.Sheets[keySheet]['D38'].v = stringMoney
            data.Sheets[keySheet]['D38'].w = stringMoney
            data.Sheets[keySheet]['D38'].h = stringMoney
            data.Sheets[keySheet]['D38'].r = `<t>${stringMoney}</t>`
            data.Sheets[keySheet]['K37'].v = allTotalMoney
            data.Sheets[keySheet]['K37'].w = allTotalMoney.toString()
            data.Sheets[keySheet]['M37'].v = allTaxMoney
            data.Sheets[keySheet]['M37'].w = allTaxMoney.toString()
            data.Sheets[keySheet]['N37'].v = allTotalMoneyTax
            data.Sheets[keySheet]['N37'].w = allTotalMoneyTax.toString()
            data.Sheets[keySheet]['!merges'] = data.Sheets[keySheet]['!merges'].concat(listMerges)
            let styles1 = {}
            let styles2 = {}
            let keyAplphas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q']
            for (let i = rowMax; i >= 24; i--) {
                keyAplphas.forEach(item => {
                    data.Sheets[keySheet][`${item}${i + lengthData}`] = data.Sheets[keySheet][`${item}${i}`]
                })
            }
            for (let i = 24 + lengthData - 1; i >= 24; i--) {
                keyAplphas.forEach(item => {
                    delete data.Sheets[keySheet][`${item}${i}`]
                })
            }
            keyAplphas.forEach(item => {
                if (data.Sheets[keySheet][`${item}22`]) {
                    styles1[item] = data.Sheets[keySheet][`${item}22`].s
                }
                styles2[item] = data.Sheets[keySheet][`${item}23`]
            })
            check = true;
            let start = 22
            listProducts.forEach((product, index) => {
                product.index = index + 1;
                for (let key of keyAplphas) {
                    if (styles1[key]) {
                        if (dataKey[key]) {
                            if (!data.Sheets[keySheet][`${key}${start}`]) {
                                data.Sheets[keySheet][`${key}${start}`] = {}
                            }
                            data.Sheets[keySheet][`${key}${start}`].s = styles1[key]
                            if (dataKey[key] == 'index' || dataKey[key] == 'count' || dataKey[key] == 'taxPercent' || dataKey[key] == 'price' || dataKey[key] == 'totalMoney' || dataKey[key] == 'taxMoney' || dataKey[key] == 'totalMoneyTax') {
                                data.Sheets[keySheet][`${key}${start}`].t = 'n'
                                data.Sheets[keySheet][`${key}${start}`].v = product[dataKey[key]] ? Number(product[dataKey[key]]) : null
                                data.Sheets[keySheet][`${key}${start}`].w = product[dataKey[key]] ? product[dataKey[key]].toString().trim() : ''
                            } else {
                                if (!product[dataKey[key]]) {
                                    product[dataKey[key]] = ''
                                }
                                data.Sheets[keySheet][`${key}${start}`].t = 's'
                                data.Sheets[keySheet][`${key}${start}`].v = product[dataKey[key]].toString().trim()
                                data.Sheets[keySheet][`${key}${start}`].r = `<t>${product[dataKey[key]].toString().trim()}</t>`
                                data.Sheets[keySheet][`${key}${start}`].h = product[dataKey[key]].toString().trim()
                                data.Sheets[keySheet][`${key}${start}`].w = product[dataKey[key]].toString().trim()
                            }
                        } else {
                            data.Sheets[keySheet][`${key}${start}`] = data.Sheets[keySheet][`${key}22`]
                        }
                    }
                }
                start++
                for (let key of keyAplphas) {
                    if (styles2[key]) {
                        data.Sheets[keySheet][`${key}${start}`] = styles2[key]
                    }
                }
                start++
            })
            data.Sheets[keySheet]['!ref'] = `A1:Q${rowMax + lengthData}`
        }
    }
    return data
};

exports.getDataPXKExcel = function (listProducts, fullName, address, codeKho) {
    let allTotalMoney = 0
    let allTaxMoney = 0
    let allTotalMoneyTax = 0
    listProducts.forEach(item => {
        allTotalMoney += item.totalMoney
        allTaxMoney += item.taxMoney
        item.codeKho = codeKho
    })
    allTotalMoneyTax += allTotalMoney + allTaxMoney
    fullName = `Đơn vị: ${fullName}`
    address = `Địa chỉ : ${address}`

    let data = XLSXStyle.readFile(`./files-mau/PXK_EX.xlsx`, {raw: true, cellStyles: true});
    let check = false
    let dataKey = {
        'A': 'index',
        'B': 'codeKho',
        'C': 'name',
        'D': 'unit',
        'E': 'specifications',
        'F': 'stockName',
        'G': 'endDate',
        'H': 'count',
        'I': 'origin',
        'K': 'price',
        'L': 'totalMoney',
    }
    for (let keySheet in data.Sheets) {
        if (!check) {
            let lengthData = (listProducts.length - 1)
            let rowMax = Number(data.Sheets[keySheet]['!ref'].split(':')[1].substr(1))
            let listMerges = []
            data.Sheets[keySheet]['!merges'].forEach(item => {
                if (item.s.r >= 14 || item.e.r >= 14) {
                    item.s.r += lengthData
                    item.e.r += lengthData
                }
            })
            let time = `Ngày ${TimeUtils.moment(new Date().getTime(), 'DD')} tháng ${TimeUtils.moment(new Date().getTime(), 'MM')} năm ${TimeUtils.moment(new Date().getTime(), 'YYYY')}`
            data.Sheets[keySheet]['A6'].t = 's'
            data.Sheets[keySheet]['A6'].v = time
            data.Sheets[keySheet]['A6'].w = time
            data.Sheets[keySheet]['A6'].h = time
            data.Sheets[keySheet]['A6'].r = `<t>${time}</t>`
            data.Sheets[keySheet]['A21'].t = 's'
            data.Sheets[keySheet]['A21'].v = time
            data.Sheets[keySheet]['A21'].w = time
            data.Sheets[keySheet]['A21'].h = time
            data.Sheets[keySheet]['A21'].r = `<t>${time}</t>`
            let stringMoney = NumberUtils.hienThiSoTienBangChu(allTotalMoneyTax)
            stringMoney = `Bằng chữ: ${stringMoney}`
            data.Sheets[keySheet]['A9'].v = fullName
            data.Sheets[keySheet]['A9'].w = fullName
            data.Sheets[keySheet]['A9'].h = fullName
            data.Sheets[keySheet]['A9'].r = `<t>${fullName}</t>`
            data.Sheets[keySheet]['A10'].v = address
            data.Sheets[keySheet]['A10'].w = address
            data.Sheets[keySheet]['A10'].h = address
            data.Sheets[keySheet]['A10'].r = `<t>${address}</t>`
            data.Sheets[keySheet]['C19'].v = stringMoney
            data.Sheets[keySheet]['C19'].w = stringMoney
            data.Sheets[keySheet]['C19'].h = stringMoney
            data.Sheets[keySheet]['C19'].r = `<t>${stringMoney}</t>`
            data.Sheets[keySheet]['L15'].v = allTotalMoney
            data.Sheets[keySheet]['L15'].w = allTotalMoney.toString()
            data.Sheets[keySheet]['L16'].v = allTaxMoney
            data.Sheets[keySheet]['L16'].w = allTaxMoney.toString()
            data.Sheets[keySheet]['L17'].v = allTotalMoneyTax
            data.Sheets[keySheet]['L17'].w = allTotalMoneyTax.toString()
            data.Sheets[keySheet]['!merges'] = data.Sheets[keySheet]['!merges'].concat(listMerges)
            let styles1 = {}
            let keyAplphas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
            for (let i = rowMax; i >= 15; i--) {
                keyAplphas.forEach(item => {
                    data.Sheets[keySheet][`${item}${i + lengthData}`] = data.Sheets[keySheet][`${item}${i}`]
                })
            }
            for (let i = 15 + lengthData - 1; i >= 15; i--) {
                keyAplphas.forEach(item => {
                    delete data.Sheets[keySheet][`${item}${i}`]
                })
            }
            keyAplphas.forEach(item => {
                if (data.Sheets[keySheet][`${item}14`]) {
                    styles1[item] = data.Sheets[keySheet][`${item}14`].s
                }
            })
            check = true;
            let start = 14
            listProducts.forEach((product, index) => {
                product.index = index + 1;
                for (let key of keyAplphas) {
                    if (styles1[key]) {
                        if (dataKey[key]) {
                            if (!data.Sheets[keySheet][`${key}${start}`]) {
                                data.Sheets[keySheet][`${key}${start}`] = {}
                            }
                            data.Sheets[keySheet][`${key}${start}`].s = styles1[key]
                            if (dataKey[key] == 'index' || dataKey[key] == 'count' || dataKey[key] == 'price' || dataKey[key] == 'totalMoney') {
                                data.Sheets[keySheet][`${key}${start}`].t = 'n'
                                data.Sheets[keySheet][`${key}${start}`].v = product[dataKey[key]] ? Number(product[dataKey[key]]) : null
                                data.Sheets[keySheet][`${key}${start}`].w = product[dataKey[key]] ? product[dataKey[key]].toString().trim() : ''
                            } else {
                                if (!product[dataKey[key]]) {
                                    product[dataKey[key]] = ''
                                }
                                data.Sheets[keySheet][`${key}${start}`].t = 's'
                                data.Sheets[keySheet][`${key}${start}`].v = product[dataKey[key]].toString().trim()
                                data.Sheets[keySheet][`${key}${start}`].r = `<t>${product[dataKey[key]].toString().trim()}</t>`
                                data.Sheets[keySheet][`${key}${start}`].h = product[dataKey[key]].toString().trim()
                                data.Sheets[keySheet][`${key}${start}`].w = product[dataKey[key]].toString().trim()
                            }
                        } else {
                            data.Sheets[keySheet][`${key}${start}`] = data.Sheets[keySheet][`${key}14`]
                        }
                    }
                }
                start++
            })
            data.Sheets[keySheet]['!ref'] = `A1:L${rowMax + lengthData}`
        }
    }
    return data
};

exports.getDataBBKNexcel = function (listProducts, fullName) {
    let allTotalMoney = 0
    let allTaxMoney = 0
    let allTotalMoneyTax = 0
    listProducts.forEach(item => {
        allTotalMoney += item.totalMoney
        allTaxMoney += item.taxMoney
    })
    allTotalMoneyTax += allTotalMoney + allTaxMoney
    let data = XLSXStyle.readFile(`./files-mau/BBKN_EX.xlsx`, {raw: true, cellStyles: true});
    let check = false
    let dataKey = {
        'A': 'index',
        'B': 'name',
        'C': 'unit',
        'D': 'specifications',
        'E': 'taxPrice',
        'F': 'count',
        'G': 'totalMoneyTax',
        'H': 'origin',
        'J': 'stockName',
        'K': 'endDate',
    }

    let time = `Hôm nay, vào hồi ${TimeUtils.moment(new Date().getTime(), 'H:m')} Ngày ${TimeUtils.moment(new Date().getTime(), 'DD')} tháng ${TimeUtils.moment(new Date().getTime(), 'MM')} năm ${TimeUtils.moment(new Date().getTime(), 'YYYY')}, tại khoa Giải Phẫu Bệnh - Bệnh viện Bạch Mai, các bên chúng tôi gồm:`
    fullName = `2. Bên nhận: ${fullName}`
    for (let keySheet in data.Sheets) {
        if (!check) {
            let lengthData = (listProducts.length - 1)
            let rowMax = Number(data.Sheets[keySheet]['!ref'].split(':')[1].substr(1))
            let listMerges = []
            data.Sheets[keySheet]['!merges'].forEach(item => {
                if (item.s.r >= 10 || item.e.r >= 10) {
                    item.s.r += lengthData
                    item.e.r += lengthData
                }
            })
            data.Sheets[keySheet]['A4'].v = time
            data.Sheets[keySheet]['A4'].w = time
            data.Sheets[keySheet]['A4'].h = time
            data.Sheets[keySheet]['A4'].r = `<t>${time}</t>`
            data.Sheets[keySheet]['A6'].v = fullName
            data.Sheets[keySheet]['A6'].w = fullName
            data.Sheets[keySheet]['A6'].h = fullName
            data.Sheets[keySheet]['A6'].r = `<t>${fullName}</t>`
            data.Sheets[keySheet]['G11'].v = allTotalMoneyTax
            data.Sheets[keySheet]['G11'].w = allTotalMoneyTax.toString()
            data.Sheets[keySheet]['!merges'] = data.Sheets[keySheet]['!merges'].concat(listMerges)
            let styles1 = {}
            let keyAplphas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
            for (let i = rowMax; i >= 11; i--) {
                keyAplphas.forEach(item => {
                    data.Sheets[keySheet][`${item}${i + lengthData}`] = data.Sheets[keySheet][`${item}${i}`]
                })
            }
            for (let i = 11 + lengthData - 1; i >= 11; i--) {
                keyAplphas.forEach(item => {
                    delete data.Sheets[keySheet][`${item}${i}`]
                })
            }
            keyAplphas.forEach(item => {
                if (data.Sheets[keySheet][`${item}10`]) {
                    styles1[item] = data.Sheets[keySheet][`${item}10`].s
                }
            })
            check = true;
            let start = 10
            listProducts.forEach((product, index) => {
                product.index = index + 1;
                for (let key of keyAplphas) {
                    // if (styles1[key]) {
                    if (dataKey[key]) {
                        if (!data.Sheets[keySheet][`${key}${start}`]) {
                            data.Sheets[keySheet][`${key}${start}`] = {}
                        }
                        data.Sheets[keySheet][`${key}${start}`].s = styles1[key]
                        if (dataKey[key] == 'index' || dataKey[key] == 'count' || dataKey[key] == 'taxPrice' || dataKey[key] == 'totalMoneyTax') {
                            data.Sheets[keySheet][`${key}${start}`].t = 'n'
                            data.Sheets[keySheet][`${key}${start}`].v = product[dataKey[key]] ? Number(product[dataKey[key]]) : null
                            data.Sheets[keySheet][`${key}${start}`].w = product[dataKey[key]] ? product[dataKey[key]].toString().trim() : ''
                        } else {
                            if (!product[dataKey[key]]) {
                                product[dataKey[key]] = ''
                            }
                            data.Sheets[keySheet][`${key}${start}`].t = 's'
                            data.Sheets[keySheet][`${key}${start}`].v = product[dataKey[key]].toString().trim()
                            data.Sheets[keySheet][`${key}${start}`].r = `<t>${product[dataKey[key]].toString().trim()}</t>`
                            data.Sheets[keySheet][`${key}${start}`].h = product[dataKey[key]].toString().trim()
                            data.Sheets[keySheet][`${key}${start}`].w = product[dataKey[key]].toString().trim()
                        }
                    } else {
                        data.Sheets[keySheet][`${key}${start}`] = data.Sheets[keySheet][`${key}10`]
                    }
                    // }
                }
                start++
            })
            data.Sheets[keySheet]['!ref'] = `A1:L${rowMax + lengthData}`
        }
    }
    return data
};