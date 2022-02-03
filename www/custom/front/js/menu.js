$(document).ready(function () {
    checkCount()

    var toggler = document.getElementsByClassName("caret");
    var i;

    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");

            $(window).trigger('resize');
        });
    }
})

$('.minus-btn').on('click', function(e) {
    e.preventDefault();
    var $this = $(this);
    var $input = $this.closest('div').find('input');
    var value = parseInt($input.val());

    if (value > 1) {
        value = value - 1;
    } else {
        value = 0;
    }

    $input.val(value);
    checkCount()
});

$('.plus-btn').on('click', function(e) {
    e.preventDefault();
    var $this = $(this);
    var $input = $this.closest('div').find('input');
    var value = parseInt($input.val());

    value = value + 1;

    $input.val(value);
    checkCount()
});

function checkCount(){
    let count = 0;
    $('.order_count').each(function () {
        let val = $(this).val();
        if(val > 0){
            count ++;
        }
    })
    if (count > 0){
        $('.btn-order').prop('disabled', false)
    }else{
        $('.btn-order').prop('disabled', true)
    }
}

function checkOrderType(){
    var checked = $('input[name=orderType]:checked').val();
    if(checked == 0){
        $(".table-option").show();
    }else{
        $(".table-option").hide();
    }

    checkConfirmBtn()
}

$(document).on('click','#order', function () {
    $('#confirm-order').prop('disabled', true);
    checkOrderType();
    $('#verifyModal').modal('show');
})

$(document).on('click', '#send_code', function () {
    let email = $('#email').val();
    if(!email){
        swal({
            title: langs('messages.warning'),
            text: langs('messages.input_email'),
            type: 'question',
            icon: 'warning',
            buttons:{
                confirm: {
                    text : langs('messages.ok'),
                    className : 'btn btn-warning'
                }
            }
        })
        return;
    }

    showLoading();
    let formData = new FormData();
    formData.append('email',email);
    formData.append('_token',_token);
    $.ajax({
        url: path_mail,
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response){
            hideLoading()
            if(response.result){
                if(response.success){
                    swal(langs('messages.success'), {
                        icon: "success",
                        buttons : {
                            confirm : {
                                className: 'btn btn-success'
                            }
                        }
                    })
                }
                else{
                    swal(langs('messages.server_error'), {
                        icon: "error",
                        buttons : {
                            confirm : {
                                className: 'btn btn-danger'
                            }
                        }
                    });
                }
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
})

$(document).on('click','#confirm-order', function () {
    let items = [];
    $('.order_count').each(function () {
        let id = $(this).data('value');
        let val = $(this).val();
        if(val > 0){
            items[id] = val;
        }
    })

    let email = $('#email').val();
    let code = $('#v_code').val();
    let orderType = $('input[name=orderType]:checked').val();
    let tableId = $('#table').val();
    let comment = $('#comment').val();
    let formData = new FormData();
    formData.append('items',JSON.stringify(items));
    formData.append('email',email);
    formData.append('code',code);
    formData.append('orderType',orderType);
    formData.append('tableId',tableId);
    formData.append('comment',comment);
    formData.append('_token',_token);

    showLoading()
    $.ajax({
        url: path_order,
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response){
            hideLoading()
            if(response.result){
                if(response.success){
                    swal(langs('messages.success'), {
                        icon: "success",
                        buttons : {
                            confirm : {
                                className: 'btn btn-success'
                            }
                        }
                    }).then((confirmed) => {
                        if (confirmed) {
                            location.reload();
                        }
                    });
                }else if(response.error == "code_error"){
                    swal(langs('messages.verify_code_incorrect'), {
                        icon: "error",
                        buttons : {
                            confirm : {
                                className: 'btn btn-danger'
                            }
                        }
                    });
                }else if(response.error == "table_disable"){
                    swal(langs('messages.cannot_order_this_table'), {
                        icon: "error",
                        buttons : {
                            confirm : {
                                className: 'btn btn-danger'
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
})


function checkConfirmBtn() {
    let enable = 1;
    let email = $('#email').val();
    if (!email)
        enable = 0;
    let code = $('#v_code').val();
    if (!code)
        enable = 0;
    var checked = $('input[name=orderType]:checked').val();
    if(checked == 0){
        let t_option = $('#table').val();
        if (!t_option)
            enable = 0;
    }
    if (enable == 0)
        $('#confirm-order').prop('disabled', true)
    else
        $('#confirm-order').prop('disabled', false)
}
