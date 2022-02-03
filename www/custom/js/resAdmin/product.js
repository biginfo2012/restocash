$(document).ready(function () {
    $("#submitForm").validate({
        validClass: "success",
        rules: {
            name:{
                required: true
            },
            category_id:{
                required: true
            },
            purchase_price:{
                required: true,
                number: true,
                min: 0.1,
            },
            sale_price:{
                required: true,
                number: true,
                min: 0.1,
            },
        },
        messages: {
            name:{
                required: langs('messages.field_required'),
            },
            category_id:{
                required: langs('messages.field_required'),
            },
            purchase_price:{
                required: langs('messages.field_required'),
                number: langs('messages.input_valid_number'),
                min: langs('messages.input_greater_0')
            },
            sale_price:{
                required: langs('messages.field_required'),
                number: langs('messages.input_valid_number'),
                min: langs('messages.input_greater_0')
            },
        },
        highlight: function(element) {
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
        },
        success: function(element) {
            $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
        },
    });

    $("#image").on("change", function(){
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#preview').attr('src', e.target.result);
                $('#delete_image').val(0);
            }

            reader.readAsDataURL(this.files[0]);
        }
    })

    $('.btn-delete').on('click', function () {
        $('#delete_image').val(1);
        $('#preview').attr('src', '');
    })
})
