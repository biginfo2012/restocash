function showNewPassword() {
    if($("#change_password").is(':checked'))
        $(".new_password").show();
    else
        $(".new_password").hide();
}

$(document).ready(function () {
    showNewPassword()
    $("#submitForm").validate({
        validClass: "success",
        rules: {
            name:{
                required: true
            },
            email:{
                required:true,
                email:true
            },
            confirm_password:{
                equalTo: "#new_password"
            }
        },
        messages: {
            name:{
                required: langs('messages.field_required'),
            },
            email: {
                required: langs('messages.field_required'),
                email: langs('messages.email_format'),
            },
            confirm_password: {
                equalTo: langs('messages.password_not_equal'),
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
