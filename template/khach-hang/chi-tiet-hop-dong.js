var products = []
var productShows;
var phuLucHopDong = ''
var nameFile = ''
var contractId = contract ? contract._id : ''
var productsCongNo = [];

function renderTable(products) {
    $('.logistic-pagination .result').text(`Hiển thị từ 1 đến ${products.length} kết quả`)
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

function renderAllItemTable(products) {
    let html = ''
    for (let i = 0; i < products.length; i++) {
        if (products[i]) {
            let product = products[i]
            html += `
            <tr id=${product._id}>
                <td>${i + 1}</td>
                <td>${product.name}</td>
                <td>${product.origin}</td>
                <td>${product.category}</td>
                <td>${product.unit}</td>
                <td>${product.feature}</td>
                <td>${numberFormat(product.price)}</td>
                <td>${product.tax * 100}</td>
                <td>${product.count}</td>
                <td>${product.countExport}</td>
                <td><span class="colorRed fontWeight500">${numberFormat(Number(product.count) * Number(product.price))}</span></td>
            </tr>
            `
        }
    }
    $('#list-product').html(html);
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
    if (contract) {
        post('/lay-du-lieu-hop-dong.html', {pathFile: contract.files.path}, res => {
            if (res.error) {
                displayError(res.message);
            } else {
                products = res.data.products;
                products.forEach((product) => {
                    product.count = Number(product.count);
                    let slDaNhan = 0;
                    if (spDaDungTrongDonHangVC && spDaDungTrongDonHangVC[product.code]) {
                        slDaNhan += Number(spDaDungTrongDonHangVC[product.code]);
                    }

                    if (spDaDungTrongDonHangVCT && spDaDungTrongDonHangVCT[product.code]) {
                        slDaNhan += Number(spDaDungTrongDonHangVCT[product.code]);
                        product.countExport+=slDaNhan
                    }
                    let slConLai = Number(product.count) - slDaNhan;
                    product.countExport=slDaNhan
                    if (slConLai < 0) {
                        productsCongNo.push({
                            ...product,
                            slDaNhan
                        })
                    }
                });
                productShows = products
                renderAllItemTable(productShows)
                if (productsCongNo.length>0) {
                    renderAllItemProductCongNo(productsCongNo)
                }
            }
        }, error => {
            displayError('Có lỗi, vui lòng thử lại');
        })
    }
});