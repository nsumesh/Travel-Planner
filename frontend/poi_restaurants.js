const filters = [
	getPricePredicate,
	getRatingPredicate, 
    getTagPredicate,

];

let activities = [];


document.addEventListener("DOMContentLoaded", async function() {
    let button = document.getElementById("poi_search_button");
    button.addEventListener("click", async function() {
        document.getElementById("listings").innerText = "Loading listings...";
        

        let radius = document.querySelectorAll(`#filters input`)[0].valueAsNumber;

        ((radius != null && radius <= 20) ? Promise.resolve(radius) : Promise.resolve(5)).then(async rad => 
            {
                
                let entList = await fetchEntertainmentListings(rad);
                let restList = await fetchRestaurantListings();
				// let restList = [ "NONE" ];
                // Combining the two JSON data 
                let listing = {
                    "entertainment": entList,
                    "restaurants": restList
                };
                console.log(listing)
            }
        )

        //await loadActivties();
    });
});

function getPricePredicate() {
	
	let values = getDoubleRangeValues("price");
	if(!values.min)
    {
        values.min = 0;
    }
    if(!values.max)
    {
        values.max = budget;
    }
	return activity => values.min <= activity.price.grandTotal && activity.price.grandTotal <= values.max;
}

function getRatingPredicate() {
	
	let value = getRadioValue("rating");
	// if (value >= 2) {
	// 	return flight => true
	// }
	// return flight => value >= getNumberStops(flight.itineraries[0]);
}
function getTagPredicate() {
	
	let value = getDoubleRangeValues("tag");
	// if (value >= 2) {
	// 	return flight => true
	// }
	// return flight => value >= getNumberStops(flight.itineraries[0]);
}

//console.log(localStorage.getItem("destination").split(", ")[0])
async function fetchRestaurantListings() {
	
	let package = {
        language: "en_US",
        q: localStorage.getItem("destination").split(", ")[0]
    };

	try 
	{
		let response = await fetch('/restaurant-preferences', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify(package)
		});
		// return response;
		// console.log(response);
		let extracted = await response.json();
		// console.log(extracted);
        return extracted;
	}
	catch(error) 
	{
		console.error('ERROR IN FETCHING DATA: ', error);
	}
}

async function fetchEntertainmentListings(rad) {
	
	let package = {
        latitude: localStorage.getItem("destination_latitude"),
        longitude: localStorage.getItem("destination_longitude"), 
        radius: rad,
    };
    // console.log(package)

	try 
	{
		let response = await fetch('/entertainment-preferences', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify(package)
		});
		let extracted = await response.json();
		// console.log(extracted)
        return extracted; 
	} 
	catch(error) 
	{
		console.error('ERROR IN FETCHING DATA: ', error);
	}
}

function loadActivties(){
    return 0; 
}
// function selectActivity(listing) {
	
// 	let activity = activities[listing.dataset.index];
// 	localStorage.setItem("activity_name", ______);
// 	window.location.href="./cards.html";
// }

function formatDuration(raw) {
	
	return [...raw.matchAll(/\d+[A-Z]/g)].join(" ").toLowerCase();
}

function formatTime(time) {
	
	time = new Date(time);
	let hours = time.getHours();
	let suffix = hours >= 12 ? " PM" : " AM";
	hours = hours % 12;
	hours = hours ? hours : 12;
	let minutes = time.getMinutes();
	minutes = minutes < 10 ? "0" + minutes : minutes;
	return hours + ":" + minutes + suffix;
}

// function appendUnits(value, units) {
	
// 	let out = value + " " + units;
// 	if (value != 1) {
// 		out += "s";
// 	}
// 	return out;
// }



