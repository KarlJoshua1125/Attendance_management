
function addDateToURL(event) {
   event.preventDefault(); // prevent the link from redirecting immediately
   const link = event.target.closest('a'); // get the clicked link element
   const today = new Date().toISOString().slice(0, 10); // get the current date in yyyy-mm-dd format
   const url = new URL(link.href); // create a URL object using the href value of the link
   url.searchParams.set('date', today); // add the date query string parameter to the URL object
   window.location.href=url;// simulate a click on the link to redirect to the new URL
}