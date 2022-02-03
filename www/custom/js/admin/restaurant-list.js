$('#dt_table').DataTable({
    "pageLength": 10,
    "order": [[ 4, 'desc' ]]
});
function delRestaurant(id) {
    swal({
        title: langs('messages.sure_delete'),
        text: langs('messages.restaurant_will_delete'),
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
                className: 'btn btn-custom-error'
            }
        }
    }).then((confirmed) => {
        if (confirmed) {
            let formData = new FormData();
            formData.append('id',id);
            formData.append('_token',_token);
            $.ajax({
                url: path_delete,
                type: 'post',
                data: formData,
                contentType: false,
                processData: false,
                success: function(response){
                    if(response.result){
                        location.reload();
                    }else{
                        swal(langs('messages.delete_failed'), {
                            icon: "error",
                            buttons : {
                                confirm : {
                                    className: 'btn btn-custom-error'
                                }
                            }
                        });
                    }
                },
            });
        }
    });
}
