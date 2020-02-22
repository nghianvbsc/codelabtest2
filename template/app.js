function get(url, data, success, error) {
    $.ajax({
        url: url,
        data: data,
        type: 'get',
        success: function (response) {
            success(response);
        },
        error: function (err) {
            if (error) error(err);
        }
    })
}

function objectifyForm(formArray) {
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        let name = formArray[i]['name'];
        if (name.toLowerCase().includes('date') || name.toLowerCase().includes('birthday')
            || name.toLowerCase().includes('sendtime')) {

            if (formArray[i]['value'].includes(',')) {
                let valArr = formArray[i]['value'].split(',');
                let date = valArr[1].trim();
                let time = valArr[0].trim();

                let dateArr = date.split("/");
                formArray[i]['value'] = `${dateArr[1]}/${dateArr[0]}/${dateArr[2]}, ${time}`;
            } else {
                let val = formArray[i]['value'].split('/');
                formArray[i]['value'] = `${val[1]}/${val[0]}/${val[2]}`;
            }
        }

        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}

function getDateValue(input) {
    if (input && input.trim() != '') {
        if (input.includes('/')) {
            let val = input.split("/");
            return `${val[1]}/${val[0]}/${val[2]}`;
        } else if (input.includes('.')) {
            let val = input.split(".");
            return `${val[1]}/${val[0]}/${val[2]}`;
        }
    } else {
        return input;
    }
}

function formatDateInput(input) {
    if (input && input.trim() != '') {
        if (input.includes('/')) {
            let val = input.split("/");
            return `${val[2]}${val[1]}${val[0]}`;
        } else if (input.includes('.')) {
            let val = input.split(".");
            return `${val[2]}${val[1]}${val[0]}`;
        } else if (input.includes('-')){
            let val = input.split(".");
            return `${val[2]}${val[1]}${val[0]}`;
        } else {
            return input
        }
    } else {
        return input;
    }
}

function post(url, data, success, error) {
    $.ajax({
        url: url,
        data: data,
        type: 'post',
        success: function (response) {
            success(response);
        },
        error: function (err) {
            if (error) error(err);
        }
    })

}

function displayError(text) {
    // M.toast({html: text, classes: 'error-toast'});
    Swal.fire({
        position: 'top-end',
        type: 'error',
        title: text,
        showConfirmButton: false,
        timer: 1500
    })
}

function displayWarning(text) {
    M.toast({html: text, classes: 'warning-toast'});

}

function displaySuccess(text) {
    // M.toast({html: text, classes: 'success-toast'});
    Swal.fire({
        position: 'top-end',
        type: 'success',
        title: text,
        showConfirmButton: false,
        timer: 1500
    })
}


function ajaxFile(url, data, success, error) {
    $.ajax({
        url: url,
        data: data,
        type: 'post',
        processData: false,
        contentType: false,
        success: function (response) {
            success(response);
        },
        error: function (err) {
            error(err);
        }
    })
}

function numberFormat(number, fixLength = 0) {
    if (fixLength == null) {
        let stringNum = number + '';
        let arrInc = stringNum.split('.');
        let fixNum = 0;
        if (arrInc.length == 2) {
            fixNum = arrInc[1].length;
        }

        fixNum = fixNum > 3 ? 3 : fixNum;

        return (Number(number)).toLocaleString('en-US', {minimumFractionDigits: fixNum});
    } else {
        return (Number(number)).toLocaleString('en-US', {minimumFractionDigits: fixLength});
    }
}

$(document).ajaxStart(function () {
    showLoading();
});


$(document).ajaxComplete(function () {
    hideLoading();
});

$(document).ajaxStop(function () {
    hideLoading();
});

function showLoading() {
    $('#loadingView').show()
}

function hideLoading() {
    $('#loadingView').hide()
}

function randomStringFixLengthOnlyAlphabet(count) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < count; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

function copyToClipboard(elementId) {
    // Create a "hidden" input
    var aux = document.createElement("input");

    aux.setAttribute("value", $(elementId).val());
    // Append it to the body
    document.body.appendChild(aux);
    // Highlight its content
    aux.select();
    // Copy the highlighted text
    document.execCommand("copy");
    // Remove it from the body
    document.body.removeChild(aux);

}

function removeUtf8(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    // str = str.replace(/\W+/g, ' ');
    // str = str.replace(/\s/g, '-');
    // str = str.replace(/[^a-zA-Z0-9]/g, '_');

    // let max = 10;
    // for (let index = max; index >= 0; index--) {
    //     let inc_ = "";
    //     for (let index2 = 0; index2 <= index; index2++) {
    //         inc_ += "_";
    //     }
    //     str = str.replace(inc_, '_');
    // }
    return str;
};


function removeUtf8ReplaceAll(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    // str = str.replace(/\W+/g, ' ');
    str = str.replace(/\s/g, '-');
    str = str.replace(/[^a-zA-Z0-9]/g, '_');

    let max = 10;
    for (let index = max; index >= 0; index--) {
        let inc_ = "";
        for (let index2 = 0; index2 <= index; index2++) {
            inc_ += "_";
        }
        str = str.replace(inc_, '_');
    }
    return str;
};

$(function () {
    $('.refresh').on('click', function () {
        location.reload();
    })
})

function createMaDonHang(index) {
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'DH-' + index.substring(leftLength, index.length);
}

function createMaVayDonHang(index) {
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'VA.DH-' + index.substring(leftLength, index.length);
}

function createMaNhapHang(index) {
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'NH-' + index.substring(leftLength, index.length);
}

function createMaVanChuyen(index) {
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'VC-' + index.substring(leftLength, index.length);
}

function createMaHoaDon(type, index, indexHoaDon) {
    type = type == 1 ? 'GS' : 'VC'
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'HD.' + type + '-' + indexHoaDon + '' + index.substring(leftLength, index.length);
}

function createMaGiamSat(index) {
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'GS-' + index.substring(leftLength, index.length);
}

function createMaXuatKho(index) {
    if (!index) index = 1;
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'XK-' + index.substring(leftLength, index.length);
}

function createMaGiamSatXuatKho(index) {
    if (!index) index = 1;
    index = '0000000000000000000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return 'GS-XK-' + index.substring(leftLength, index.length);
}

function createIndexXuatKho(index) {
    if (!index) index = 1;
    index = '000000' + index;
    let maxLength = 5;
    let leftLength = index.length - maxLength;
    return index.substring(leftLength, index.length);
}

function hienThiSoTienBangChu(price) {
    let first = Math.round(Number(price)) + "";

    let firstFormat = numberFormat(first);
    let firstArr = firstFormat.split(".");
    let config3Name = {
        0: 'đồng',
        1: 'nghìn',
        2: 'triệu',
        3: 'tỉ',
    };

    let configText = {
        0: 'không',
        1: 'một',
        2: 'hai',
        3: 'ba',
        4: 'bốn',
        5: 'năm',
        6: 'sáu',
        7: 'bảy',
        8: 'tám',
        9: 'chín',
    };

    let nameTextArr = [];

    let indexName = 0;
    for (let i = firstArr.length - 1; i >= 0; i--) {
        let nameText = '';
        let boSoThu3 = false;
        let boSoThu2 = false;
        let indexCount = 0;
        for (let i2 = firstArr[i].length - 1; i2 >= 0; i2--) {
            nameText = nameText.trim();
            switch (indexCount) {
                case 0:
                    if (firstArr[i][i2] == '0') {
                        if (!firstArr[i][i2 - 1] || firstArr[i][i2 - 1] == '0' || firstArr[i][i2 - 1] == '1') {

                        } else {

                        }
                        boSoThu3 = true;
                    } else if (firstArr[i][i2] == '5') {
                        if (!firstArr[i][i2 - 1] || firstArr[i][i2 - 1] == '0') {
                            nameText = 'năm' + nameText;
                        } else {
                            nameText = 'lăm' + nameText;
                        }

                        boSoThu3 = false;
                    } else if (firstArr[i][i2] == '1') {
                        if (!firstArr[i][i2 - 1] || firstArr[i][i2 - 1] == '1' || firstArr[i][i2 - 1] == '0') {
                            nameText = 'một' + nameText;
                        } else {
                            nameText = 'mốt' + nameText;
                        }

                        boSoThu3 = false;
                    } else {
                        nameText = configText[firstArr[i][i2]] + nameText;
                        boSoThu3 = false;
                    }
                    break;
                case 1:
                    if (firstArr[i][i2] == '0') {
                        if (boSoThu3) {

                        } else {
                            nameText = 'lẻ ' + nameText;
                        }
                        boSoThu2 = true;
                    } else if (firstArr[i][i2] == '1') {
                        if (boSoThu3) {
                            nameText = 'mười ' + nameText
                        } else {
                            if (firstArr[i][i2 - 1]) {
                                nameText = 'mười ' + nameText
                            } else {
                                nameText = 'mười ' + nameText
                            }
                        }
                    } else {
                        nameText = configText[firstArr[i][i2]] + ' mươi ' + nameText
                    }

                    break;
                case 2:
                    nameText = configText[firstArr[i][i2]] + ' trăm ' + nameText;
                    break;
            }
            indexCount++;
            nameText = nameText.trim();
        }

        nameText = nameText + ' ' + config3Name[indexName];
        nameText = nameText.trim();
        nameTextArr.push(nameText);
        indexName++;
    }

    let newArr = [];
    for (let i = nameTextArr.length - 1; i >= 0; i--) {
        newArr.push(nameTextArr[i]);
    }
    let x = newArr.join(", ");
    return x.charAt(0).toUpperCase() + x.slice(1) + ' chẵn';
}
