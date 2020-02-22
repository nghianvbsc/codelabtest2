$(function () {
    $('.baseFormRequest').on('submit',function(){
        let data = objectifyForm($(this).serializeArray());
        let method = $(this).attr('method').toLowerCase();
        let action = $(this).attr('action');
        let showE = $(this).attr('showE') || true;
        let showS = $(this).attr('showS') || true;
        let sRedirect = $(this).attr('sRedirect') || '';
        let eRedirect = $(this).attr('eRedirect') || '';

        switch (method) {
            case 'get':
                get(action, data, success => {
                    if (success.error) {
                        if (showE) displayError(success.message);

                        if (success.redirect) {
                            setTimeout(() => {
                                location.href = success.redirect;
                            }, 500);
                        } else if (eRedirect && eRedirect != '') {
                            setTimeout(() => {
                                location.href = eRedirect;
                            }, 500);
                        }
                    } else {
                        if (showS) displaySuccess(success.message);
                        if (success.redirect) {
                            setTimeout(() => {
                                location.href = success.redirect;
                            }, 500);
                        } else if (sRedirect && sRedirect != '') {
                            setTimeout(() => {
                                location.href = sRedirect;
                            }, 500);
                        }
                    }
                }, error => {
                    displayError(error.responseText);
                });
                break;
            case 'post':
                post(action, data, success => {
                    if (success.error) {
                        if (showE) displayError(success.message);
                        if (success.redirect) {
                            setTimeout(() => {
                                location.href = success.redirect;
                            }, 500);
                        } else if (eRedirect && eRedirect != '') {
                            setTimeout(() => {
                                location.href = eRedirect;
                            }, 500);
                        }
                    } else {
                        if (showS) displaySuccess(success.message);
                        if (success.redirect) {
                            setTimeout(() => {
                                location.href = success.redirect;
                            }, 500);
                        } else if (sRedirect && sRedirect != '') {
                            setTimeout(() => {
                                location.href = sRedirect;
                            }, 500);
                        }
                    }
                }, error => {
                    displayError(error.responseText);
                });
                break;
        }
        return false
    })

    if ($('.baseFormDataRequest')) $('.baseFormDataRequest').each(function () {
        let data = objectifyForm($(this).serializeArray());
        let formData = new FormData()
        for (let key in data) {
            formData.append(key, data[key]);
        }
        let arrs = document.querySelectorAll('.baseFormDataRequest input')
        arrs.forEach(item=>{
            formData.append(item.getAttribute('name'), item.files[0])
        })
        let action = $(this).attr('action');
        let showE = $(this).attr('showE') || true;
        let showS = $(this).attr('showS') || true;
        let sRedirect = $(this).attr('sRedirect') || '';
        let eRedirect = $(this).attr('eRedirect') || '';
        ajaxFile(action, formData, success => {
            if (success.error) {
                if (showE) displayError(error.responseText);
                if (success.redirect) {
                    setTimeout(() => {
                        location.href = success.redirect;
                    }, 500);
                } else if (eRedirect && eRedirect != '') {
                    setTimeout(() => {
                        location.href = eRedirect;
                    }, 500);
                }
            } else {
                if (showS) displaySuccess(success.message);
                if (success.redirect) {
                    setTimeout(() => {
                        location.href = success.redirect;
                    }, 500);
                } else if (sRedirect && sRedirect != '') {
                    setTimeout(() => {
                        location.href = sRedirect;
                    }, 500);
                }
            }
        }, error => {
            displayError(error.responseText);
        });
    })

    if ($('.buttonPostRequest')) $('.buttonPostRequest').each(function () {
        let method = $(this).attr('method').toLowerCase();
        let action = $(this).attr('action');
        let showE = $(this).attr('showE') || true;
        let showS = $(this).attr('showS') || true;
        let sRedirect = $(this).attr('sRedirect') || '';
        let eRedirect = $(this).attr('eRedirect') || '';
        let arrsAttrs = $(this).attr('url').spilit('|')
        let data={}
        for (let i=0;i< arrsAttrs.length;i++){
            data[arrsAttrs[i]]= $(this).attr(arrsAttrs[i])
        }
        switch (method) {
            case 'get':
                get(action, data, success => {
                    if (success.error) {
                        if (showE) displayError(success.message);

                        if (success.redirect) {
                            setTimeout(() => {
                                location.href = success.redirect;
                            }, 500);
                        } else if (eRedirect && eRedirect != '') {
                            setTimeout(() => {
                                location.href = eRedirect;
                            }, 500);
                        }
                    } else {
                        if (showS) displaySuccess(success.message);
                        if (success.redirect) {
                            setTimeout(() => {
                                location.href = success.redirect;
                            }, 500);
                        } else if (sRedirect && sRedirect != '') {
                            setTimeout(() => {
                                location.href = sRedirect;
                            }, 500);
                        }
                    }
                }, error => {
                    displayError(error.responseText);
                });
                break;
            case 'post':
                post(action, data, success => {
                    if (success.error) {
                        if (showE) displayError(error.responseText);
                        if (success.redirect) {
                            setTimeout(() => {
                                location.href = success.redirect;
                            }, 500);
                        } else if (eRedirect && eRedirect != '') {
                            setTimeout(() => {
                                location.href = eRedirect;
                            }, 500);
                        }
                    } else {
                        if (showS) displaySuccess(success.message);
                        if (success.redirect) {
                            setTimeout(() => {
                                location.href = success.redirect;
                            }, 500);
                        } else if (sRedirect && sRedirect != '') {
                            setTimeout(() => {
                                location.href = sRedirect;
                            }, 500);
                        }
                    }
                }, error => {
                    displayError(error.responseText);
                });
                break;
        }
    })
});