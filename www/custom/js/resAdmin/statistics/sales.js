$('.datepicker').datetimepicker({
    format: 'DD/MM/YYYY',
});

$(document).ready(function () {
    $('[name="end_date"]').val(window.moment().format('DD/MM/YYYY'));
    $('[name="start_date"]').val(window.moment().subtract(1, 'months').add(1, 'days').format('DD/MM/YYYY'));

    refreshTable()
})

function refreshTable() {
    let from_date = $('#start_date').val();
    let arr = from_date.split("/")
    let start_date = arr[2] + "-" + arr[1] + "-" + arr[0]
    let to_date = $('#end_date').val();
    let spl = to_date.split("/")
    let end = spl[2] + "-" + spl[1] + "-" + spl[0]
    let end_date = moment(end).add(1,'days').format("YYYY-MM-DD");

    try {
        dt.destroy()
    } catch (e) {
    }
    dt = $('#dt_table').DataTable({
        ajax: {
            url: path_data,
            type: "POST",
            data: {start_date: start_date, end_date: end_date, _token: _token},
            dataSrc: ""
        },
        "pageLength": 10,
        "order": [[ 5, 'desc' ]],
        columns: [
            {"data": "id"},
            {"data": "table","render":function (data) {
                if (data)
                    return data.name;
                else
                    return ''
            }},
            {"data": "consumption"},
            {"data": "tip"},
            {"data": "shipping"},
            {"data": "created_at","render":function (data) {
                if (data)
                    return window.moment(data).format('YYYY-MM-DD');
                else
                    return ''
            }},
        ]
    });
}

$('#search').on('click', function () {
    refreshTable()
})

$('#export').on('click', function () {
    let from_date = $('#start_date').val();
    let arr = from_date.split("/")
    let start_date = arr[2] + "-" + arr[0] + "-" + arr[1]
    let to_date = $('#end_date').val();
    let spl = to_date.split("/")
    let end = spl[2] + "-" + spl[0] + "-" + spl[1]
    let end_date = moment(end).add(1,'days').format("YYYY-MM-DD");

    showLoading()
    let formData = new FormData();
    formData.append('start_date',start_date);
    formData.append('end_date',end_date);
    formData.append('_token',_token);
    $.ajax({
        url: path_export,
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response){
            hideLoading()
            if(response.status){
                var url = response.url;
                window.open(url,'_blank');
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
