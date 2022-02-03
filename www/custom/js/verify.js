function checkCode() {
    let formData = new FormData();
    let code = $('#code').val();
    formData.append('code',code);
    formData.append('_token',_token);
    showLoading()
    $.ajax({
        url: path_verify,
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response){
            hideLoading()
            if(response.result){
                if(response.success)
                    location.href = path_home
                else{
                    $('.error-text').text(langs('messages.code_not_valid'))
                    $('.code-error').removeClass('d-none');
                }
            }else{
                $('.error-text').text('Server Error');
            }
        },
    });
}

function resendCode() {
    let formData = new FormData();
    formData.append('_token',_token);
    showLoading()
    $.ajax({
        url: path_resend,
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response){
            hideLoading()
            if(response.result){
                swal(langs('messages.resent_code'), {
                    icon: "success",
                    buttons : {
                        confirm : {
                            className: 'btn btn-black btn-round'
                        }
                    }
                });
            }else{
                swal(langs('messages.server_error'), {
                    icon: "error",
                    buttons : {
                        confirm : {
                            className: 'btn btn-danger'
                        }
                    }
                });
            }
        },
    });
}
