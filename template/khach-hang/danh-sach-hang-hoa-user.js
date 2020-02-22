var products = []
var productShows;
var contract = null

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

function renderAllItemTable(productsData) {
    let html = ''
    for (let i = 0; i < productsData.length; i++) {
        if (productsData[i]) {
            let product = productsData[i]
            html += `
            <tr id=${product._id}>
                <td>${i + 1}</td>
                <td><a class="colorBlue fontWeight500 textUnderline" href="javascript:;">${product.name}</a></td>
                <td><span class="colorRed fontWeight500">${numberFormat(product.price)}</span> đ</td>
                <td>${product.origin}</td>
                <td>${product.category}</td>
                <td>${product.unit}</td>
                <td>${product.feature}</td>
                <td>${product.count}</td>
                <td>${product.slDaDat}</td>
                <td><span class="colorRed fontWeight500">${numberFormat(Number(product.slDaDat) * Number(product.price))}</span> đ</td>
            </tr>
            `
        }
    }
    $('.table-logistic tbody').html(html);
    $('.logistic-pagination .result').text(`Hiển thị từ 1 đến ${productsData.length} kết quả`)
}

function renderAllItemData() {
    $('.file-contract').html(`
    <img src="/template/ui/images/excel.svg" alt=""> ${contract.files.name}
    <a href="javascript:;"src="/template/ui/images/download.svg" alt=""></a>
    `);
    post('/lay-du-lieu-da-dat-cua-user.html', {
        pathFile: contract.files.path,
        contractId: contract._id,
        userId: userOrder._id
    }, res => {
        if (res.error) {
            displayError(res.message);
        } else {
            products = res.data.productsDaDat;
            filterProduct()
        }
    }, error => {
        displayError('Có lỗi, vui lòng thử lại');
    })
}

$(function () {
    contract = contracts[0]
    $(document).on('click', '.refresh', function (e) {
        window.location.reload()
    });
    if (contract) {
        renderAllItemData()
    }
    $('#choose-contract').on('change', function () {
        contracts.forEach(item => {
            if (item._id == $(this).val()) {
                contract = item
            }
        })
        renderAllItemData()
    })
});