var products = []
var productShows;
var productCongNoShows;
var phuLucHopDong = ''
var nameFile = ''
var contractId = contract ? contract._id : '';
var productsCongNo = []

function renderTable(products) {
    $('.logistic-pagination .result.proudct-contract').text(`Hiển thị từ 1 đến ${products.length} kết quả`)
}

$('#search-goods').on('change paste keyup', function () {
    filterProduct();
})

function filterProduct() {
    let key = removeUtf8($('#search-goods').val().toString().trim())
    if (key == '') {
        productShows = products;
    } else {
        productShows = []
        products.forEach(item => {
            if (removeUtf8(item.code).includes(key) || removeUtf8(item.name).includes(key)) {
                productShows.push(item)
            }
        })
    }

    renderAllItemTable(productShows);
}

$('#search-goods2').on('change paste keyup', function () {
    filterProduct2();
})

function filterProduct2() {
    let key = removeUtf8($('#search-goods2').val().toString().trim())
    if (key == '') {
        productCongNoShows = productsCongNo;
    } else {
        productCongNoShows = []
        productsCongNo.forEach(item => {
            if (removeUtf8(item.code).includes(key) || removeUtf8(item.name).includes(key)) {
                productCongNoShows.push(item)
            }
        })
    }

    renderAllItemProductCongNo(productCongNoShows);
}

function renderAllItemTable(products) {
    let html = ''
    for (let i = 0; i < products.length; i++) {
        if (products[i]) {
            let product = products[i];
            let totalPrice = Number(product.count) * Number(product.price);
            let priceWithVAT = Number(totalPrice + totalPrice * Number(product.tax)).toFixed(3);
            html += `
            <tr id=${product._id}>
                <td>${i + 1}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.origin}</td>
                <td>${product.unit}</td>
                <td>${product.feature}</td>
                <td>${numberFormat(product.price)}</td>
                <td>${product.tax * 100}</td>
                <td>${product.count}</td>
                <td><span class="colorRed">${numberFormat(priceWithVAT)}</span></td>
            </tr>
            `
        }
    }
    $('#list-proudct-contract').html(html);
    renderTable(products)
}

function renderAllItemProductCongNo(dataCongNo) {
    let html = ''
    for (let i = 0; i < dataCongNo.length; i++) {
        if (dataCongNo[i]) {
            let product = dataCongNo[i]
            html += `
            <tr id=${product._id}>
                <td>${i + 1}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.unit}</td>
                <td>${product.slDaNhan}</td>
                <td>${product.count}</td>
            </tr>
            `
        }
    }
    $('#list-proudct-debt').html(html);
    $('.logistic-pagination .result.proudct-debt').text(`Hiển thị từ 1 đến ${dataCongNo.length} kết quả`)
}

$(function () {
    $(document).on('click', '.refresh', function (e) {
        window.location.reload()
    });

    $('.create-new-contract').on('click', function () {
        if (!contract && phuLucHopDong == '') {
            displayError('Cần gửi File danh mục hàng hoá');
            return;
        }
        let formData = new FormData()
        let data = objectifyForm($('#form-info-customer').serializeArray());
        if (data.userId == 'null') {
            displayError("Vui lòng chọn khách hàng");
            return;
        }
        data.phuLucHopDong = phuLucHopDong
        data.nameFile = nameFile
        data.contractId = contractId;
        for (let key in data) {
            formData.append(key, data[key])
        }
        if ($('#file-TBNA').prop("files")[0]) {
            formData.append("fileTBNA", $('#file-TBNA').prop("files")[0]);
        }
        if (data.type == -1) {
            displayError("Vui lòng chọn loại hợp đồng");
            return;
        }
        ajaxFile('/nhap-hop-dong.html', formData, success => {
            if (success.error) {
                displayError(success.message);
            } else {
                displaySuccess(success.message);
                setTimeout(() => {
                    window.location.replace('/danh-sach-hop-dong.html')
                }, 2000)
            }
        }, error => {
            displayError(error.responseText);
        });
    });

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
                    '<p style="text-align: left; padding-top: 20px">Chi tiết<hr>' + htmlWarning.join('') + '</p>',
                imageWidth: 50,
                imageHeight: 50,
                imageAlt: 'Custom image',
                confirmButtonText: 'Đồng ý',

            });
        }
    }

    $('#uploads-stock').on('change', function () {
        if (this.files[0]) {
            let file = this.files[0];
            $('#excelName').text(file.name);
            let formData = new FormData();
            formData.append("phuLucHopDong", file);
            ajaxFile('/gui-va-lay-du-lieu-hop-dong.html', formData, res => {
                if (res.error) {
                    displayError(res.message);
                } else {
                    products = res.data.products;

                    let trungMaSanPham = {};
                    products.forEach((item, i) => {
                        if (trungMaSanPham[item.code.toString().trim()]) {
                            trungMaSanPham[item.code.toString().trim()].push(i + 1)
                        } else {
                            trungMaSanPham[item.code.toString().trim()] = [i + 1]
                        }
                    });

                    kiemTraVaHienThiCanhBaoTrungMaSp(trungMaSanPham);

                    productShows = products
                    renderAllItemTable(productShows)
                    phuLucHopDong = res.data.filePath
                    nameFile = res.data.namePath
                }
            }, error => {
                displayError('Có lỗi, vui lòng thử lại');
            })
        } else {
            $('#excelName').text('');
        }
    })

    $('#file-TBNA').on('change', function () {
        if (this.files[0]) {
            let file = this.files[0];
            $('#docName').text(file.name);
        } else {
            $('#docName').text('');
        }
    })

    if (contract) {
        post('/lay-du-lieu-hop-dong.html', {pathFile: contract.files.path}, res => {
            if (res.error) {
                displayError(res.message);
            } else {
                products = res.data.products;
                productShows = products
                renderAllItemTable(productShows)
                if (contract.debt) {
                    products.forEach((product) => {
                        product.count = Number(product.count);
                        let slDaNhan = 0;
                        if (spDaDungTrongDonHangVC && spDaDungTrongDonHangVC[product.code]) {
                            slDaNhan += Number(spDaDungTrongDonHangVC[product.code]);
                        }

                        if (spDaDungTrongDonHangVCT && spDaDungTrongDonHangVCT[product.code]) {
                            slDaNhan += Number(spDaDungTrongDonHangVCT[product.code]);
                        }
                        let slConLai = Number(product.count) - slDaNhan;
                        if (slConLai < 0) {
                            productsCongNo.push({
                                ...product,
                                slDaNhan
                            })
                        }
                    });
                    renderAllItemProductCongNo(productsCongNo)
                }
            }
        }, error => {
            displayError('Có lỗi, vui lòng thử lại');
        })
    }
});