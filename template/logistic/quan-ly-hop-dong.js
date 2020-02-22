var contractShows = contracts
var currentPage = 1;
var itemsPerPage = 100;
var statusTable = 0;
var totalPages = Math.ceil(contractShows.length / itemsPerPage)

function changeStatus(status) {
    statusTable = status
    filterList()
}

function renderTable() {
    let start = (currentPage - 1) * itemsPerPage;
    let end = currentPage * itemsPerPage - 1
    if (end > contractShows.length - 1) {
        end = contractShows.length - 1
    }

    let html = ''
    for (let i = start; i <= end; i++) {
        let contract = contractShows[i]
        if (userLogin.type == 1) {
            html += `
                <tr class="${contract.class}" id=${contract._id}>
                    <td>${i + 1}</td>
                    <td>${contract.numberContract}</td>
                    <td><a style="color: #0058b7;background: unset; width: auto;" href="/quan-ly-don-hang.html?contractId=${contract._id}">${contract.name}</a></td>
                    <td>${moment(contract.dateStart).format('DD/MM/YYYY')}</td>
                    <td>${moment(contract.dateEnd).format('DD/MM/YYYY')}</td>
                    <td>${contract.typeText}</td>
                    <td>${contract.typeContractText}</td>
                    <td>
                        <a href="/nhap-hop-dong.html?contractId=${contract._id}" class="edit"><img src="/template/ui/images/edit.svg"
                                                                                    alt=""></a>
                    </td>
                </tr>
                `
        } else {
            html += `
                <tr class="${contract.class}" id=${contract._id}>
                    <td>${i + 1}</td>
                    <td>${contract.numberContract}</td>
                    <td><a style="color: #0058b7;background: unset; width: auto;" href="/chi-tiet-hop-dong.html?contractId=${contract._id}">${contract.name}</a></td>
                    <td>${moment(contract.dateStart).format('DD/MM/YYYY')}</td>
                    <td>${moment(contract.dateEnd).format('DD/MM/YYYY')}</td>
                    <td>${contract.typeText}</td>
                    <td>${contract.typeContractText}</td>
                </tr>
                `
        }
    }
    $('.table-logistic tbody').html(html);
    $('.logistic-pagination .result').text(`Hiển thị từ ${end < 0 ? 0 : start + 1} đến ${end + 1} trong tổng số ${contractShows.length} kết quả`)
    renderPagination()
}

$('#search-goods').on('change paste keyup', function () {
    filterList();
});

$('#contractType').on('change', function () {
    filterList();
})

function filterList() {
    let key = removeUtf8($('#search-goods').val().trim())
    contractShows = [];
    currentPage = 1

    let contractShows1 = [];
    contracts.forEach(contract => {
        if (contract.status == statusTable) {
            contractShows1.push(contract)
        }
    })

    let contractType = $('#contractType').val().split(".");
    contractShows1.forEach(item => {
        if ((removeUtf8(item.numberContract).includes(key) || removeUtf8(item.name).includes(key) || removeUtf8(item.typeText).includes(key)) && contractType.includes(item.type+'')) {
            contractShows.push(item)
        }
    })
    renderTable();
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

    $(document).on('click', '.refresh', function (e) {
        window.location.reload()
    });


    contractShows = [];
    currentPage = 1;
    let countData = {
        0: 0,
        1: 0,
    }
    contracts.forEach(contract => {
        countData[contract.status]++;
        if (contract.status == statusTable) {
            contractShows.push(contract)
        }
    });
    for (let key in countData) {
        $(`.menu-tab li[status="${key}"] span`).text(countData[key]);
    }
    renderTable();
})