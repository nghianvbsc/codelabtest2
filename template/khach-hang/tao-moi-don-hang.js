var contract = null
var totalMoney = 0

function huyTaoDonHang() {
    $('#xuLyTaoDonHang').fadeOut();
}

function chiDinhGiamSat() {
    $('#xuLyTaoDonHang').fadeIn();
}

function renderTotalPrice() {
    totalMoney = 0
    for (let e in contract.listCategories) {
        contract.listCategories[e].products.forEach(item2 => {
            let priceWithVAT = Number(item2.price) + Number(item2.price) * Number(item2.tax);
            totalMoney += item2.countBill * priceWithVAT
        })
    }
    $('.total-price .price').html(`${numberFormat(Number(totalMoney).toFixed(3))} <span class="unit">đ</span>`)
}

function changeCount(element) {
    if (Number($(element).val()) > Number($(element).attr('max'))) {
        $(element).val($(element).attr('max'))
    }
    if (Number($(element).val()) < 0) {
        $(element).val(0)
    }
    let indexProduct = Number($(element).attr('productIndex'));

    for (let e in contract.listCategories) {
        contract.listCategories[e].products.forEach(product => {
            if (product.index == indexProduct) {
                product.countBill = Number($(element).val());
                let priceWithVAT = Number(Number(product.price) + Number(product.price) * Number(product.tax)).toFixed(3);
                $(element).parents('.list-detail-stock').find('.price').text(numberFormat(Number(product.countBill * priceWithVAT).toFixed(3)))
            }
        })
    }


    if (Number($(element).val()) > Number($(element).attr('sl-con-lai')) && Number($(element).val()) > 0) {
        $(element).parents('.amount-stock').find('.message-qua-sl').fadeIn();
    } else {
        $(element).parents('.amount-stock').find('.message-qua-sl').fadeOut();
    }

    renderTotalPrice()
}

function downCount(element) {
    var oldValue = $(element).parent().find("input").val();
    $(element).parent().find("input").val(parseFloat(oldValue) - 1);
    changeCount($(element).parent().find("input"))
}

function upCount(element) {
    var oldValue = $(element).parent().find("input").val();
    $(element).parent().find("input").val(parseFloat(oldValue) + 1);
    changeCount($(element).parent().find("input"))
}

$('#search-stock').on('change paste keyup', function () {
    filterProduct();
});

function filterProduct() {
    let key = removeUtf8($('#search-stock').val().trim().toLowerCase()).toString();
    if (key == '') {
        $('.list-detail-stock').show();
        $('.product-item').show();
        $('.item-category').show();
    } else {
        $('.product-item').hide();
        $('.list-detail-stock').show();
        $('.item-category').show();

        for (let e in contract.listCategories) {
            let item = contract.listCategories[e];

            item.products.forEach(item2 => {
                if (removeUtf8(item2.code).includes(key) || removeUtf8(item2.name).includes(key)) {
                    $(`.child-li-${item2.index}`).show();
                }
            })
        }

        $('.list-detail-stock').each(function () {
            let lis = $(this).find('li');
            let hasEl = false;

            lis.each(function () {
                if ($(this).is(':visible')) {
                    hasEl = true;
                }
            })

            if (!hasEl) {
                $(this).parent().hide();
            }
        })
    }
}

function taoDonHang() {
    if (!contract) return;
    let data = objectifyForm($('.form-info-receiver').serializeArray());
    data.contractId = $('#choose-contract').val()
    let totalMoney1 = 0;
    let totalMoney2 = 0
    let listProductType1 = []
    let listProductType2 = []
    for (let e in contract.listCategories) {
        let item = contract.listCategories[e];
        item.products.forEach(item2 => {
            if (item2.countBill > 0 && item2.countBill > item2.slConLai) {
                if (item2.slConLai > 0) {
                    let priceWithVAT = Number(item2.price) + Number(item2.price) * Number(item2.tax);
                    totalMoney2 += (Number(item2.countBill) - Number(item2.slConLai)) * priceWithVAT
                    listProductType2.push({
                        code: item2.code,
                        count: Number(item2.countBill) - Number(item2.slConLai),
                        price: item2.price,
                        name: item2.name,
                    })
                    totalMoney1 += item2.slConLai * priceWithVAT
                    listProductType1.push({
                        code: item2.code,
                        count: item2.slConLai,
                        price: item2.price,
                        name: item2.name,
                    })
                } else {
                    let priceWithVAT = Number(item2.price) + Number(item2.price) * Number(item2.tax);
                    totalMoney2 += item2.countBill * priceWithVAT
                    listProductType2.push({
                        code: item2.code,
                        count: item2.countBill,
                        price: item2.price,
                        name: item2.name,
                    })
                }
            }
            if (item2.countBill > 0 && item2.countBill <= item2.slConLai) {
                let priceWithVAT = Number(item2.price) + Number(item2.price) * Number(item2.tax);
                totalMoney1 += item2.countBill * priceWithVAT
                listProductType1.push({
                    code: item2.code,
                    count: item2.countBill,
                    price: item2.price,
                    name: item2.name,
                })
            }
        })
    }
    post('/tao-don-hang-moi.html', {
        ...data,
        listProducts: listProductType1,
        type: 0,
        totalMoney: totalMoney1
    }, success => {
        if (success.error) {
            displayError(success.message);
        } else {
            post('/tao-don-hang-moi.html', {
                ...data,
                listProducts: listProductType2,
                type: 1,
                totalMoney: totalMoney2
            }, success => {
                if (success.error) {
                    displayError(success.message);
                } else {
                    displaySuccess(success.message);
                    setTimeout(() => {
                        location.href = '/nguoi-dung-quan-ly-don-hang.html';
                    }, 2000);
                }
            }, error => {
                displayError(error.responseText);
            });
        }
    }, error => {
        displayError(error.responseText);
    });
}

$(() => {
    function renderListProduct() {
        $('#list-product-bill').html('');
        let htmlCategory = '<option value="all">Danh mục hàng hoá</option>'
        let html = ''

        if (contract == null) {
            $('#list-product-bill').html('');
            $('#cat-stock').html('');
            return;
        }

        for (let category in contract.listCategories) {
            let item = contract.listCategories[category];
            htmlCategory += `<option value="${category}">${item.category}</option>`;
            let htmlItem = ''

            item.products.forEach(product => {
                htmlItem += `
                <ul class="list-detail-stock" >
                    <li class="product-item child-li-${product.index}">
                        <div class="code-stock">
                            <table>
                                <tbody>
                                <tr>
                                    <td style="width: 40%;">Tên sản phẩm:</td>
                                    <td>${product.name}</td>
                                </tr>
                                <tr>
                                    <td style="width: 40%;">Mã sản phẩm:</td>
                                    <td>${product.code}</td>
                                </tr>
                                <tr>
                                    <td>Số lượng còn lại trong hợp đồng:</td>
                                    <td>${product.slConLai}</td>
                                </tr>
                                <tr>
                                    <td>Tổng tiền:</td>
                                    <td><strong class="price">${numberFormat(Number(product.countBill * (Number(Number(product.price) + Number(product.price) * Number(product.tax)).toFixed(0))).toFixed(3))}</strong><span
                                                class="unit">đ</span></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="amount-stock text-center">
                            <p>Số lượng cần lấy:</p>
                            <div class="input-group">
                                <div class="dec button-count" onclick="downCount(this)" >-</div>
                                <input code="${product.code}" productIndex="${product.index}" name="quant[2]" class="form-control input-number count-product" sl-con-lai="${product.slConLai}" value="${product.countBill}" min="0" max="1000" type="text">
                                <div class="inc button-count" onclick="upCount(this)">+</div>
                            </div>
                            <p class="message-qua-sl" style="color: red">Số lượng phát sinh đã lớn hơn trong hợp đồng ban đầu. Hợp đồng này sẽ tạo ra công nợ. Bạn vẫn có thể tiếp tục</p>
                        </div>
                    </li>
                </ul>
                `
            })
            html += `
            <div class="item item-category" category="${category}">
                    <div class="name-stock">
                        ${item.category}
                    </div>
                    ${htmlItem}
                </div>
            `
        }

        $('#list-product-bill').html(html);
        $('#cat-stock').html(htmlCategory)
        renderTotalPrice()
    }

    function checkShowAndHideCategory() {
        $('#list-product-bill .item-category').each(function (el) {
            let hasChildShow = false;
            $(this).find('li').each(function (e) {
                if ($(this).is(':visible')) {
                    hasChildShow = true
                }
            });

            if (hasChildShow) {
                $(this).show();
            } else {
                $(this).hide();
            }
        })
    }


    function kiemTraVaHienThiCanhBaoTrungMaSp(data) {
        let duLieuTrung = [];
        for (let productCode in data) {
            if (data[productCode].length > 1) {
                duLieuTrung.push({
                    code: productCode,
                    lines: data[productCode]
                })
            }
        }

        if (duLieuTrung.length > 0) {
            let htmlWarning = duLieuTrung.map((d => {
                return `<p style="text-align: left"><strong>${d.code}</strong>: trên các dòng thứ ${d.lines.join(', ')}</p>`
            }));


            Swal.fire({
                imageUrl: '/template/warning.png',
                title: '<span><strong>Cảnh báo TRÙNG</strong> mã sản phẩm trong file</span>',
                icon: 'info',
                html:
                    '<p style="text-align: left; padding-top: 20px">Chi tiết<hr>' + htmlWarning.join('')+'</p>',
                imageWidth: 50,
                imageHeight: 50,
                imageAlt: 'Custom image',
                confirmButtonText: 'Đồng ý',

            });
        }
    }


    $('#uploads-stock').on('change', function () {
        if (!contract) {
            displayError('Vui lòng chọn hợp đồng!');
            $(this).val('')
            return
        }
        if (this.files[0]) {
            let file = this.files[0];
            let formData = new FormData();
            formData.append("cungCap", file);
            $(this).val('');

            ajaxFile('/gui-du-lieu-gui-nha-cung-cap.html/0', formData, res => {
                if (res.error) {
                    displayError(res.message);
                } else {
                    let productFiles = {};
                    let changeIndex = {};
                    let trungMaSanPham = {};
                    res.data.products.forEach((item, i) => {
                        productFiles[item.code.toString().trim()] = Number(item.count);
                        changeIndex[item.code] = {sort: i};
                        if (trungMaSanPham[item.code.toString().trim()]) {
                            trungMaSanPham[item.code.toString().trim()].push(i+1)
                        } else {
                            trungMaSanPham[item.code.toString().trim()] = [i+1]
                        }
                    });

                    kiemTraVaHienThiCanhBaoTrungMaSp(trungMaSanPham);

                    for (let e in contract.listCategories) {
                        let item = contract.listCategories[e];
                        item.products.forEach(item2 => {
                            if (productFiles[item2.code.toString().trim()]) {
                                item2.countBill = productFiles[item2.code.toString().trim()]
                                changeIndex[item2.code].parent = $(`.child-li-${item2.index}`).parents('.item-category')
                            } else {
                                item2.countBill = 0
                            }

                            $(`.child-li-${item2.index} .count-product`).val(item2.countBill);

                            changeCount(`.child-li-${item2.index} .count-product`);
                        })
                    }

                    checkShowAndHideCategory();

                    // Sắp xếp theo thứ tự
                    let reChangeELIndex = [];
                    for (let key in changeIndex) {
                        reChangeELIndex.push(changeIndex[key]);
                    }


                    reChangeELIndex.sort((a, b) => {
                        let aName = a.sort;
                        let bName = b.sort;
                        return ((aName < bName) ? 1 : ((aName > bName) ? -1 : 0));
                    });

                    reChangeELIndex.forEach(child => {
                        $(child.parent).prependTo('#list-product-bill');
                    })
                }
            }, error => {
                displayError('Có lỗi, vui lòng thử lại');
            })
        } else {
            $('#excelName').text('');
        }
    })

    $(document).on('keyup', '.count-product', function (e) {
        changeCount(this)
    });
    $('#choose-contract').on('change', function () {
        contract = null;
        if ($(this).val() == 'null') {
            renderListProduct()
        } else {
            contracts.forEach(item => {
                if (item._id == $(this).val()) {
                    contract = item
                }
            })
            renderListProduct()
        }

    })
    $('#cat-stock').on('change', function () {
        let filterCategory = $(this).val();
        $('.list-detail-stock').show();
        if (filterCategory != 'all') {
            $('.item-category').each(function () {
                let category = $(this).attr('category');
                if (filterCategory == category) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        } else {
            $('.item-category').show();
        }
    })

    $('.create-new-bill').on('click', function () {
        if (!contract) return;
        let data = objectifyForm($('.form-info-receiver').serializeArray());
        data.contractId = $('#choose-contract').val()
        let totalMoney1 = 0;
        let totalMoney2 = 0
        let checkType2 = false
        let listProductType1 = []
        let listProductType2 = []
        for (let e in contract.listCategories) {
            let item = contract.listCategories[e];
            item.products.forEach(item2 => {
                if (item2.countBill > 0 && item2.countBill > item2.slConLai) {
                    checkType2 = true
                    if (item2.slConLai > 0) {
                        let priceWithVAT = Number(item2.price) + Number(item2.price) * Number(item2.tax);
                        totalMoney2 += (Number(item2.countBill) - Number(item2.slConLai)) * priceWithVAT
                        listProductType2.push({
                            code: item2.code,
                            name: item2.name,
                            count: Number(item2.countBill) - Number(item2.slConLai),
                            price: item2.price,
                        })
                        totalMoney1 += item2.slConLai * priceWithVAT
                        listProductType1.push({
                            code: item2.code,
                            count: item2.slConLai,
                            price: item2.price,
                        })
                    } else {
                        let priceWithVAT = Number(item2.price) + Number(item2.price) * Number(item2.tax);
                        totalMoney2 += item2.countBill * priceWithVAT
                        listProductType2.push({
                            code: item2.code,
                            name: item2.name,
                            count: item2.countBill,
                            price: item2.price,
                        })
                    }
                }
                if (item2.countBill > 0 && item2.countBill <= item2.slConLai) {
                    let priceWithVAT = Number(item2.price) + Number(item2.price) * Number(item2.tax);
                    totalMoney1 += item2.countBill * priceWithVAT
                    listProductType1.push({
                        code: item2.code,
                        name: item2.name,
                        count: item2.countBill,
                        price: item2.price,
                    })
                }
            })
        }

        if (checkType2 && listProductType1.length > 0) {
            let html = ''
            listProductType2.forEach((item, index) => {
                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.code}</td>
                        <td>${item.name}</td>
                        <td>${item.count}</td>
                    </tr>
                `
            })
            $("#don-hang-vay tbody").html(html)
            html = ''
            listProductType1.forEach((item, index) => {
                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.code}</td>
                        <td>${item.name}</td>
                        <td>${item.count}</td>
                    </tr>
                `
            })
            $("#don-hang-thuong tbody").html(html)
            $('#xuLyTaoDonHang').fadeIn();
        } else {
            post('/tao-don-hang-moi.html', {
                ...data,
                listProducts: listProductType1.length > 0 ? listProductType1 : listProductType2,
                type: listProductType1.length > 0 ? 0 : 1,
                totalMoney: listProductType1.length > 0 ? totalMoney1 : totalMoney2
            }, success => {
                if (success.error) {
                    displayError(success.message);
                } else {
                    displaySuccess(success.message);
                    setTimeout(() => {
                        location.href = '/nguoi-dung-quan-ly-don-hang.html';
                    }, 2000);
                }
            }, error => {
                displayError(error.responseText);
            });
        }

    })

    $('.cancel-order').on('click', function () {
        window.href = '/nguoi-dung-quan-ly-don-hang.html';
    })
})