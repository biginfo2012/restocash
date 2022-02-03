function showNewPassword() {
    if($("#change_password").is(':checked'))
        $(".new_password").show();
    else
        $(".new_password").hide();
}

$(document).ready(function () {
    showNewPassword()
    $(function () {
        $('.selectpicker').selectpicker();
    });
    var id = $('#id').val();
    if (id == 0){
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
                password:{
                    required:true
                },
                role:{
                    required: true
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
                password: {
                    required: langs('messages.field_required'),
                },
                role:{
                    required: langs('messages.field_required'),
                },
            },
            highlight: function(element) {
                $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
            },
            success: function(element) {
                $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
            },
        });
    }else{
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
                role:{
                    required: true
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
                role:{
                    required: langs('messages.field_required'),
                },
            },
            highlight: function(element) {
                $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
            },
            success: function(element) {
                $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
            },
        });
    }
})
