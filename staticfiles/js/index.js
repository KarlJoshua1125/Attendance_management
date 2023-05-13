
$(document).ready(function () {
    $( ".btn-lg" ).click(function() {
     $(this).toggleClass('btn-success');
     $(this).toggleClass('btn-danger'); // Add this line
});
    $('#sort-by-name-button').on('click', function() {
        var rows = $('#students-table tbody tr').get();
        rows.sort(function(row1, row2) {
            var lname1 = $(row1).data('lname');
            var lname2 = $(row2).data('lname');
            return lname1.localeCompare(lname2);
        });
        $.each(rows, function(index, row) {
            $('#students-table tbody').append(row);
        });
    });


// Remove the click event handler for the search button
$('#search-button').off('click');

$('#search-input').on('input', function() {
var searchTerm = $(this).val().toLowerCase();
$('#students-table tbody tr').each(function() {
var name = $(this).find('.lname').text().toLowerCase();
if (name.indexOf(searchTerm) === -1) {
$(this).hide();
} else {
$(this).show();
}
});
});

$('#clear-button').on('click', function() {
$('#search-input').val('');
$('#students-table tbody tr').show();
});

    $('#sort-button').on('click', function() {
        var $table = $('#students-table');
        var $tbody = $table.find('tbody');
        var $rows = $tbody.find('tr');
        $rows.sort(function(a, b) {
            var lnameA = $(a).find('.lname').text().toLowerCase();
            var lnameB = $(b).find('.lname').text().toLowerCase();
            if (lnameA < lnameB) return -1;
            if (lnameA > lnameB) return 1;
            return 0;
        });
        $tbody.html($rows);
      });

      $('#sort-buttonid').on('click', function() {
        var $table = $('#students-table');
        var $tbody = $table.find('tbody');
        var $rows = $tbody.find('tr');
        $rows.sort(function(a, b) {
            var idA = $(a).find('.id').text().toLowerCase();
            var idB = $(b).find('.id').text().toLowerCase();
            if (idA < idB) return -1;
            if (idA > idB) return 1;
            return 0;
        });
        $tbody.html($rows);
      });



    $('#add-student').on('submit', function (e) {
        e.preventDefault();

        var id = parseInt($('#id').val());
        var fname = $('#fname').val();
        var lname = $('#lname').val();
        var year = parseInt($('#year').val());
        var course = $('#course').val();

        database.ref('StudentsList').push({
            ID: id,
            FirstName: fname,
            LastName: lname,
            Year: year,
            Course: course
        }).then(function () {
            $('#exampleModal').modal('hide');
            location.reload();
        }).catch(function (error) {
            console.error(error);
        });
    });

    $('#add-student-btn').on('click', function () {
        $('#exampleModal').modal('show');
    });

    $('.edit-student').on('click', function (e) {
        e.preventDefault();

        var studentKey = $(this).data('key');

        database.ref('StudentsList').child(studentKey).once('value', function (snapshot) {
            var student = snapshot.val();

            $('#update-id').val(student.ID);
            $('#update-fname').val(student.FirstName);
            $('#update-lname').val(student.LastName);
            $('#update-year').val(student.Year);
            $('#update-course').val(student.Course);
            $('#update-student-key').val(studentKey);

            $('#update-student-modal').modal('show');
        });
    });

    $('#update-student-form').on('submit', function (e) {
        e.preventDefault();

        var id = parseInt($('#update-id').val());
        var fname = $('#update-fname').val();
        var lname = $('#update-lname').val();
        var year = parseInt($('#update-year').val());
        var course = $('#update-course').val();
        var key = $('#update-student-key').val();

        $.ajax({
            url: '/update_student/',
            type: 'POST',
            data: {
                'id': id,
                'fname': fname,
                'lname': lname,
                'year': year,
                'course': course,
                'key': key,
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (data) {
                if (data.status == 'success') {
                    $('#update-student-modal').modal('hide');
                    location.reload();
                } else {
                    alert(data.errors);
                }
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });
});
