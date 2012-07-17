(function($) {
    
    var cm = {};
    cm.tr = function(chart) {
        if (!chart.id || !chart.name) return '';
        return '<tr><td>'+chart.name+'</td>\
                    <td><a href="/chart/edit/'+chart.id+'">Edit</a></td>\
                    <td><a href="/chart/view/'+chart.id+'">View</a></td>\
                    <td><a class="delete_chart" href="/chart/delete/'+chart.id+'">Delete</a></td>\
                    <td><label for="public_'+chart.id+'">Public?</label><input type="checkbox" id="public_'+chart.id+'" /></td>';
    }
    
    $('document').ready(function() {
        $('#chart_table').on('click', '.delete_chart', function(e) {
            var sure = confirm('Are you sure?');
            if (!sure) e.preventDefault();
        });
        
        $('#add_chart').on('submit', function(e) {
            e.preventDefault();
            var $name = $('#new_chart_name');
            if (!$name.val() || $name.val().trim() === '') {alert('Chart name is required'); return;}
            $.post('/chart/new', {name: $name.val()}, function(response) {
                $name.val('');
                var chart = $.parseJSON(response);
                $('#chart_table').append(cm.tr(chart));
            });
        });
    });
}(jQuery));