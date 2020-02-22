"use strict";
var FCM = require('fcm-push');
var serverKey = 'AAAAsg8hj4U:APA91bFxStj3TI6u8o7IU2Bn_YHQGi883P3pBs_wzFK1kf6-eR0IWY1RLkDpWqgsbXsvJokFOrHmrK19SPSlNTXjVc3ZpnXgDHOEfHZSH7pq7jZRQe_SkojPtpZuQCvFOEunnEEeNyM1'; //put your server key here
var fcm = new FCM(serverKey);
const FcmTokensModal = require("../models/FcmTokensModal");
const NotificationModel = require("../models/NotificationModel");
const UserModel = require("../models/UserModel");
const ProducExportModel = require("../models/ProducExportModel");
const TransportBillModel = require("../models/TransportBillModel");
const ContractModel = require("../models/ContractModel");
const BillModel = require("../models/BillModel");


function createMaDonHang(index) {
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'DH-' + index.substring(leftLength, index.length);
}

function createMaVayDonHang(index) {
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'VA.DH-' + index.substring(leftLength, index.length);
}

function createMaNhapHang(index) {
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'NH-' + index.substring(leftLength, index.length);
}

function createMaHoaDon(type, index, indexHoaDon = 0) {
    type = type == 1 ? 'GS' : 'VC'
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'HD.' + type + '-' + indexHoaDon + '' + index.substring(leftLength, index.length);
}

function createMaVanChuyen(index) {
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'VC-' + index.substring(leftLength, index.length);
}

function createMaGiamSat(index) {
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'GS-' + index.substring(leftLength, index.length);
}

function createMaXuatKho(index) {
    if (!index) index = 1;
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'XK-' + index.substring(leftLength, index.length);
}

function createIndexXuatKho(index) {
    if (!index) index = 1;
    index = '000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return index.substring(leftLength, index.length);
}


exports.sendNotification = async function (notifyId) {

    let item = await NotificationModel.MODEL.getNotificationsById(notifyId);
    let user = await UserModel.MODEL.getUsersById(item.userId);

    if (item.userNotiId){
        let userNoti = await UserModel.MODEL.getUsersById(item.userNotiId);
        item.avatar = userNoti.picture;
        item.name = userNoti.fullName
    }

    if (item.billId) {
        let bill = await BillModel.MODEL.getBillsById(item.billId)
        bill ? item.billName = bill.name : item.billName = ''
    }
    if (item.exportId) {
        let dataExport = await ProducExportModel.MODEL.getProducExportById(item.exportId)
        dataExport ? item.exportName = dataExport.name : item.exportName = ''
    }
    if (item.transportId) {
        let transport = await TransportBillModel.MODEL.getTransportById(item.transportId)
        transport ? item.transportName = transport.name : item.transportName = ''
    }
    if (item.contractId) {
        let contract = await ContractModel.MODEL.getContractsById(item.contractId)
        contract ? item.contractName = contract.numberContract : item.contractName = ''
    }

    let tokens = await FcmTokensModal.MODEL.getAllTokenForUser(item.userId);

    if (tokens.length == 0) return;
    item.notifyType = item.type;

    let html = '';
    switch (Number(item.type)) {
        case 1:
            html = `${item.name} yêu cầu vay sản phẩm - Mã đơn hàng: ${createMaDonHang(item.billName)}`;
            break
        case 2:
            html = `${item.name} hủy yêu cầu vay sản phẩm - Mã đơn hàng: ${createMaDonHang(item.billName)}`;
            break
        case 3:
            html = `${item.name} gửi yêu cầu xác nhận - Mã đơn hàng: ${createMaDonHang(item.billName)}`
            break
        case 4:
            html = `${item.name} xác nhận chấp nhận đơn hàng - Mã đơn hàng: ${createMaDonHang(item.billName)}`
            break
        case 5:
            html = `${item.name} xác nhận từ chối đơn hàng - Mã đơn hàng: ${createMaDonHang(item.billName)}`
            break
        case 6:
            html = `${item.name} từ chối yêu cầu vay sản phẩm - Mã đơn hàng: ${createMaDonHang(item.billName)}`
            break
        case 7:
            html = `${item.name} chấp nhận yêu cầu vay sản phẩm - Mã đơn hàng: ${createMaDonHang(item.billName)}`
            break
        case 8:
            html = `${item.name} tạo đơn hàng mới - Mã đơn hàng: ${createMaDonHang(item.billName)}`
            break
        case 9:
            html = `${item.name} đã hoàn thành giao đơn hàng - Mã ${item.transportType == 0 ? 'vận đơn' : 'giám sát'}: ${item.transportType == 0 ? createMaVanChuyen(item.transportName) : createMaGiamSat(item.transportName)}`
            break
        case 10:
            html = `${item.name} đã tạo lệnh xuất kho mới - Mã xuất kho: ${item.exportName}`
            break
        case 11:
            html = `${item.name} đã chỉ định vận chuyển - Mã vận đơn: ${createMaVanChuyen(item.transportName)}`
            break
        case 12:
            html = `${item.name} đã chỉ định giám sát - Mã giám sát: ${createMaGiamSat(item.transportName)}`
            break
        case 13:
            html = `${item.name} chỉnh sửa đơn hàng - Mã đơn hàng: ${createMaDonHang(item.billName)}`
            break
        case 14:
            html = `Hợp đồng ${item.title}: sắp hết hạn, vui lòng kiểm tra hợp đồng`
            break
        case 15:
            html = `Lô hàng ${item.stock} sắp hết hạn`
            break
        case 16:
            html = `Lô hàng ${item.stock} đã hết hạn`
            break
        case 17:
            html = `Mã vận đơn: ${createMaVanChuyen(item.transportName)} thông báo có trả hàng`
            break
        case 18:
            html = `${item.name} xác nhận đã xuất hàng cho đơn vận - Mã vận đơn: ${createMaVanChuyen(item.transportName)}`
            break
        case 19:
            html = `${item.name} xác nhận đã nhận hàng cho đơn vận - Mã vận đơn: ${createMaVanChuyen(item.transportName)}`
            break;
        case 20:
            html = `Logistic ${item.name} tạo đơn hàng mới - Mã đơn hàng: ${createMaDonHang(item.billName)}`
            break;
        case 21:
            html = `${item.name} đã hoàn thành giao đơn hàng - Mã vận đơn ${createMaVanChuyen(item.transportName)}`
            break;
        case 22:
            html = `Đơn hàng đã hoàn thành - Mã đơn hàng: ${createMaDonHang(item.billName)}`
            break;
        case 23:
            html = `${item.name} đã nhắn tin cho bạn trong đơn hàng ${createMaDonHang(item.billName)}`
            break;

    }

    tokens.forEach(token => {
        fcm.send({
            to: token,
            // collapse_key: 'your_collapse_key',
            collapse_key: notifyId,
            // time_to_live: 0,
            data: item,
            notification: {
                title: 'Thông báo từ hamed',
                body: html,
                badge: user.notifications,
            }
        }, function (err, response) {

        });
    })
}