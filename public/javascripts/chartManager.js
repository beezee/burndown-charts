(function($) {
    
    var cm = {};
    cm.tr = function(chart) {
        if (!chart.cuid || !chart.name) return '';
        return '<tr><td>'+chart.name+'</td>\
                    <td><a href="/chart/edit/"'+chart.cuid+'">Edit</a></td>\
                    <td><a href="/chart/view/"'+chart.cuid+'">View</a></td>\
                    <td><a href="/chart/delete/"'+chart.cuid+'">Delete</a></td>';
    }
    
    $('document').ready(function() {
        $('#chart_table').on('click', '.delete_chart', function(e) {
            var sure = confirm('Are you sure?');
            if (!sure) return;
            window.location.href = $(this).attr('href');
        });
        
        $('#add_chart').on('submit', function(e) {
            e.preventDefault();
            var $name = $('#new_chart_name');
            if (!$name.val() || $name.val().trim() === '') {alert('Chart name is required'); return;}
            $.post('/chart/new', {name: $name.val()}, function(response) {
                var chart = $.parseJSON(response);
                $('#chart_table').append(cm.tr(chart));
            });
        });
    });
}(jQuery));