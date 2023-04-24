async function getLodging(event)
{
    // prevents reload after search button click
    event.preventDefault();

    let destination = document.getElementById("destination").value;
    let checkIn = document.getElementById("check-in").value;
    let checkOut = document.getElementById("check-out").value;
    let budget = document.getElementById("budget").value;
    let adultCount = document.getElementById("adult-count").value;
    let roomCount = document.getElementById("room-count").value;

    let package = {
        destination: destination,
        checkIn: checkIn,
        checkOut: checkOut,
        budget: budget,
        adultCount: adultCount,
        roomCount: roomCount
    };

    console.log(package);

    let response = await fetch('/lodging-preferences', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(package)
    });
    let extracted = await response.json();
    console.log(extracted);
}

document.addEventListener("DOMContentLoaded", function() {
    let button = document.getElementById("find-lodging-button");
    button.addEventListener("click", (event) => getLodging(event));
});