function handleNotification(view, id) {
    $(view).css({
        background: '#fff',
        fontWeight: 500
    });

    get(`/da-xem-thong-bao.html/${id}`, {}, () => {
        location.href = $(view).attr('ref');
    }, () => {
        location.href = $(view).attr('ref');
    })
}

$('.notification').on('click', () => {
    if ($(".notification ul").is(':visible')) return;
    get('/get-data-notification.html', {}, (res) => {
        if (!res.error) {
            let notifications = res.data.notifications
            let html = '';
            notifications.forEach(item => {
                if (item.type == 1) {

                }
                switch (Number(item.type)) {
                    case 1:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" ref="javascript:;" ref="/chi-tiet-yeu-cau-vay.html/${item.billId}">${item.name} yêu cầu vay sản phẩm - Mã đơn hàng: ${createMaDonHang(item.billName)}</a></li> `
                        break
                    case 2:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-yeu-cau-vay.html/${item.billId}">${item.name} hủy yêu cầu vay sản phẩm - Mã đơn hàng: ${createMaDonHang(item.billName)}</a></li> `
                        break
                    case 3:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-don-hang/${item.billId}.html">${item.name} gửi yêu cầu xác nhận - Mã đơn hàng: ${createMaDonHang(item.billName)}</a></li> `
                        break
                    case 4:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-don-hang/${item.billId}.html">${item.name} xác nhận chấp nhận đơn hàng - Mã đơn hàng: ${createMaDonHang(item.billName)}</a></li> `
                        break
                    case 5:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-don-hang/${item.billId}.html">${item.name} xác nhận từ chối đơn hàng - Mã đơn hàng: ${createMaDonHang(item.billName)}</a></li> `
                        break
                    case 6:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-yeu-cau-vay.html/${item.billId}">${item.name} từ chối yêu cầu vay sản phẩm - Mã đơn hàng: ${createMaDonHang(item.billName)}</a></li> `
                        break
                    case 7:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-yeu-cau-vay.html/${item.billId}">${item.name} chấp nhận yêu cầu vay sản phẩm - Mã đơn hàng: ${createMaDonHang(item.billName)}</a></li> `
                        break
                    case 8:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-don-hang/${item.billId}.html">${item.name} tạo đơn hàng mới - Mã đơn hàng: ${createMaDonHang(item.billName)}</a></li> `
                        break
                    case 9:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-van-chuyen.html/${item.transportId}">${item.name} đã hoàn thành giao đơn hàng - Mã ${item.transportType == 0 ? 'vận đơn' : 'giám sát'}: ${item.transportType == 0 ? createMaVanChuyen(item.transportName) : createMaGiamSat(item.transportName)}</a></li> `
                        break
                    case 10:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-xuat-kho/${item.exportId}.html">${item.name} đã tạo lệnh xuất kho mới - Mã xuất kho: ${createMaXuatKho(item.exportName)}</a></li> `
                        break
                    case 11:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-van-chuyen.html/${item.transportId}">${item.name} đã chỉ định vận chuyển - Mã vận đơn: ${createMaVanChuyen(item.transportName)}</a></li> `
                        break
                    case 12:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-van-chuyen.html/${item.transportId}">${item.name} đã chỉ định giám sát - Mã giám sát: ${createMaGiamSat(item.transportName)}</a></li> `
                        break
                    case 13:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-don-hang/${item.billId}.html">${item.name} chỉnh sửa đơn hàng - Mã đơn hàng: ${createMaDonHang(item.billName)}</a></li> `
                        break
                    case 14:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-hop-dong.html?contractId=${item.contractId}">Hợp đồng ${item.title}: sắp hết hạn, vui lòng kiểm tra hợp đồng</a></li> `
                        break
                    case 15:
                        let stockArr1 = item.stock.split(";");
                        let stockArr2 = stockArr1.map(stock => {
                            return stock.split("-")[0];
                        });

                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="${item.shipmentId ? '/danh-sach-hang-hoa-lo-hang-gui-lo.html/' + item.shipmentId + '?stocks=' + item.stock : '/kho-hang-logistic-theo-lo.html?logisticId=' + userLogin._id + '&stocks=' + item.stock}">
                        Các lô hàng ${stockArr2.join(", ")} còn ${item.countDay} ngày sẽ hết hạn</a></li> `
                        break
                    case 16:
                        let stockArr3 = item.stock.split(";");
                        let stockArr4 = stockArr3.map(stock => {
                            return stock.split("-")[0];
                        })

                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="${item.shipmentId ? '/chi-tiet-hang-hoa-lo-hang-gui.html?shipmentId=' + item.shipmentId + '&stock=' + item.stock : '/hang-hoa-lo-hang.html?logisticId=' + userLogin._id + '&stock=' + item.stock}">
                        Lô hàng ${stockArr4.join(", ")} đã hết hạn</a></li> `
                        break
                    case 17:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-van-chuyen.html/${item.transportId}">Mã vận đơn: ${createMaVanChuyen(item.transportName)} thông báo có trả hàng</a></li> `
                        break
                    case 18:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-van-chuyen.html/${item.transportId}">${item.name} xác nhận đã xuất hàng cho đơn vận - Mã vận đơn: ${createMaVanChuyen(item.transportName)}</a></li> `
                        break
                    case 19:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-van-chuyen.html/${item.transportId}">${item.name} xác nhận đã nhận hàng cho đơn vận - Mã vận đơn: ${createMaVanChuyen(item.transportName)}</a></li> `
                        break
                    case 20:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-don-hang/${item.billId}.html">Logistic ${item.name} tạo đơn hàng mới - Mã đơn hàng: ${createMaDonHang(item.billName)}</a></li> `
                        break
                    case 21:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-van-chuyen.html/${item.transportId}">${item.name} đã hoàn thành giao đơn hàng - Mã vận đơn ${createMaVanChuyen(item.transportName)}</a></li> `
                        break
                    case 22:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-don-hang/${item.billId}.html">Đơn hàng đã hoàn thành - Mã đơn hàng: ${createMaDonHang(item.billName)}</a></li> `
                        break
                    case 23:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-don-hang/${item.billId}.html">${item.name} đã nhắn tin cho bạn trong đơn hàng ${createMaDonHang(item.billName)}</a></li> `
                        break
                    case 24:
                        html += `<li><a style="background: ${item.watched == 0 ? '#eef3ff' : '#fff'}; font-weight: ${item.watched == 0 ? 'bold' : '500'}" onclick="handleNotification(this, '${item._id}')" href="javascript:;" ref="/chi-tiet-xuat-kho/${item.exportId}.html">${item.name} đã báo xuất nhầm hàng - Mã xuất kho: ${createMaXuatKho(item.exportName)} - Nội dung: ${item.message}</a></li> `
                        break
                }
            });

            $(".notification ul").addClass('show')
            if (html == '') {
                html = `<li id="no-notification">Không có thông báo
                        </li>`;
                $(".notification ul").html(html)
                $('#number-notification').text(0)
                $('#number-notification').hide();
            } else {
                $(".notification ul").html(html)
                $('#number-notification').text(0)
                $('#number-notification').hide();
            }

        }
    })
})

function getCountNotification() {
    get('/get-count-notification.html', {}, (res) => {
        if (!res.error) {
            let count = res.data.count
            if (count > 0) {
                $('#number-notification').text(count)
                $('#number-notification').show()
            } else {
                $('#number-notification').hide();
            }
        }
    })
}

function closePopup(element) {
    socket.emit('realtime-chat', {to: userLogin._id, type: 'close-popup', id: $(element).parent().attr('id')});
}

$(function () {
    if (userLogin) {
        $(document).on('click', '.popup-new-order, .notification ul', function (e) {
            e.stopPropagation();
        });

        $(document).on('click', 'body', function (e) {
            socket.emit('realtime-chat', {to: userLogin._id, type: 'close-all-popup'});
            if ($('.notification ul').hasClass('show')) {
                $('.notification ul').hide()
                $('.notification ul').removeClass('show')
            }
        });

        socket.on(userLogin._id, data => {
            if (data.type == 'new-notification') {
                getCountNotification()
            } else if (data.type == 'close-all-popup') {
                $('.popup-new-order.new-message').remove()
                $('#popup-new-order').removeClass('open');
            }
            if (data.type == 'close-popup') {
                if (data.id != 'popup-new-order') {
                    $(`#${data.id}`).remove()
                } else {
                    $(`#${data.id}`).removeClass('open');
                }
            }
        });


        if (userLogin.showPopup && userLogin.showPopup.type) {
            let title, htmlDetail;
            if ([3, 4].includes(userLogin.type) && userLogin.showPopup.countBillReturn && userLogin.showPopup.countBillReturn > 0) {
                title = 'THÔNG BÁO ĐƠN HÀNG CHƯA TRẢ HÓA ĐƠN'
                htmlDetail = `Xin chào, bạn còn <strong>${userLogin.showPopup.countBillReturn} đơn hàng </strong> chưa lấy hóa đơn. Vui lòng kiểm tra trong Danh mục Quản lý hóa đơn hoặc <a href="/danh-sach-hoa-don.html">nhấn vào đây</a> để xem chi tiết `
            } else if (userLogin.showPopup.newBill == 0) {
                title = 'BẠN CÓ YÊU CẦU VAY HÀNG TỪ LOGISTIC KHÁC'
                htmlDetail = `Xin chào, bạn nhận được <strong>${userLogin.showPopup.newVay} đơn vay hàng</strong> từ các Logistic khác. Vui lòng kiểm tra trong Danh mục Quản lý yêu cầu vay hoặc <a href="/danh-sach-yeu-cau-vay.html">nhấn vào đây</a> để xem chi tiết `
            } else if (userLogin.showPopup.newVay == 0) {
                title = 'BẠN NHẬN ĐƯỢC ĐƠN HÀNG MỚI TỪ KHÁCH HÀNG'
                htmlDetail = `Xin chào, bạn nhận được <strong>${userLogin.showPopup.newBill} đơn đơn hàng</strong> từ các khách hàng. Vui lòng kiểm tra trong Danh mục Quản lý đơn hàng hoặc <a href="/quan-ly-don-hang-thuong.html">nhấn vào đây</a> để xem chi tiết `
            } else {
                title = 'BẠN NHẬN ĐƯỢC ĐƠN HÀNG MỚI VÀ YÊU CẦU VAY HÀNG TỪ LOGISTIC KHÁC'
                htmlDetail = `Xin chào, bạn nhận được <strong>${userLogin.showPopup.newBill} đơn đơn hàng</strong> và <strong>${userLogin.showPopup.newVay} đơn vay hàng</strong> từ các Logistic khác. Vui lòng kiểm tra trong Danh mục Quản lý đơn hàng hoặc <a href="/quan-ly-don-hang-thuong.html">nhấn vào đây</a> để xem chi tiết `
            }
            if (userLogin.showPopup.newBill != 0 || userLogin.showPopup.newVay != 0 || (userLogin.showPopup.countBillReturn && userLogin.showPopup.countBillReturn > 0)) {
                $('#popup-new-order .title').html(title)
                $('#popup-new-order .detail').html(htmlDetail)
                $('#popup-new-order').addClass('open')
            }
        }
        getCountNotification();
    }
})