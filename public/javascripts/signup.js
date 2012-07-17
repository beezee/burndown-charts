(function($, exports) {
    $('document').ready(function() {
        $('#signup_form').submit(function(e) {
            var $uname = $('#user_name'), $pw = $('#password');
            e.preventDefault();
            $.post('./users/new', {u: $uname.val(), p: $.sha256($pw)}, function(response) {
                var result = $.parseJSON(response);
                if (result.status && result.status === 'success') window.location.href = "/charts";
                else alert(result.status);
                $uname.val(''); $pw.val('');
            });
        });
    });
}(jQuery, window));