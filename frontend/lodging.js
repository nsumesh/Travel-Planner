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
        location: {
            latitude: 51.50988,
            longitude: -0.15509
        },
        adults: adultCount,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        roomQuantities: roomCount,
        priceRange: budget,
        currency: 'USD',
    };
    
    let radios = document.querySelectorAll('input[name="board"]');
    let room_type_list = ["ROOM_ONLY", "BREAKFAST", "HALF_BOARD", "FULL_BOARD", "ALL_INCLUSIVE"];
    for(let i in radios)
    {
        if(radios[i].checked)
        {
            package["board_type"] = room_type_list[i];
            break;
        }
    }

    console.log(package);

    let response = await fetch('/lodging-preferences', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(package)
    });
    console.log(response);
    let extracted = await response.json();
    console.log(extracted);
}

document.addEventListener("DOMContentLoaded", function() {
    let button = document.getElementById("find-lodging-button");
    button.addEventListener("click", (event) => getLodging(event));
});