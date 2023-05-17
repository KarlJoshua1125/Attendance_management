
function resetData() {
    var confirmation = confirm("Are you sure you want to reset all data for the selected date? This action cannot be undone.");
    if (confirmation) {
      // Get the value of the date input field
      var dateInput = document.getElementById("date").value;
  
      // Reset the attendance data in the Firebase database for the selected date
      database.ref("Attendance/" + dateInput).remove()
        .then(function() {
          console.log("Data reset successful for " + dateInput);
          location.reload();
        })
        .catch(function(error) {
          console.log("Data reset failed for " + dateInput + ": " + error.message);
        });
    }
  }
  $(document).ready(function() {
    const form = $('#my-form');
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    $('#date').val(dateParam);
    $('#selectedDate').text(dateParam); // Set the selected date in the modal title

    $('#date').on('change', function() {
        createAttendanceRecord();
        form.submit();
    });
});