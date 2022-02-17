var tableId = 0;
let path_table_info = 'https://dev-restaurant.pagocash.cl/api/get-table-info';
let path_get_orders = '';
let path_create_orders = 'https://dev-restaurant.pagocash.cl/api/create-order';
let path_pend_table = 'https://dev-restaurant.pagocash.cl/api/pend-table';
let path_delete_order = 'https://dev-restaurant.pagocash.cl/api/delete-order';
let path_mark_deliver = 'https://dev-restaurant.pagocash.cl/api/deliver-order';
let path_save_comment = 'https://dev-restaurant.pagocash.cl/api/save-comment';

$('#btn-comment').click(function () {
    let comment = $('#comment').val();
    if (comment != '') {
        showLoading();
        $.ajax({
            url: path_save_comment,
            type: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {tableId: tableId, comment: comment},
            success: function (response) {
                hideLoading()
                if (response.message == 'success') {
                    let data = response.result.table;
                    if (data.status == "open" || data.status == "closed" || data.status == "ordered") {
                        let orders = response.result.orders;
                        generateOrderedList(data, orders)
                        $('.btn-pend').prop('disabled', false)
                        $('#comment').val('');
                    } else {
                        swal('Esperando mesa de cierre de caja.', {
                            icon: "info",
                            buttons: {
                                confirm: {
                                    className: 'btn btn-black'
                                }
                            }
                        })
                    }
                } else {
                    swal('El pedido aún no ha sido creado.', {
                        icon: "error",
                        buttons: {
                            confirm: {
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
$(document).on('click', '.table-box', function () {
    tableId = $(this).data('index');
    if (!$(this).find('.table-status').hasClass('bg-danger-gradient')) {
        showLoading()
        $.ajax({
            url: path_table_info,
            type: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {tableId: tableId},
            success: function (response) {
                hideLoading()
                if (response.message == 'success') {
                    let data = response.result.table;
                    if (data.status == "open" || data.status == "closed" || data.status == "ordered") {
                        let orders = response.result.orders;
                        generateOrderedList(data, orders)
                        checkCount()
                        checkDisable()
                        $('.btn-pend').prop('disabled', false)
                        $('#detailModal').modal('show');
                        $('.order_count').each(function () {
                            $(this).val(1);
                        })
                        $('#comment').val('');
                    } else {
                        swal('Esperando mesa de cierre de caja.', {
                            icon: "info",
                            buttons: {
                                confirm: {
                                    className: 'btn btn-black'
                                }
                            }
                        })
                    }
                } else {
                    swal('Error del Servidor', {
                        icon: "error",
                        buttons: {
                            confirm: {
                                className: 'btn btn-danger'
                            }
                        }
                    }).then((confirmed) => {
                        location.reload();
                    });
                }
            },
        });
    } else {
        var url = 'https://dev-restaurant.pagocash.cl/order-detail/' + tableId;
        console.log(url);
        $('#qrModal').modal('show');
        $('#qrcode').empty();
        var qrcode = new QRCode(document.getElementById("qrcode"), {
            text: url,
            width: 300,
            height: 300,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
})

function generateOrderedList(tableData, orders) {
    let code = '';
    let comment_code = '';
    let comment = ''
    let total = 0;
    console.log(orders);
    if (orders.length > 0) {
        $('#btn-comment')[0].disabled = false;
        code += '<div class="w-100 d-flex justify-content-end mb-2">'
        if (tableData.status == "ordered")
            code += '<button class="btn btn-black btn-round btn-deliver btn-sm mr-2"><i class="fa fa-check mr-2"></i>' + langs('messages.mark_as_deliver') + '</button>'
        code += '<button class="btn btn-danger btn-round btn-order-delete btn-sm">' + langs('messages.delete') + '</button></div>'
        for (let i = 0; i < orders.length; i++) {
            let val = orders[i].product.sale_price * orders[i].order_count;
            let delivered = orders[i].deliver_status == 1 ? '(Entregado)' : ''
            code += ' <div><div class="d-flex align-items-center mb-1">\n' +
                '                                    <input type="checkbox" name="orders_' + orders[i].id + '" class="orders mr-2" data-value="' + orders[i].id + '">' +
                '                                    <h4 class="text-danger mb-0">' + orders[i].product.name + delivered + '</h4></div>\n' +
                '                                    <h4 class="text-right mb-1">' + orders[i].product.sale_price + '*' + orders[i].order_count + '=' + val + '</h4>\n' +
                '                                </div>'
            if (orders[i].comment != null) {
                if (comment != orders[i].comment) {
                    comment = orders[i].comment;
                    comment_code += '<div><p style="margin-bottom: 0;">' + orders[i].comment + '</p></div>';
                }
            }
            total += val;
        }
    } else {
        $('#btn-comment')[0].disabled = true;
    }
    $('#assigned-orders').html(code);
    $('#comment_area').html(comment_code);
    $('#detail-total').html(total);
}

function getOrderList() {
    $.ajax({
        url: path_table_info,
        type: 'post',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {tableId: tableId},
        success: function (response) {
            if (response.message == 'success') {
                let data = response.result.table;
                let orders = response.result.orders;
                generateOrderedList(data, orders)
                checkCount()
                checkDisable()
            } else {
                $('#assigned-orders').html(langs('messages.server_error'));
            }
        },
    });
}

$(document).on('click', '.all', function () {
    var checked = $('input[name=select_all]:checked').val();
    checked = checked == "on" ? true : false;
    $('.items').each(function () {
        $(this).prop('checked', checked);
    })
    disableAssign()
})

function disableAssign() {
    let checked_count = 0;
    let total_count = 0;
    let total = 0;
    $('.items').each(function () {
        total_count++;
        let index = $(this).data('value');
        let checked = $('input[name=items_' + index + ']:checked').val();
        let price;
        let count;
        if (checked) {
            checked_count++;
            price = $(this).data('price')
            count = $(this).data('count')
            total += price * count;
        }
    })
    if (checked_count == 0) {
        $('.btn-assign').prop('disabled', true)
    } else {
        $('.btn-assign').prop('disabled', false)
    }

    //calculate total
    if (total_count > 0) {
        $('#total-price').html(total);
    }
}

$(document).on('click', '.items', function () {
    disableAssign()
})

$(document).on('click', '.btn-deliver', function () {
    let selected = [];
    $('.orders').each(function () {
        let index = $(this).data('value');
        let checked = $('input[name=orders_' + index + ']:checked').val();
        if (checked)
            selected.push(index)
    })
    showLoading()
    $.ajax({
        url: path_mark_deliver,
        type: 'post',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {tableId: tableId, orders: selected.toString()},
        success: function (response) {
            hideLoading()
            if (response.message == "success") {
                swal('Éxito', {
                    icon: "success",
                    buttons: {
                        confirm: {
                            className: 'btn btn-success'
                        }
                    }
                }).then((confirmed) => {
                    getOrderList();
                });
            } else {
                $('#detailModal').modal('hide');
                swal('Error del Servidor', {
                    icon: "error",
                    buttons: {
                        confirm: {
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

// //not use
// $(document).on('click','.btn-assign', function () {
//     showLoading()
//     let selected = [];
//     $('.items').each(function () {
//         let index = $(this).data('value');
//         let checked = $('input[name=items_'+index+']:checked').val();
//         if (checked)
//             selected.push(index)
//     })
//     let formData = new FormData();
//     formData.append('_token',_token);
//     formData.append('tableId',tableId);
//     formData.append('orders',selected.toString());
//     $.ajax({
//         url: path_assign_orders,
//         type: 'post',
//         data: formData,
//         contentType: false,
//         processData: false,
//         success: function(response){
//             hideLoading()
//             if(response.result){
//                 $('#existingModal').modal('hide');
//                 swal(langs('messages.success'), {
//                     icon: "success",
//                     buttons : {
//                         confirm : {
//                             className: 'btn btn-success'
//                         }
//                     }
//                 }).then((confirmed) => {
//                     location.reload();
//                 });
//             }else{
//                 swal(langs('messages.server_error'), {
//                     icon: "error",
//                     buttons : {
//                         confirm : {
//                             className: 'btn btn-danger'
//                         }
//                     }
//                 }).then((confirmed) => {
//                     location.reload();
//                 });
//             }
//         },
//     });
// })

$(document).on('click', '.minus-btn', function (e) {
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

$(document).on('click', '.plus-btn', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $input = $this.closest('div').find('input');
    var value = parseInt($input.val());
    value = value + 1;
    $input.val(value);
    checkCount()
});

function checkCount() {
    let new_total = 0;
    let count = 0;
    $('.order_count').each(function () {
        let val = $(this).val();
        if (val > 0) {
            count++;
            let price = $(this).data('price')
            new_total += val * price
        }
    })
    if (count > 0) {
        $('.btn-order').prop('disabled', false)
    } else {
        $('.btn-order').prop('disabled', true)
    }
    $('#new-total').html(new_total)
}

$(document).on('click', '.btn-order', function () {
    showLoading()
    let items = [];
    let id = $(this).prev().prev().data('value')
    let val = $(this).prev().prev().val()
    items[id] = val;
    let comment = '';
    $.ajax({
        url: path_create_orders,
        type: 'post',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {
            items: JSON.stringify(items),
            tableId: tableId,
            comment: comment
        },
        success: function (response) {
            hideLoading()
            if (response.message == "success") {
                $('#newModal').modal('hide');
                swal('Éxito', {
                    icon: "success",
                    buttons: {
                        confirm: {
                            className: 'btn btn-success'
                        }
                    }
                }).then((confirmed) => {
                    getOrderList();
                });
            } else {
                swal('Error del Servidor', {
                    icon: "error",
                    buttons: {
                        confirm: {
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

$(document).on('click', '.btn-pend', function () {
    swal({
        title: 'Estas seguro?',
        text: 'Estás realmente cerrando esta mesa?',
        type: 'question',
        icon: 'warning',
        buttons: {
            confirm: {
                text: 'Si',
                className: 'btn btn-black'
            },
            cancel: {
                visible: true,
                text: 'Cancelar',
                className: 'btn'
            }
        }
    }).then((confirmed) => {
        if (confirmed) {
            showLoading();
            $.ajax({
                url: path_pend_table,
                type: 'post',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    tableId: tableId,
                },
                success: function (response) {
                    hideLoading()
                    if (response.message == "success") {
                        $('#detailModal').modal('hide');
                        swal('Éxito', {
                            icon: "success",
                            buttons: {
                                confirm: {
                                    className: 'btn btn-success'
                                }
                            }
                        }).then((confirmed) => {
                            location.reload();
                        });
                    } else {
                        swal('Error del Servidor', {
                            icon: "error",
                            buttons: {
                                confirm: {
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

$(document).on('click', '.btn-print', function () {
    let selected = [];
    $('.orders').each(function () {
        let index = $(this).data('value');
        let checked = $('input[name=orders_' + index + ']:checked').val();
        if (checked)
            selected.push(index)
    })
    var items = selected.toString();
    var appened = selected.length > 0 ? "?items=" + items : ''
    var url = 'https://dev-restaurant.pagocash.cl/exportPdf/' + tableId + appened;
    console.log(url);
    $('#qrModal').modal('show');
    $('#qrcode').empty();
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: url,
        width: 300,
        height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
})


function checkDisable() {
    let checked_count = 0;
    $('.orders').each(function () {
        let index = $(this).data('value');
        let checked = $('input[name=orders_' + index + ']:checked').val();
        if (checked) {
            checked_count++;
        }
    })
    if (checked_count == 0) {
        $('.btn-order-delete').prop('disabled', true)
        $('.btn-deliver').prop('disabled', true)
    } else {
        $('.btn-order-delete').prop('disabled', false)
        $('.btn-deliver').prop('disabled', false)
    }
}

$(document).on('click', '.orders', function () {
    checkDisable()
})

$(document).on('click', '.btn-order-delete', function () {
    swal({
        title: 'Estas seguro?',
        text: 'Estos pedidos se eliminarán de forma permanente.',
        type: 'question',
        icon: 'warning',
        buttons: {
            confirm: {
                text: 'Si',
                className: 'btn btn-black'
            },
            cancel: {
                visible: true,
                text: 'Cancelar',
                className: 'btn'
            }
        }
    }).then((confirmed) => {
        if (confirmed) {
            showLoading();
            let selected = [];
            $('.orders').each(function () {
                let index = $(this).data('value');
                let checked = $('input[name=orders_' + index + ']:checked').val();
                if (checked)
                    selected.push(index)
            })
            $.ajax({
                url: path_delete_order,
                type: 'post',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    tableId: tableId,
                    orders: selected.toString()
                },
                success: function (response) {
                    hideLoading()
                    if (response.message == 'success') {
                        swal('Éxito', {
                            icon: "success",
                            buttons: {
                                confirm: {
                                    className: 'btn btn-success'
                                }
                            }
                        }).then((confirmed) => {
                            getOrderList();
                        });
                    } else {
                        $('#detailModal').modal('hide');
                        swal('Error del Servidor', {
                            icon: "error",
                            buttons: {
                                confirm: {
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
