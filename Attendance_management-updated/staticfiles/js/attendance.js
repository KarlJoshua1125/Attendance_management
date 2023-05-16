// Prepare data for the chart
var presentCount = attendanceData.filter(function(data) {
    return data.value === 'present';
  }).length;
  var lateCount = attendanceData.filter(function(data) {
    return data.value === 'late';
  }).length;
  var absentCount = attendanceData.filter(function(data) {
    return data.value === 'absent';
  }).length;

  var chartData = {
    labels: ['Present', 'Late', 'Absent'],
    datasets: [{
      data: [presentCount, lateCount, absentCount],
      backgroundColor: ['#28a745', '#ffc107', '#dc3545']
    }]
  };

  // Create the chart
  var ctx = document.getElementById('attendanceChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false, // Adjusts the chart size to fit its container
  legend: {
      position: 'bottom'
  }
    }
  });

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