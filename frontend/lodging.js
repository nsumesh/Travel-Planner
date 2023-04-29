async function amInit() {
	let token = null;
	return async () => {
        return token = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "grant_type=client_credentials&client_id=80B4rAGUjIF5uHUeOe6W2USRyUGFO0ug&client_secret=NILxAX1ZQT8v9WPP"
        })
        .then(response => response.json())
        .then(data => data.token_type + " " + data.access_token);
	};
}

async function getData(location) {
	
	const city = location;
    let a = await amInit();
    let token = await a();
    let locDetails = await fetch("https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=" + city, {headers: {'Authorization': token}});
    let body = await locDetails.json();
    let geo = body?.data?.[0]?.geoCode;
    let lines = { latitude: geo.latitude, longitude: geo.longitude };
    return lines;
}

async function getLodging(event)
{
    // prevents reload after search button click
    event.preventDefault();

    let destination = document.getElementById("destination").value;
    let checkIn = document.getElementById("check-in").value;
    let checkOut = document.getElementById("check-out").value;
    let budget = "-" + document.getElementById("budget").value;
    let adultCount = document.getElementById("adult-count").value;
    let roomCount = document.getElementById("room-count").value;
    
    let gridLines = await getData(destination);
	// console.log(gridLines);
	
	let package = {
        location: gridLines,
        adults: adultCount,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        roomQuantities: roomCount,
        priceRange: budget,
        currency: 'USD'
    };
    
    let radios = document.querySelectorAll('input[name="board"]');
    let room_type_list = ["ROOM_ONLY", "BREAKFAST", "HALF_BOARD", "FULL_BOARD", "ALL_INCLUSIVE"];
    for(let i in radios)
    {
        if(radios[i].checked)
        {
            package["board_type"] = room_type_list[i];
			console.log(room_type_list[i]);
            break;
        }
    }

    // console.log(package);

    let response = await fetch('/lodging-preferences', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(package)
    });
    let extracted = await response.json();
	// console.log(extracted);
	sorted = extracted.sort((a, b) => parseFloat(a["offers"]["0"]["price"]["total"]) - parseFloat(b["offers"]["0"]["price"]["total"]));
    console.log(sorted);
}

document.addEventListener("DOMContentLoaded", function() {
    let button = document.getElementById("find-lodging-button");
    button.addEventListener("click", (event) => getLodging(event));
});