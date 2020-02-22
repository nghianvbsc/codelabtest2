var products = []
var filePath = '';
var stocks = []

function renderTable() {
    $('.logistic-pagination .result').text(`Hiển thị từ 1 đến ${products.length} kết quả`)
}

$('#search-goods').on('change paste keyup', function () {
    filterProduct();
});

function filterProduct() {
    let key = removeUtf8($('#search-goods').val().toString().trim())
    if (key == '') {
        products.forEach(item => {
            item.hide = false
        })
    } else {
        products.forEach(item => {
            if (removeUtf8(item.code).includes(key) || removeUtf8(item.name).includes(key) || removeUtf8(item.khoaDatHang).includes(key) || removeUtf8(item.stock).includes(key)) {
                item.hide = false
            } else {
                item.hide = true
            }
        })
    }

    renderAllItemTable();
}

function renderAllItemTable() {
    let html = ''
    for (let i = 0; i < products.length; i++) {
        if (products[i] && !products[i].hide) {
            let product = products[i];
            html += `
            <tr id="item-${i}">
                <td>${i + 1}</td>
                <td>${product.code}</td>
                <td><a class="colorBlue fontWeight500 textUnderline" href="javascript:;">${product.name}</a></td>
                <td>${product.khoaDatHang}</a></td>
                <td><span class="colorRed fontWeight500">${numberFormat(product.price)}</span> đ</td>
                <td>${Number(product.tax) * 100} %</td>
                <td>${product.count}</td>
                <td>${product.stock}</td>
                <td>${moment(new Date(getDateValue(product.dateExpire)).getTime()).format('DD/MM/YYYY')}</td>
                <td>${product.note || ''}</td>
            </tr>
            `
        }
    }
    $('.table-logistic tbody').html(html);
    renderTable()
}

$(function () {
    $(document).on('change', '.stock-select', function (e) {
        products[Number($(this).attr('index'))].stockIndex = Number($(this).val())
    });
    $(document).on('change', '#choose-entry', function (e) {
        if ($(this).val() == 0) {
            $('#select-choose-borrow').hide()
        } else if ($(this).val() == 1) {
            $('#select-choose-borrow').show()
        }
    });

    $(document).on('click', '.submit-product', function (e) {
        if (products.length == 0) {
            displayError('Không có hàng hoá để thêm!');
            return;
        }


        let data = {
            filePath: filePath,
        }

        if (userLogin.type == 2) {
            data.shipmentId = shipmentId;
            data.type = 0;
        } else {
            data.type = $('#choose-entry').val();
            if (data.type == -1) {
                displayError("Bạn chưa chọn loại nhập kho");
                return;
            }

            data.borrowBillId = $('#choose-borrow').val();
            if (data.type == 1 && data.borrowBillId == 0) {
                displayError("Bạn chưa chọn mã hàng vay cần trả");
                return;
            }
        }

        post(`/nhap-hang-hoa-vao-kho.html`, data, success => {
            if (success.error) {
                displayError(success.message);
            } else {
                displaySuccess(success.message);
                setTimeout(() => {
                    if (userLogin.type == 1) {
                        location.href = '/danh-sach-nhap-kho.html';
                    } else {
                        location.href = `/danh-sach-hang-hoa-lo-hang-gui.html/${shipmentId}`
                    }
                }, 2000);
            }
        }, error => {
            displayError(error.responseText);
        });
    });

    $('#uploads-stock').on('change', function () {
        if (this.files[0]) {

            let formData = new FormData();
            let file = this.files[0];
            formData.append("nhapHang", file);
            ajaxFile('/gui-du-lieu-nhap-kho.html', formData, res => {
                if (res.error) {
                    displayError(res.message);
                } else {
                    products = res.data.products;
                    products.forEach(item => {
                        item.hide = false;
                    })
                    filePath = res.data.filePath;
                    renderAllItemTable()
                }
            }, error => {
                displayError('Có lỗi, vui lòng thử lại');
            })
        }
    });
});
