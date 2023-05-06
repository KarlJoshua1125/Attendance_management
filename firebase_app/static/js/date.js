function redirectToAttendance() {
  // Get the current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().slice(0, 10);

  // Build the attendance page URL with the current date as a query parameter
  const attendanceUrl = "attendance/?date=" + currentDate;

  // Redirect the user to the attendance page
  window.location.href = attendanceUrl;
}