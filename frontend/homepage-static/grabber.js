function grabPreferences() 
{
  let start = document.getElementById("start-place").value;
  let end = document.getElementById("end-place").value;
  let departDate = document.getElementById("depart-date").value;
  let adultCount = document.getElementById("adult-count").value;
  let maxAmount = document.getElementById("budget").value;
  
  let package = { 
    originLocationCode: start,
    destinationLocationCode: end,
    departureDate: departDate,
    adults: adultCount,
    currencyCode: 'USD',
    max: 25 // cap on number of results sent back
  };

  if(maxAmount != '')
  {
    package["maxPrice"] = maxAmount;
  }

  fetch('/initial-preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(package)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('ERROR IN FETCHING DATA: ', error);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  let button = document.getElementById("start-button");
  button.addEventListener("click", grabPreferences);
});