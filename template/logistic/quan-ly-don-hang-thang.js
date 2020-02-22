var billShows = bills
var currentPage = 1;
var itemsPerPage = 10;
var totalPages = Math.ceil(billShows.length / itemsPerPage)
var statusTable = 'all'
billShows.forEach(bill => {
    if (bill) {
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
    }
})

function renderTable() {
    let start = (currentPage - 1) * itemsPerPage;
    let end = currentPage * itemsPerPage - 1
    if (end > billShows.length - 1) {
        end = billShows.length - 1
    }
    let html = ''
    for (let i = start; i <= end; i++) {
        let bill = billShows[i];
        let color = '#fff';
        if (bill) {
            if (statusTable == 'all') {
                switch (bill.status) {
                    case 0:
                        color = '#dc3545';
                        break;
                    case 1:
                        color = '#17a2b8';
                        break;
                    case 2:
                        color = '#ffc107';
                        break;
                    case 3:
                        color = '#20c997';
                        break;
                }
            }
            let htmlDelete = `<td></td>`
            if ((userLogin.type == 0 || userLogin.type == 1) && bill.deleteBill ==1){
                htmlDelete = `
                <td style="text-align: center;"><a href="javascript:;" class="delete-bill edit">
                    <img src="/template/ui/images/xoa.svg" alt="">
                </a></td>
                `
            }
            html += `
                <tr id="${bill._id}">
                    <td>${i + 1}</td>
                    <td><a style="color: #0058b7; background: unset" href="/chi-tiet-don-hang/${bill._id}.html">${createMaDonHang(bill.name)}</a></td>
                    <td>${bill.khoaDatHang}</td>
                    <td><a style="color: #0058b7; background: unset" href="/chi-tiet-hop-dong.html?contractId=${bill.contractId}">${bill.contractName}</a></td>
                    <td>${moment(bill.createAt).format('HH:mm DD/MM/YYYY')}</td>
                    <td><a style="color: #0058b7; background: unset" href="/nguoi-dung-quan-ly-don-hang.html?userId=${bill.userId}">${bill.customerName}</a></td>
                    <td>${bill.typeT}</td>
                    <td style="background-color: ${color}">${bill.statusText}</td>
                    ${htmlDelete}
                </tr>
            `
        }
    }
    $('.table-logistic tbody').html(html);
    $('.logistic-pagination .result').text(`Hiển thị từ ${end < 0 ? 0 : start + 1} đến ${end + 1} trong tổng số ${billShows.length} kết quả`)
    renderPagination()
}

function renderPagination() {
    let min = 1;
    let max = 1
    let html = '';
    $(".pagination-bt .pagination-list").html('');
    html += '<li class="prev"><a href="javascript:;"><img src="/template/ui/images/back-pagination.svg" alt=""></a></li>'
    if (5 >= totalPages) {
        min = 1;
        max = totalPages
    } else if (Number(currentPage) + 2 > Number(totalPages)) {
        max = totalPages;
        min = totalPages - 4
    } else if (Number(currentPage) - 2 < 1) {
        min = 1;
        max = 5
    } else {
        min = Number(currentPage) - 2;
        max = Number(currentPage) + 2
    }
    if (min == 2) {
        html += `<li class="page" value="1"> <a href="#">1</a> </li>`
    }
    for (let i = min; i <= max; i++) {
        html += `<li class="page ${i == Number(currentPage) ? 'active' : ''}" value="${i}"> <a href="#">${i}</a> </li>`
    }
    if (max == totalPages - 2) {
        html += `<li class="page ${totalPages == Number(currentPage) ? 'active' : ''}"  value="${totalPages}"><a href="#" >${totalPages}</a></li>`
    }
    html += '<li class="next"><a href="javascript:;"><img src="/template/ui/images/next-pagination.svg" alt=""></a></li>'
    $('.pagination ul').html(html);
}

function changeStatus(status) {
    statusTable = status
    filterList()
}

$('#search-goods').on('change paste keyup', function () {
    filterList();
});

function filterList() {
    currentPage = 1;
    billShows = []
    if (statusTable == 'all') {
        billShows = bills
    } else {
        bills.forEach(bill => {
            if (bill.status == statusTable) {
                billShows.push(bill)
            }
        })
    }
    let key = removeUtf8($('#search-goods').val().trim())
    let dataBills = []
    billShows.forEach(item => {
        if (removeUtf8(item.khoaDatHang).includes(key) || removeUtf8(item.contractName).includes(key) || removeUtf8(item.customerName.toString()).includes(key) || removeUtf8(item.typeT.toString()).includes(key) || removeUtf8(item.name.toString()).includes(key)) {
            dataBills.push(item)
        }
    })
    billShows = dataBills
    totalPages = Math.ceil(billShows.length / itemsPerPage)
    renderTable()
}

$(() => {
    $(document).on('click', '.prev', function (e) {
        e.preventDefault()
        if (currentPage > 1) {
            currentPage = currentPage - 1;
            renderTable();
        }
    });
    $(document).on('click', '.next', function (e) {
        e.preventDefault()
        if (Number(currentPage) < Number(totalPages)) {
            currentPage = currentPage + 1;
            renderTable();
        }
    });
    $(document).on('click', '.page', function (e) {
        e.preventDefault();
        let page = e.currentTarget.value;
        currentPage = Number(page);
        renderTable();
    });

    $(document).on('click', '.delete-bill', function (e) {
        e.preventDefault();
        let id = $(this).parents('tr').attr('id')
        let conf = confirm('Bạn có chắc muốn xóa đơn hàng này?');
        if (conf) {
            get(`/delete-bill/${id}.html`, {}, (response) => {
                if (!response.error) {
                    location.reload()
                } else {
                    displayError(response.message);
                }
            })
        }
    });

    $(document).on('click', '.refresh', function (e) {
        window.location.reload()
    });
    renderTable()
    let countItem = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
    }
    for (let i = 0; i < bills.length; i++) {
        countItem[Number(bills[i].status)]++
    }
    for (let key in countItem) {
        $(`.menu-tab li[status="${key}"] .numb`).text(countItem[key])
    }
})