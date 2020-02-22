var spTrongKho =[]
var spVay = []
var spNhap = []
var spThieu=[]
var spDaGiao =[]
function checkProductContract() {
    let listCounts = []
    let listCodes = []
    let check = false
    spTrongKho.forEach(item => {
        item.products.forEach(item2 => {
            if (listCodes.includes(item.code.toString().trim())) {
                listCounts[listCodes.indexOf(item.code.toString().trim())] += Number(item2.count)
            } else {
                listCodes.push(item.code.toString().trim())
                listCounts.push(Number(item2.count))
            }
        })
    })
    spVay.forEach(item => {
        item.products.forEach(item2 => {
            if (listCodes.includes(item.code.toString().trim())) {
                listCounts[listCodes.indexOf(item.code.toString().trim())] += Number(item2.count)
            } else {
                listCodes.push(item.code.toString().trim())
                listCounts.push(Number(item2.count))
            }
        })
    })
    spNhap.forEach(item => {
        if (listCodes.includes(item.code.toString().trim())) {
            listCounts[listCodes.indexOf(item.code.toString().trim())] += Number(item.count)
        } else {
            listCodes.push(item.code.toString().trim())
            listCounts.push(Number(item.count))
        }
    })
    products.forEach(item => {
        if (listCodes.includes(item.code.toString().trim()) && listCounts[listCodes.indexOf(item.code.toString().trim())] > Number(item.count)) {
            check = true
        }
    })
    return check
}

function changeCount(element) {
    if (Number($(element).val()) > Number($(element).attr('max'))) {
        $(element).val($(element).attr('max'))
    }
    if (Number($(element).val()) < 0) {
        $(element).val(0)
    }
    let count = Number($(element).val())
    let type = $(element).parents('ul.list-detail-stock').attr('type')
    let code = $(element).parents('li').attr('code')
    let countChange = 0
    if (type == 0) {
        spTrongKho.forEach(item => {
            if (item.code == code) {
                countChange = item.products[Number($(element).parents('li').attr('index'))].count
                item.products[Number($(element).parents('li').attr('index'))].count = count
            }
        })
    } else if (type == 1) {
        spVay.forEach(item => {
            if (item.code == code) {
                countChange = item.products[Number($(element).parents('li').attr('index'))].count
                item.products[Number($(element).parents('li').attr('index'))].count = count
            }
        })
    } else {
        countChange = spNhap[Number($(element).parents('li').attr('index'))].count
        spNhap[Number($(element).parents('li').attr('index'))].count = count
    }
    let countBill = 0
    spTrongKho.forEach(item => {
        if (item.code.toString().trim() == code) {
            item.products.forEach(item2 => {
                countBill += Number(item2.count)
            })
        }
    })
    spVay.forEach(item => {
        if (item.code.toString().trim() == code) {
            item.products.forEach(item2 => {
                countBill += Number(item2.count)
            })
        }
    })
    spNhap.forEach(item => {
        if (item.code.toString().trim() == code) {
            countBill += Number(item.count)
        }
    })
    if (typeBill==0){
        contract.productsStills.forEach(item => {
            if (item.code.toString().trim() == code) {
                if (Number(item.slConLai) < countBill) {
                    let elementInput = $(`ul.list-detail-stock[type="${type}"] li[code="${code}"]`).find('input')
                    $(elementInput).val(countChange)
                    changeCount(elementInput)
                }
            }
        })
    }
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

$(() => {
    $(document).on('keyup', '.count-product', function (e) {
        changeCount(this)
    });
    $('.save-bill').on('click', function () {
        let data = {spNhap, spVay, spTrongKho, spDaGiao}
        post(`/chinh-sua-so-luong-san-pham-don-hang/${billId}.html`, data, success => {
            if (success.error) {
                displayError(success.message);
            } else {
                displaySuccess(success.message);
                setTimeout(() => {
                    location.href = `/chi-tiet-don-hang/${billId}.html`;
                }, 2000);
            }
        }, error => {
            displayError(error.responseText);
        });
    })
    get(`/doi-chieu-san-pham-trong-kho-chinh-sua.html/${billId}`, {}, res => {
        if (res.error) {
            alert(res.message);
            setTimeout(() => {
                location.href = '/';
            }, 2000);
        } else {
            spTrongKho = res.data.spTrongKho
            spVay = res.data.spVay
            spNhap = res.data.spNhap
            spTrongKho.forEach(item => {
                item.products.forEach(item2 => {
                    item2.firstCount = item2.count
                })
            })
            let htmlSanPhamCoTrongKho = '';
            spTrongKho.forEach((codeProduct, i) => {
                let code = codeProduct.code;
                htmlSanPhamCoTrongKho += `<div class="item">
                        <b class="indexElement">${i + 1}</b>
                        <div class="name-stock">
                            ${codeProduct.info.name}
                        </div><ul class="list-detail-stock" type="0">`;

                codeProduct.products.forEach((p, index) => {
                    htmlSanPhamCoTrongKho += `<li class="sp-trong-kho" code='${code}' index='${index}'>
                                <div class="code-stock">
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td style="width: 40%;">Tên nhập kho:</td>
                                            <td>${p.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Lô:</td>
                                            <td>${p.stock.split("-")[0] || 'Không xác định'}</td>
                                        </tr>
                                        <tr>
                                            <td>Ngày hết hạn:</td>
                                            <td>${(p.dateExpire && p.dateExpire != '') ? moment(p.dateExpire).format('DD.MM.YYYY') : 'Không xác định'}</td>
                                        </tr>
                                        <tr>
                                            <td>Số lượng đã nhận:</td>
                                            <td>${p.countHouses}</td>
                                        </tr>
                                        <tr>
                                            <td>Số lượng có trong kho:</td>
                                            <td>${p.countHouses}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="amount-stock text-center">
                                    <p>Số lượng:</p>
                                    <div class="input-group">
                                        <div class="dec button-count" onclick="downCount(this)" >-</div>
                                        <input code="${p.code}" name="quant[2]" class="form-control input-number count-product" value="${p.count}" min="0" max="${p.countHouses}" type="text">
                                        <div class="inc button-count" onclick="upCount(this)">+</div>
                                    </div>
                                    <p class="message" style="color: red"></p>
                                </div>
                            </li>`;
                })

                htmlSanPhamCoTrongKho += `</ul></div>`;
            })
            if (htmlSanPhamCoTrongKho != '') $('#hangCoSanTrongKho').html(htmlSanPhamCoTrongKho);

            let htmlVay = '';
            spVay.forEach((p, i) => {
                htmlVay += `<div class="item">
                        <b class="indexElement">${i + 1}</b>
                        <div class="name-stock">
                            ${p.name}
                        </div>
                        <ul class="list-detail-stock" type="1">`;
                p.products.forEach((product, index) => {
                    htmlVay += `<li index="${index}" code="${p.code}">
                        <div class="code-stock">
                            <table>
                                <tbody>
                                <tr>
                                    <td style="width: 40%;">Vay Logistic:</td>
                                    <td>${product.logisticName}</td>
                                </tr>
                                <tr>
                                    <td>Email:</td>
                                    <td>${product.logisticEmail}</td>
                                </tr>
                                <tr>
                                    <td>Phone:</td>
                                    <td>${product.logisticPhone}</td>
                                </tr>
                                <tr>
                                    <td>Trạng thái:</td>
                                    <td style="color: ${product.status == 0 ? 'red' : product.status == 1 ? 'orange' : product.status == 2 ? 'green' : '#3b3b42'}" class="status" value="${product.status}">${product.status == 0 ? 'Chờ gửi lệnh vay' : product.status == 1 ? 'Đang gửi lệnh vay' : product.status == 2 ? 'Đã chấp nhận lệnh vay' : '---'}</td>
                                </tr>
                                <tr>
                                    <td style="width: 40%;">Lô:</td>
                                    <td>${(product.stock && product.stock != '' ? product.stock.split("-")[0] : 'Không xác định')}</td>
                                </tr>
                                <tr>
                                    <td>Ngày hết hạn:</td>
                                    <td>${(product.dateExpire && product.dateExpire != '' ? moment(Number(product.dateExpire)).format('DD.MM.YYYY') : 'Không xác định')}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="amount-stock text-center">
                            <p>Số lượng:</p>
                            <div class="input-group">
                                <div class="dec button-count" onclick="downCount(this)" >-</div>
                                <input code="${product.code}" name="quant[2]" class="form-control input-number count-product" value="${product.count}" min="0" max="${product.count}" type="text">
                                <div class="inc button-count" onclick="upCount(this)">+</div>
                            </div>
                            <p class="message" style="color: red"></p>
                        </div>
                    </li>`;
                })
                htmlVay += `</ul>
                    </div>`
            });
            if (htmlVay != '') $('#hangGuiVay').html(htmlVay);

            let htmlSanPhamNhap = '';
            spNhap.forEach((p, index) => {
                htmlSanPhamNhap += `<div class="item">
                        <b class="indexElement">${index + 1}</b>
                        <div class="name-stock">
                            ${p.name}
                        </div>
                        <ul class="list-detail-stock" type="2">
                            <li code="${p.code}" index="${index}">
                                <div class="code-stock">
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td style="width: 40%;">Mã sản phẩm:</td>
                                            <td class="code">${p.code}</td>
                                        </tr>
                                        <tr>
                                            <td>Ngày hết hạn</td>
                                            <td><strong class="countP">${moment(p.endDate).format('DD/MM/Y')}</strong></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="amount-stock text-center">
                                    <p>Số lượng:</p>
                                    <div class="input-group">
                                        <div class="dec button-count" onclick="downCount(this)" >-</div>
                                        <input code="${p.code}" name="quant[2]" class="form-control input-number count-product" value="${p.count}" min="0" max="1000" type="text">
                                        <div class="inc button-count" onclick="upCount(this)">+</div>
                                    </div>
                                    <p class="message" style="color: red"></p>
                                </div>
                            </li>
                        </ul>
                    </div>`;
            });
            if (htmlSanPhamNhap != '') $('#hangGuiNhaCungCap').html(htmlSanPhamNhap);

        }
    });

    get(`/danh-sach-san-pham-da-giao.html/${billId}`, {}, res => {
        if (!res.error) {
            spDaGiao = res.data.spDaGiao;
        }
    })
})