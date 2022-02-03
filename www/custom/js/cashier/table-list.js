var tableId = 0;
$(document).on('click','.table-box', function () {
    tableId = $(this).data('index');
    let formData = new FormData();
    formData.append('_token',_token);
    formData.append('tableId',tableId);
    showLoading()
    $.ajax({
        url: path_table_info,
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response){
            hideLoading()
            if(response.result){
                let data = response.data;
                if(data.status == "closed"){
                    swal(langs('messages.no_orders_yet'), {
                        icon: "info",
                        buttons : {
                            confirm : {
                                className: 'btn btn-black'
                            }
                        }
                    })
                }else if(data.status == "open" || data.status == "pend"){
                    let orders = response.orders;
                    let code = '';
                    let total = 0;
                    for (let i=0; i<orders.length; i++){
                        let val = orders[i].product.sale_price * orders[i].order_count;
                        code += ' <div class="d-flex justify-content-between align-items-center mb-3"><div class="d-flex align-items-center">\n' +
                            '                                    <img class="order-image mr-2" src="' + orders[i].product.image + '">\n' +
                            '                                    <h4 class="text-danger mb-1">' + orders[i].product.name + '</h4></div>\n' +
                            '                                    <h4 class="mb-1">' + orders[i].product.sale_price + '*' + orders[i].order_count + '='+ val +'</h4>\n' +
                            '                                </div>'

                        total += val;
                    }
                    $('#assigned-orders').html(code);
                    $('#detail-total').html(total);
                    $('#detailModal').modal('show')
                }
            }else{
                swal(langs('messages.server_error'), {
                    icon: "error",
                    buttons : {
                        confirm : {
                            className: 'btn btn-danger'
                        }
                    }
                }).then((confirmed) => {
                    location.reload();
                });
            }
        },
    });
})

$(document).on('click','.btn-close', function () {
    swal({
        title: langs('messages.sure_delete'),
        text: langs('messages.table_will_close'),
        type: 'question',
        icon: 'warning',
        buttons:{
            confirm: {
                text : langs('messages.yes'),
                className : 'btn btn-black'
            },
            cancel: {
                visible: true,
                text : langs('messages.cancel'),
                className: 'btn'
            }
        }
    }).then((confirmed) => {
        if (confirmed){
            showLoading()
            let formData = new FormData();
            formData.append('tableId',tableId);
            formData.append('_token',_token);
            $.ajax({
                url: path_close_table,
                type: 'post',
                data: formData,
                contentType: false,
                processData: false,
                success: function(response){
                    hideLoading()
                    if(response.result){
                        $('#detailModal').modal('hide');
                        swal(langs('messages.success'), {
                            icon: "success",
                            buttons : {
                                confirm : {
                                    className: 'btn btn-success'
                                }
                            }
                        }).then((confirmed) => {
                            location.reload();
                        });
                    }else{
                        swal(langs('messages.server_error'), {
                            icon: "error",
                            buttons : {
                                confirm : {
                                    className: 'btn btn-danger'
                                }
                            }
                        }).then((confirmed) => {
                            location.reload();
                        });
                    }
                },
            });
        }
    });
})

$(document).on('click','.btn-report', function () {
    let formData = new FormData();
    formData.append('tableId',tableId);
    formData.append('_token',_token);
    showLoading()
    $.ajax({
        url: path_table_info,
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response){
            hideLoading()
            $('#detailModal').modal('hide');
            if(response.result){
                let data = response.data;
                $('#rut-name').html(data.restaurant.name)
                $('#current_time').html(window.moment().format('DD/MM/YYYY HH:mm'))
                let orders = response.orders;
                let code = '';
                let total = 0;
                for (let i=0; i<orders.length; i++){
                    let val = orders[i].product.sale_price * orders[i].order_count;
                    code += ' <div class="d-flex justify-content-between align-items-end mb-2">\n' +
                        '                                    <h4 class="mb-1">' + orders[i].product.name + '<br>$' + orders[i].product.sale_price + '*' + orders[i].order_count + '</h4>\n' +
                        '                                    <h4 class="mb-1">$'+ val +'</h4>\n' +
                        '                                </div>'

                    total += val;
                }
                $('#detail-list').html(code)
                $('#service').html(parseFloat(total * 0.1))
                $('#total').html(parseFloat(total * 0.1) + total)
                setTimeout(function(){$('#reportModal').modal('show');}, 500);
            }else{
                swal(langs('messages.server_error'), {
                    icon: "error",
                    buttons : {
                        confirm : {
                            className: 'btn btn-danger'
                        }
                    }
                }).then((confirmed) => {
                    location.reload();
                });
            }
        },
    });
})
