"use strict"
let showSelect = true
let listCodes = []
productRest.forEach(item => {
    listCodes.push(item.code)
    item.countFirst = item.count
})

function renderListProductRest() {
    let html = ''
    productRest.forEach((item, index) => {
        html += `
        <div class="item" id="code-${index}">
            <div class="name-stock">
                ${item.code}
            </div>
            <ul class="list-detail-stock" code="03321266001">
                <li class="hang-tu-kho" style="background: ${item.includes ? '' : '#fde0e0'}">
                    <div class="code-stock">
                        <table>
                            <tbody>
                            <tr>
                                <td style="width: 40%;">Tên sản phẩm:</td>
                                <td>${item.productInfo.name}</td>
                            </tr>
                            <tr>
                                <td >Số lượng trên hóa đơn:</td>
                                <td>${item.countBill}</td>
                            </tr>
                            <tr>
                                <td>Số lượng còn thiếu:</td>
                                <td>${item.count}</td>
                            </tr>
                            <tr>
                                <td>Ngày hết hạn:</td>
                                <td>${moment(item.endDate).format('DD.MM.YYYY')}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="amount-stock text-center"
                        style="width: 20%;display:${showSelect ? 'none' : ''}">
                        <p>Số lượng lấy:</p>
                        <div class="input-group">
                            <div class="dec button-down" >-</div>
                            <input style="color:${!item.includes ? 'red' : item.countSelect > item.count ? 'red' : ''}" name="quant[2]" productIndex="${index}"
                                class="form-control input-number count-get-product"
                                value="${item.countSelect}" min="0"
                                max="${item.count}" type="text">
                            <div class="inc button-up" >+</div>
                        </div>
                        <p class="warning" style="color: red"></p>
                    </div>
                </li>
            </ul>
        </div>
        `
    });

    $('#dsHangCanGiao').html(html)
    html = ''
    dsHoaDon.forEach((item, index) => {
        html += `
            <tr id="index-hoa-don-in-list-${item.index}">
                <td>${index + 1}</td>
                <td>${createMaHoaDon(1, monitor.name, item.index)}</td>
                <td>${item.countProduct}</td>
                <td>${item.soHoaDonNoiBo}</td>`;
        let thanhToan = (!item.paid || hd.paid == 0) ?
            `<a style="float: right; color: #fff; background: orange; text-transform: none; padding: 1px 10px; border-radius: 20px; margin-right: 5px; width: unset;"
            href="javascript:;"
        class="create-account export-excel">Chưa thanh toán</a>` :
            `<a style="float: right; color: #fff; background: green; text-transform: none; padding: 1px 10px; border-radius: 20px; margin-right: 5px; width: unset;"
            href="javascript:;"
        class="create-account export-excel">Đã thanh toán</a>`
        html += `
                <td>
                    ${thanhToan}
                    <a target="_blank"
                       style="color: #fff; background: #2225ff; text-transform: none; padding: 1px 10px; border-radius: 20px; margin-right: 5px; width: unset;"
                       href="/xuat-phieu-xuat-kho.html/${monitor._id}/${index}?type=1"
                       class="create-account export-excel">Xem PXK</a>
                    <a target="_blank"
                       style="color: #fff; background: #5366b1; text-transform: none; padding: 1px 10px; border-radius: 20px; margin-right: 5px; width: unset;"
                       href="/bien-ban-kiem-nhap.html/${monitor._id}/${index}?type=1"
                       class="create-account export-excel">Xem BBKN</a>
                    <a target="_blank"
                       style="color: #fff; background: green; text-transform: none; padding: 1px 10px; border-radius: 20px; margin-right: 5px; width: unset;"
                       href="/in-hoa-don.html/${monitor._id}/${index}?type=1"
                       class="create-account export-excel">Xem HD</a>
                    <a style="color: #fff; background: green; text-transform: none; padding: 1px 10px; border-radius: 20px; margin-right: 5px; width: unset;"
                       href="javascript:;" url="/tai-excel-hoa-don.html/${monitor._id}/${index}?type=1"
                       class="create-account export-excel download-excel-option">Tải Excel</a></td>`

        html += `<td>
                    <a class="edit-monitor" index="${index}" href="javascript:;" class="edit"><img src="/template/ui/images/edit.svg" alt=""></a>
                </td>
            </tr>
        `
    })
    $('#listMonitor').html(html);

    $(function () {
        try {
            let url = window.location.href;
            if (url.includes('#')) {
                let idScroll = url.split("#")[1];
                if (idScroll.includes('index-hoa-don-in-list')) {
                    $(`#${idScroll} td`).css({background: '#9fd5ff'});
                    $('html, body').animate({
                        scrollTop: $("#" + idScroll).offset().top
                    }, 700);
                }
            }
        } catch (e) {

        }
    })
}

function changeCountData(element) {
    if (Number($(element).val()) > Number($(element).attr('max'))) {
        $(element).css('color', 'red')
    } else {
        $(element).css('color', '')
    }
    if (Number($(element).val()) < 0) {
        $(element).val(0)
    }
    productRest[Number($(element).attr('productIndex'))].countSelect = Number($(element).val())

}

function saveMonitor() {
    post(`/chi-tiet-giam-sat.html/${transportId}`, {
        dsHoaDon,
    }, res => {
        if (res.error) {
            displayError(res.message);
        } else {
            displaySuccess(res.message);
        }
    })
}

function resetDataProductRest(type) {
    if (!type) {
        for (let i = productRest.length - 1; i >= 0; i--) {
            if (!productRest[i].includes) {
                productRest.splice(i, 1)
            } else {
                productRest[i].count = productRest[i].countFirst;
                productRest[i].countSelect = 0
            }
        }
    } else {
        for (let i = productRest.length - 1; i >= 0; i--) {
            if (!productRest[i].includes) {
                productRest.splice(i, 1)
            } else {
                productRest[i].countSelect = 0
            }
        }
    }
}


$(function () {
    renderListProductRest()
    $(document).on('keyup', '.count-get-product', function (e) {
        changeCountData(this)
    });
    $(document).on('click', '.table-refresh', function (e) {
        location.reload()
    });
    $(document).on('click', '.new-monitor', function (e) {
        dsHoaDon.push({
            index: dsHoaDon.length,
            countProduct: 0,
            listProducts: [],
            soHoaDonNoiBo: '',
        })
        renderListProductRest()
    });

    $(document).on('click', '.edit-monitor', function (e) {
        showSelect = false
        resetDataProductRest()
        let index = Number($(this).attr('index'))
        $('#button-file').show()
        $('#button-save').show();
        $('#soHoaDonNoiBoBox').show();

        $('#button-save').find('a').attr('index', index);
        $('.soHoaDonNoiBo').val(dsHoaDon[index].soHoaDonNoiBo);

        dsHoaDon[index].listProducts.forEach(item => {
            productRest[listCodes.indexOf(item.code)].count += item.count
            productRest[listCodes.indexOf(item.code)].countSelect = item.count
            $('#text-select').text(`Chọn sản phẩm từ hóa đơn: ${createMaHoaDon(1, monitor.name, index)}`)
        })
        renderListProductRest()
    });
    $(document).on('click', '.save-table', function (e) {
        let soHoaDonNoiBo = $('.soHoaDonNoiBo').val().trim();

        let listProducts = [];
        let check = false
        productRest.forEach(item => {
            if (item.countSelect > 0) {
                if (item.countSelect > item.count) {
                    check = true
                }
                listProducts.push({
                    count: item.countSelect,
                    code: item.code
                })
            }
        })
        if (check) {
            return displayError("Số lượng sản phẩm không hợp lệ");
        }
        let index = Number($(this).attr('index'))
        showSelect = true
        $('#soHoaDonNoiBoBox').hide()
        $('#button-file').hide()
        $('#button-save').hide()
        productRest.forEach(item => {
            item.count = item.count - item.countSelect;
            item.countFirst = item.count
        })
        dsHoaDon[index].listProducts = listProducts;
        dsHoaDon[index].soHoaDonNoiBo = soHoaDonNoiBo;
        dsHoaDon[index].countProduct = 0
        dsHoaDon[index].listProducts.forEach(item => {
            dsHoaDon[index].countProduct += item.count
        })
        resetDataProductRest()
        renderListProductRest()
        saveMonitor()
    });
    $(document).on('click', '.button-down', function (e) {
        let oldValue = $(this).parent().find("input").val();
        $(this).parent().find("input").val(parseFloat(oldValue) - 1);
        changeCountData($(this).parent().find("input"))
    });
    $(document).on('click', '.button-up', function (e) {
        let oldValue = $(this).parent().find("input").val();
        $(this).parent().find("input").val(parseFloat(oldValue) + 1);
        changeCountData($(this).parent().find("input"))
    });

    $('#uploads-stock').on('change', function () {
        if (this.files[0]) {
            let formData = new FormData();
            let file = this.files[0];
            formData.append("giamSat", file);
            $(this).val('')
            ajaxFile('/gui-du-lieu-giam-sat.html', formData, res => {
                if (res.error) {
                    displayError(res.message);
                } else {
                    resetDataProductRest(true)
                    res.data.products.forEach(item => {
                        if (listCodes.includes(item.code.toString().trim())) {
                            productRest[listCodes.indexOf(item.code.toString().trim())].countSelect = item.count
                        } else {
                            productRest.push({
                                code: item.code.toString().trim(),
                                count: 0,
                                countSelect: item.count,
                                includes: false,
                                countBill: 0,
                                endDate:new Date(getDateValue(item.endDate)).getTime(),
                                productInfo:infoContract[item.code.toString().trim()] ? infoContract[item.code.toString().trim()] :{}
                            })
                        }
                    })
                    renderListProductRest()
                }
            }, error => {
                displayError('Có lỗi, vui lòng thử lại');
            })
        }
    });
})