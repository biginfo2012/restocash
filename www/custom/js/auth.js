$("#loginForm").validate({
    validClass: "success",
    rules: {
        email: {required: true},
        password: {required: true}
    },
    messages: {
        email: {
            required: langs('messages.field_required'),
            email: langs('messages.email_format')
        },
        password: {
            required: langs('messages.field_required')
        }
    },
    highlight: function(element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    },
    success: function(element) {
        $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
    },
});

$("#registerForm").validate({
    validClass: "success",
    rules: {
        name: {required: true},
        email: {required: true},
        password: {required: true},
        password_confirmation: {required: true, equalTo: '#password'}
    },
    messages: {
        name: {
            required: langs('messages.field_required')
        },
        email: {
            required: langs('messages.field_required'),
            email: langs('messages.email_format')
        },
        password: {
            required: langs('messages.field_required')
        },
        password_confirmation: {
            required: langs('messages.field_required'),
            equalTo: langs('messages.password_not_equal')
        }
    },
    highlight: function(element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    },
    success: function(element) {
        $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
    },
});
