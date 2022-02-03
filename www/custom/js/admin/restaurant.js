$("#submitForm").validate({
    validClass: "success",
    rules: {
        restaurant_name:{
            required: true
        },
        tax_id:{
            required: true
        },
        owner_id:{
            required: true
        }
    },
    messages: {
        restaurant_name:{
            required: langs('messages.field_required'),
        },
        tax_id:{
            required: langs('messages.field_required'),
        },
        owner_id:{
            required: langs('messages.field_required'),
        }
    },
    highlight: function(element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    },
    success: function(element) {
        $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
    },
});

$(function () {
    $('.selectpicker').selectpicker();
    $('.select2').select2();
});
