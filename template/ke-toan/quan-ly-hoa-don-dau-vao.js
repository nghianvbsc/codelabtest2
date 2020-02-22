var billEntries =[];
var billEntriesShows = []
$(() => {
    let currentPage = 1;
    let itemsPerPage = 10;
    let totalPages = Math.ceil(billEntries.length/itemsPerPage)

    $(document).on('click', '.prev', function (e) {
        e.preventDefault()
        if (currentPage > 1) {
            currentPage = currentPage - 1;
            renderTable();
        }
    });
    $(document).on('click', '.first', function (e) {
        e.preventDefault()
        currentPage = 1;
        renderTable();
    });
    $(document).on('click', '.last', function (e) {
        e.preventDefault()
        currentPage = totalPages;
        renderTable();
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
        currentPage = page;
        renderTable();
    });

    function renderTable(page) {
        let html = '';
        let start = (page - 1) * itemsPerPage;
        let end = page * itemsPerPage -1
        if (end > billEntriesShows.length - 1) {
            end = billEntriesShows.length
        }
        for (let i=start; i <= end; i++){
            if (billEntriesShows[i]){
                html+=``
            }
        }
        $('.table').html(html);
        $('.pagination-bt .sort-number').text(`Hiển thị từ ${start+1} đến ${end+1} trong tổng số ${billEntriesShows.length} kết quả`)
        renderPagination()
    }

    function renderPagination() {
        let min = 1;
        let max = 1
        let html = '';
        $(".pagination-bt .pagination-list").html('');
        html += '<li class="first"><a href="#" name="start"><img src="/template/public/images/icon/ca-nhan-previous-all.svg" alt=""></a></li>'
        html += '<li class="prev"><a href="#" name="prev"><img src="/template/public/images/icon/ca-nhan-previous.svg" alt=""></a></li>'
        if (7 >= totalPages) {
            min = 1;
            max = totalPages
        } else if (Number(currentPage) + 4 > Number(totalPages)) {
            max = totalPages;
            min = totalPages - 8
        } else if (Number(currentPage) - 4 < 1) {
            min = 1;
            max = 9
        } else {
            min = Number(currentPage) - 4;
            max = Number(currentPage) + 4
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
        html += '<li class="next"><a href="#" name="next"><img src="/template/public/images/icon/ca-nhan-next.svg" alt=""></a></li>'
        html += '<li class="last"><a href="#" name="end"><img src="/template/public/images/icon/ca-nhan-end.svg" alt=""></a></li>'
        $('.pagination-bt .pagination-list').html(html);
    }
})