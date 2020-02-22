$('#avatar-upload').on('change', () => {
    let image = $('#avatar-upload').prop('files')[0];
    let formData = new FormData();
    formData.append('avatar', $('#avatar-upload').prop('files')[0]);
    let reader = new FileReader();
    reader.onload = function (e) {
        $('#avatar-user').attr('src', e.target.result);
    };
    reader.readAsDataURL(image);
    ajaxFile('/thay-doi-anh-dai-dien.html', formData, (res) => {
    })
});