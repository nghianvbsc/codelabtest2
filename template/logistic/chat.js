var historyChats = []
function renderListChat(){
    let html=''
    historyChats.forEach(item=>{
        html+=`
        <div class="chat-item" id=${item._id}>
            <div class="avatar">
                <img src="${item.userPicture}" alt="" onerror="this.src='/template/base-avatar.png'">
            </div>
            <div class="content-chat">
                <div class="name">
                    <strong>${item.userName}</strong>
                    <div class="date">
                        ${moment(item.createAt).format('HH:mm DD/MM/YYYY')}
                    </div>
                </div>
                <p><pre>${item.content}</pre></p>
            </div>
        </div>
    `
    })
    $('#list-chat').html(html)
    $("#list-chat").animate({
        scrollTop: $('#list-chat').get(0).scrollHeight
    }, 500);
}
$(() => {
    if (bill){
        $('#form-chat').on('submit',function(e){
            e.preventDefault();        
            if (userLogin && $(this).find('textarea').val().trim() != ''){
                socket.emit('realtime-chat', {to: bill._id, type: 'new-message', userId:userLogin._id, content:$(this).find('textarea').val()});
                $(this).find('textarea').val('')
            }
        })
        post(`/lay-lich-su-chat-theo-hoa-don.html`, {billId:bill._id}, success => {
            if (success.error) {
                displayError(success.message);
            } else {
                historyChats = success.data.historyChats
                renderListChat()
            }
        }, error => {
            displayError(error.responseText);
        });
        socket.on(bill._id, (data) => {
            if (data.type == 'new-message') {
                historyChats.push(data.chat)
                let html = `
                    <div class="chat-item" id=${data.chat._id}>
                        <div class="avatar">
                            <img src="${data.chat.userPicture}" alt="" onerror="this.src='/template/base-avatar.png'">
                        </div>
                        <div class="content-chat">
                            <div class="name">
                                <strong>${data.chat.userName}</strong>
                                <div class="date">
                                    ${moment(data.chat.createAt).format('HH:mm DD/MM/YYYY')}
                                </div>
                            </div>
                            <p><pre>${data.chat.content}</pre></p>
                        </div>
                    </div>
                `
                $('#list-chat').append(html)
                $("#list-chat").animate({
                    scrollTop: $('#list-chat').get(0).scrollHeight
                }, 500);
            }
        })
    }
})