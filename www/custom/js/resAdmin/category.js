$(document).ready(function () {
    $("#submitForm").validate({
        validClass: "success",
        rules: {
            name:{
                required: true
            },
            order:{
                required: true,
                digits: true
            },
        },
        messages: {
            name:{
                required: langs('messages.field_required'),
            },
            order:{
                required: langs('messages.field_required'),
                digits: langs('messages.field_digits'),
            }
        },
        highlight: function(element) {
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
        },
        success: function(element) {
            $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
        },
    });
})
