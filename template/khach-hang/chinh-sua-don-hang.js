var totalMoney = 0

function renderTotalPrice() {
    totalMoney = 0
    for (let e in contract.listCategories) {
        contract.listCategories[e].products.forEach(item2 => {
            let price = Number(item2.countBill) * Number(item2.price);
            price += Number(price * Number(item2.tax));
            price = Number(price).toFixed(0);
            totalMoney += Number(price);

        })
    }
    $('.total-price .price').html(`${numberFormat(totalMoney)} <span class="unit">đ</span>`)
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
                product.countBill = Number($(element).val())
                $(element).parents('.list-detail-stock').find('.price').text(numberFormat(product.countBill * product.price))
            }
        })
    }


    if (Number($(element).val()) > Number($(element).attr('sl-con-lai'))) {
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
    let key = removeUtf8($('#search-stock').val()).toString().trim();
    if (key == '') {
        $('.list-detail-stock').show();
        $('.item-category').show();
        $('.product-item').show();
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

$(() => {
    function renderListProduct() {
        $('.detail-child').html('');
        let htmlCategory = '<option value="all">Danh mục hàng hoá</option>'
        let html = ''
        $('.file-contract').html(`
        <img src="/template/ui/images/excel.svg" alt=""> ${contract.files.name}
        <a href="javascript:;"src="/template/ui/images/download.svg" alt=""></a>
        `);

        for (let category in contract.listCategories) {
            let item = contract.listCategories[category];
            htmlCategory += `<option value="${category}">${item.category}</option>`;
            let htmlItem = ''

            item.products.forEach(product => {
                let price = Number(product.countBill) * Number(product.price);
                price += Number(price * Number(product.tax));
                price = Number(price).toFixed(0)

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
                                    <td><strong class="price">${numberFormat(price)}</strong> <span
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

        $('.detail-child').html(html);
        $('#cat-stock').html(htmlCategory)
        renderTotalPrice()
    }

    $(document).on('keyup', '.count-product', function (e) {
        changeCount(this)
    });
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
    renderListProduct();

    $('.create-new-bill').on('click', function () {
        let data = objectifyForm($('.form-info-receiver').serializeArray());
        data.listProducts = [];
        data.totalMoney = totalMoney;
        for (let e in contract.listCategories) {
            let item = contract.listCategories[e];
            item.products.forEach(item2 => {
                if (item2.countBill > 0) {
                    data.listProducts.push({
                        code: item2.code,
                        count: item2.countBill,
                        price: item2.price,
                    })
                }
            })
        }

        post(`/chinh-sua-don-hang/${billId}.html`, data, success => {
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
    })
})