var products = []
var productShows;
var contract = null
var bills = []
var billShows

$('#search-goods').on('change paste keyup', function () {
    filterProduct();
})

function filterProduct() {
    let key = removeUtf8($('#search-goods').val()? $('#search-goods').val().toString().trim() : '')
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

$('#search-goods').on('change paste keyup', function () {
    filterBill();
})

function filterBill() {
    let key = removeUtf8($('#search-goods').val()? $('#search-goods').val().toString().trim():'')|| ''
    if (key == '') {
        billShows = bills;
    } else {
        billShows = []
        bills.forEach(item => {
            if (removeUtf8(item.code).includes(key) || removeUtf8(item.name).includes(key)) {
                billShows.push(item)
            }
        })
    }
    renderAllBillTable(billShows);
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
                <td><span class="colorRed fontWeight500">${numberFormat(product.price)}</span></td>
                <td>${product.origin}</td>
                <td>${product.category}</td>
                <td>${product.unit}</td>
                <td>${product.feature}</td>
                <td>${product.count}</td>
                <td>${product.slDaDat}</td>
                <td><span class="colorRed fontWeight500">${numberFormat(Number(product.slDaDat) * Number(product.price))}</span></td>
            </tr>
            `
        }
    }
    $('.table-logistic tbody.product').html(html);
    $('.logistic-pagination .result.product').text(`Hiển thị từ 1 đến ${productsData.length} kết quả`)
}

function renderAllBillTable(billsData) {
    let html = ''
    for (let i = 0; i < billsData.length; i++) {
        if (billsData[i]) {
            let bill = billsData[i]
            switch (bill.status) {
                case 0:
                    bill.statusText = 'Chờ xử lý'
                    break;
                case 1:
                    bill.statusText = 'Chờ khách hàng xác nhận'
                    break;
                case 2:
                    bill.statusText = 'Giao hàng'
                    break;
                case 3:
                    bill.statusText = 'Hoàn thành'
                    break;
            }
            html += `
            <tr>
                <td>${i + 1}</td>
                <td><a style="color: #0058b7; background: unset" href="/chi-tiet-don-hang/${bill._id}.html">${createMaDonHang(bill.name)}</a></td>
                <td>${moment(bill.createAt).format('HH:mm DD/MM/YYYY')}</td>
                <td>${bill.countProduct}</td>
                <td>${bill.statusText}</td>
            </tr>
    `
        }
    }
    $('.table-logistic tbody.bill').html(html);
    $('.logistic-pagination .result.bill').text(`Hiển thị từ 1 đến ${billsData.length} kết quả`)
}

function renderAllItemData() {
    $('.file-contract').html(`
    <img src="/template/ui/images/excel.svg" alt=""> ${contract.files.name}<a href="javascript:;"
                                            class="down-contract"><img
    src="/template/ui/images/download.svg" alt=""></a>
    `);
    $('.sub-title').html(`
    <a style="color: #0058b7; background: unset" href="/chi-tiet-hop-dong.html?contractId=${contract._id}" class="">${contract.numberContract}</a>
    `);
    post('/lay-du-lieu-da-dat-cua-user.html', {
        pathFile: contract.files.path,
        contractId: contract._id,
        userId: user._id
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
    post('/lay-danh-sach-don-hang-nguoi-dung.html', {contractId: contract._id, userId: user._id}, res => {
        if (res.error) {
            displayError(res.message);
        } else {
            bills = res.data.bills;
            filterBill()
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