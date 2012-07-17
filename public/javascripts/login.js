(function($, exports) {
    $('document').ready(function() {
        $('#login_form').submit(function(e) {
            var $uname = $('#login_user_name'), $pw = $('#login_password');
            e.preventDefault();
            $.post('./users/login', {u: $uname.val(), p: $.sha256($pw.val())}, function(response) {
                var result = $.parseJSON(response);
                if (result.status && result.status === 'success') window.location.href = "/charts";
                else alert(result.status);
                $uname.val(''); $pw.val('');
            });
        });
    });
}(jQuery, window));