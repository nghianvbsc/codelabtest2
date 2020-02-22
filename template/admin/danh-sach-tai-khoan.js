var currentPage = 1;
var itemsPerPage = 10;
var totalPages = 0
var userShows = users

function renderTable() {
    let html = '';
    totalPages = Math.ceil(userShows.length / itemsPerPage)
    let start = (currentPage - 1) * itemsPerPage;
    let end = currentPage * itemsPerPage - 1
    if (end > userShows.length - 1) {
        end = userShows.length - 1
    }
    for (let i = start; i <= end; i++) {
        if (userShows[i]) {
            let user = userShows[i]
            let userParent = ''
            let userLink = `<td>${user.fullName}</td>`;
            let userName = `<td>${user.userName}</td>`;
            if (type == 7 && userLogin.type != 0) {
                userLink = `<td><a style="color: #0058b7; background: unset; width: auto; border: none;" href="/nguoi-dung-quan-ly-don-hang.html?userId=${user._id}">${user.fullName}</a></td>`;
            }
            if (type == 6) {
                userName = `<td><a style="color: #0058b7; background: unset; width: auto; border: none;" href="/danh-sach-tai-khoan.html?type=7&userCreateId=${user._id}">${user.userName}</a></td>`;
            }
            if (userLogin.type == 0 && [6, 7].includes(type)) {
                userLink = `<td><a style="color: #0058b7;background: unset; width: auto; border: none;" href="/thong-tin-khach-hang.html/${user._id}">${user.fullName}</a></td>`;
                if (type==7){
                    userParent = `<td><a style="color: #0058b7;background: unset; width: auto; border: none;" href="/danh-sach-tai-khoan.html?type=7&userCreateId=${user.userParent._id}">${user.userParent.fullName}</a></td>`;
                }
            }

            if (userLogin.type == 0 && [1].includes(type)) {
                userLink = `<td><a style="color: #0058b7; background: unset; width: auto;  border: none;" href="/thong-tin-logistic.html/${user._id}">${user.fullName}</a></td>`;
            }

            html += `
            <tr style="background: ${user.status == 1 ? '#fff' : 'oldlace'}">
                <td>${i + 1}</td>
                <td><img style="width: 50px; height: 50px; border-radius: 50%;" src="${user.picture}" onerror="this.src='/template/base-avatar.png'"></td>
                ${userName}
                ${userLink}
                ${userParent}
                <td>${user.phone}</td>
                <td>${user.email}</td>
                <td>${user.description}</td>
                <td>
                    <a href="/chinh-sua-tai-khoan/${user._id}.html" class="edit"><img src="/template/ui/images/edit.svg"
                                                                                alt=""></a>
                    <a href="javascript:;" class="${user.status == 1 ? 'lock' : 'unlock'}" userId="${user._id}"><img src="${user.status == 1 ? '/template/ui/images/lock.svg' : '/template/unlock.svg'}" alt=""></a>
                </td>
            </tr>
            `
        }
    }
    $('.table-logistic tbody').html(html);
    $('.logistic-pagination .result').text(`Hiển thị từ ${start + 1} đến ${end + 1} trong tổng số ${users.length} kết quả`)
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

function filterList() {
    currentPage = 1;
    let key = removeUtf8($('#key-search').val().trim())
    userShows = []
    users.forEach(user => {
        if ((user.fullName ? removeUtf8(user.fullName).includes(key) : false) || (user.userName ? removeUtf8(user.userName).includes(key) : false)
            || (user.email ? removeUtf8(user.email).includes(key) : false)
            || (user.description ? removeUtf8(user.description).includes(key) : false)
        ) {
            userShows.push(user)
        }
    })
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

    $(document).on('click', '.unlock', function (e) {
        e.preventDefault();
        let userId = $(this).attr('userId')
        $(this).removeClass('unlock')
        $(this).addClass('lock')
        $(this).find('img').attr('src', '/template/ui/images/lock.svg')
        get(`/mo-khoa-nguoi-dung/${userId}.html`, {}, (res) => {
            users.forEach(item => {
                if (item._id == userId) {
                    item.status = 1
                }
            })
            filterList()
        })
    });

    $(document).on('click', '.lock', function (e) {
        e.preventDefault();
        let userId = $(this).attr('userId')
        $(this).removeClass('lock')
        $(this).addClass('unlock')
        $(this).find('img').attr('src', '/template/unlock.svg')
        get(`/khoa-nguoi-dung/${userId}.html`, {}, (res) => {
            users.forEach(item => {
                if (item._id == userId) {
                    item.status = 2
                }
            })
            filterList()
        })
    });

    $(document).on('click', '.refresh', function (e) {
        window.location.reload()
    });
    renderTable()
})