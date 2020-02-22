var transportShows = transports
var currentPage = 1;
var itemsPerPage = 10;
var totalPages = Math.ceil(transportShows.length / itemsPerPage)
transportShows.forEach(transport=>{
    if (transport) {
        switch (transport.status) {
            case 3:
                transport.statusText = 'Chờ lấy hàng'
                break;
            case 4:
                transport.statusText = 'Đang vận chuyển'
                break;
            case 5:
                transport.statusText = 'Đã giao'
                break;
        }
    }
})
function renderTable() {
    let start = (currentPage - 1) * itemsPerPage;
    let end = currentPage * itemsPerPage - 1
    if (end > transportShows.length - 1) {
        end = transportShows.length - 1
    }
    let html = ''
    for (let i = start; i <= end; i++) {
        let transport = transportShows[i]
        if (transport) {
            html += `
                <tr ${transport._id}>
                    <td>${i + 1}</td>
                    <td><a style="color: #0058b7; background: unset" href="/chi-tiet-van-chuyen.html/${transport._id}">${createMaVanChuyen(transport.name)}</a></td>
                    <td>${moment(transport.time).format('HH:mm DD/MM/YYYY')}</td>
                    <td>${transport.address ? transport.address : ''}</td>
                    <td>${transport.note}</td>
                    <td>${transport.statusText}</td>
                </tr>
            `
        }
    }
    $('.table-logistic tbody').html(html);
    $('.logistic-pagination .result').text(`Hiển thị từ ${end < 0 ? 0 : start + 1} đến ${end + 1} trong tổng số ${transportShows.length} kết quả`)
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

$('#search-goods').on('change paste keyup', function () {
    filterList();
})

function filterList() {
    currentPage = 1;
    transportShows = transports
    let key = removeUtf8($('#search-goods').val())
    let dataBills = [];
    transportShows.forEach(item => {
        if (!item.address) item.address = '';
        if (removeUtf8(createMaVanChuyen(item.name)).includes(key) || removeUtf8(item.address.toString()).includes(key) || removeUtf8(item.statusText.toString()).includes(key) || removeUtf8(item.note.toString()).includes(key)) {
            dataBills.push(item)
        }
    })
    transportShows = dataBills
    totalPages = Math.ceil(transportShows.length / itemsPerPage)
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

    $(document).on('click', '.refresh', function (e) {
        window.location.reload()
    });
    renderTable()
})