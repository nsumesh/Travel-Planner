//Rental car preferences
// let preferences = {
        //   currency:"USD",
        //   locale:"en-us",
        //   drop_off_latitude:"50.08773",
        //   drop_off_longitude:"14.421133",
        //   sort_by:"price_low_to_high", 
        //   drop_off_datetime: "2023-06-30 16:00:00",
        //   pick_up_latitude:"50.08773",
        //   pick_up_longitude:"14.421133",
        //   pick_up_datetime:"2023-06-29 16:00:00",
        //   from_country: "it"
    // };

// let origin = document.getElementById('start-place');
// let destination = document.getElementById('end-place');
// let departDate = document.getElementById('depart-date');
// let returnDate = document.getElementById('return-date');
let rentalCarData = [];
let carData = [];
let uberLyftData = [];
let uberLyftHotel = [];
let uberLyftPOI = [];

let pickUpTime = document.getElementById('pick-up-time');
let dropOffTime = document.getElementById('drop-off-time');
//debugger;
// console.log(pickUpTime.value);
// console.log(dropOffTime.value);

// const uberRideType = {
//     "UberXL": 6, 
//     "SUV": 6, 
//     "Connect": 1, 
//     "Black SUV Hourly": 5,
//     "UberX Share": 1, 
//     default: 4, 
// }
let lyftRideType = {
    "Lyft": 4,
    "Lyft XL": 6,
    "Lux": 4, 
    "Lux Black": 4, 
    "Lux XL": 6, 
    "Lux Black XL": 6,
    "Scooter": 1, 
    "Bikes": 1,
}
let lyftType = Object.keys(lyftRideType)

let chosen = [];
if(localStorage.hasOwnProperty("chosenVehicle") && JSON.parse(localStorage.getItem("chosenVehicle")).length !== 0)
{
	chosen = JSON.parse(localStorage.getItem("chosenVehicle"));
}

const filters = [
	filterBySeats,
    filterByPrice,
];

async function fetchRentalCars() {
    //debugger;
    let package = {
        currency: 'USD',
        locale:"en-us",
        drop_off_latitude: localStorage.getItem("destination_latitude"), // airport or hotel location or user input??
        drop_off_longitude: localStorage.getItem("destination_longitude"), // airport or hotel location or user input??
        drop_off_datetime: document.getElementById("drop-off-date").value + " " + document.getElementById("drop-off-time").value + ":00", //"2023-06-30 16:00:00", // user input
        sort_by:"price_low_to_high", // user filter
        pick_up_latitude: localStorage.getItem("destination_latitude"), // destination airport location
        pick_up_longitude: localStorage.getItem("destination_longitude"), // destination airport location
        pick_up_datetime: document.getElementById("pick-up-date").value + " " + document.getElementById("pick-up-time").value + ":00", // arrival date from flight or user input??
        from_country: "it", // get from flight destination
    };

    console.log(package);
    //debugger;
    let response = await fetch('/rentalCar-preferences', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(package)
    })
    
    console.log(response.body);
    let extracted = await response.json();
    extracted = extracted.search_results;
	//sorted = extracted.sort((a, b) => parseFloat(a["offers"]["0"]["price"]["total"]) - parseFloat(b["offers"]["0"]["price"]["total"]));
    //console.log(extracted);

    return extracted;
}
// debugger;
// fetchRentalCars()



// let location = {
//     "origin": {
//         "latitude": 42.385150,
//         "longitude": -72.525290
//     },
//     "destination": {
//         "latitude": 42.039370,
//         "longitude": -72.613620
//     },
// }

// let preferences = {
//     "origin": {
//         "latitude": Number(localStorage.getItem("destination_latitude")),
//         "longitude": Number(localStorage.getItem("destination_longitude")), 
//     },
//     "destination": {
//         "latitude": Number(localStorage.getItem("destination_latitude")), // need to change based on user inputs
//         "longitude": Number(localStorage.getItem("destination_longitude")), // need to change based on user inputs
//     }
// };

async function fetchUberLyft(preferences) {

	
    let type = typeof preferences.origin.latitude;
    console.log(preferences)

	try 
	{
		let response = await fetch('/uberlyft-preferences', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify(preferences)
		});
		let extracted = await response.json();
        //console.log(extracted);

        if (extracted.Uber) {
            (extracted.Uber).map(el => el.push("https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png"));
        }
        if (extracted.Lyft) {
            (extracted.Lyft).map(el => {
                el.push((lyftType.includes(el[0])) ? lyftRideType[el[0]] : 4 )
                el.push("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Lyft_logo.svg/2560px-Lyft_logo.svg.png")       
            });
        }

        if (!(document.getElementById("uber").checked) && !(document.getElementById("lyft").checked)) {
            extracted = [];
        } else if (document.getElementById("uber").checked && !(document.getElementById("lyft").checked)) {
            extracted = extracted.Uber;
        } else if (!(document.getElementById("uber").checked) && document.getElementById("lyft").checked) {
            extracted = extracted.Lyft;
        } else {
            extracted = (extracted.Uber).concat(extracted.Lyft);
        }

        //console.log(extracted);
        return extracted; 
	} 
	catch(error) 
	{
		console.error('ERROR IN FETCHING DATA: ', error);
	}
}

// debugger;
// fetchUberLyft();

// price, sortby (low-high, recommend), type


function filterBySeats(){
    let numSeat = getRadioValue("seats"); 
    return vehicle => {
        if(Array.isArray(vehicle)){
            return numSeat <= vehicle[2]
        }
        else{
            return numSeat <= vehicle["vehicle_info"]["seats"]
        }
    }
}

function filterByPrice(){
    let values = getDoubleRangeValues("price");
    if(!values.min)
    {
        values.min = 0;
    }
    if(!values.max)
    {
        values.max = localStorage.getItem("budget");
    }

    return vehicle => {
        if(Array.isArray(vehicle)){
            let min = (vehicle[1].includes("-")) ? Number(vehicle[1].split("-")[0].substring(1)) : Number(vehicle[1].split("$")[1]);
            let max = (vehicle[1].includes("-")) ? Number(vehicle[1].split("-")[1]): Number(localStorage.getItem("budget"))

            return (values.min <= max && max <= values.max) || (values.min <= min && min <= values.max);
        }
        else{
            return (values.min <= vehicle["pricing_info"]["price"]) && (vehicle["pricing_info"]["price"] <= values.max)
        }
    }
}

function formatData(listing, src, labelHTML, seatsHTML, priceHTML) {
    let icon = document.createElement("img");
    icon.src = src;
    icon.width = 150
    icon.height = 100;
    listing.appendChild(icon);

    let label = document.createElement("div");
    label.innerHTML = labelHTML;
    label.style.fontSize = 'large';
    label.style.fontWeight = 'bold';
    listing.appendChild(label);

    let seats = document.createElement("div");
    seats.innerHTML = seatsHTML;
    listing.appendChild(seats);
    
    let price = document.createElement("div");
    price.innerHTML = priceHTML;
    listing.appendChild(price);
}


function merge(array1, array2) {
    result = [array1, array2]
        .reduce((res, cur) => (cur.forEach((cur, i) => (res[i] = res[i] || []).push(cur)), res), [])
        .reduce((a, b) => a.concat(b));
    return result;
}

async function loadCars(budget)
{
	let listings = document.querySelector("#listings");
	if (!listings) {
		return;
	}

    let elements = carData;
    let predicates = filters.map(supplier => supplier(budget));

    elements = elements.filter(car => predicates.every(p => p(car)))
        .map((car) => {
            let container = document.createElement("li");
            container.classList.add("listing-container");
            let listing = document.createElement("div");
            container.addEventListener("click", () => selectVehicle(listing));
            listing.classList.add("listing");
            container.appendChild(listing);
            listing.dataset.index = car.index;
            listing.style.display = "flex";
            listing.style.alignItems = "center";

            if (!Array.isArray(car)) { 
                formatData(listing,
                car.vehicle_info.image_thumbnail_url, car["vehicle_info"]["label"].replace(" with:", "") + " similar to " + car["vehicle_info"]["v_name"] + "<br>", 
                car["vehicle_info"]["seats"] + " seats" + "<br><br>"  + car["vehicle_info"]["mileage"].replace(" km", "") + " mileage" + "<br><br>" + car["vehicle_info"]["transmission"] + "<br>", 
                "$" + car["pricing_info"]["price"] + "<br>");             
            } else {
                formatData(listing, car[3], car[0] + "<br>", car[2] + " seats"+ "<br>", car[1] + "<br>");
            }
            return container;
        });

	if (elements.length > 0) {
		listings.replaceChildren(...elements);
	} else {
		listings.innerHTML = "No results found!";
	}
}

// only use this if you know localStorage.getItem("transportation_destination") exists
function airportGeoLoc(name) {
	
	return amadeusToken().then(token => fetch(`https://test.api.amadeus.com/v1/reference-data/locations/airports?sort=distance&latitude=${localStorage.getItem(name + "_latitude")}&longitude=${localStorage.getItem(name + "_longitude")}`, {headers: {'Authorization': token}}))
		.then(response => response.json())
		.then(body => (body?.data).find(item => item.iataCode === localStorage.getItem("transportation_destination"))?.geoCode)
}

async function selectVehicle(listing) {

    let vehicle = carData[listing.dataset.index];
	let price = vehicle.pricing_info?.price;
	if (!price) {
		if (vehicle[1]) {
			let range = vehicle[1].replace(/\$|\s/g, '').split('-').map(parseFloat);
			price = range.reduce((a, b) => a + b) / range.length;
		} else {
			price = 0;
		}
	}
	vehicle.price = price;
	localStorage.setItem("cars_price", price + parseFloat(localStorage.getItem("cars_price") ?? "0"));
    if (Array.isArray(vehicle) && !chosen.some(obj => (Array.isArray(obj) && obj.length !== 0) ? (obj[0] === vehicle[0] && obj[1] === vehicle[1]) : false))
            chosen.push(vehicle);
    if (!Array.isArray(vehicle) && !chosen.some(obj => (!Array.isArray(obj) && obj.length !== 0) ? (obj["vehicle_info"]["label"] === vehicle["vehicle_info"]["label"] && obj["pricing_info"]["price"] === vehicle["pricing_info"]["price"]) : false))
        chosen.push(vehicle);
    carData.splice(listing.dataset.index, 1);
    carData.forEach((listing, i) => listing.index = i);
	await loadCars(parseInt(document.getElementById("budget").value));
	loadStartData();
    
    //let vehicle = carData[listing.dataset.index];
    // console.log("VEHICLE"+vehicle);

    // console.log(localStorage.getItem("cars_name"));
    // console.log(localStorage.getItem("cars_price"));

    // var name = !!localStorage.getItem('cars_name') ? JSON.parse(localStorage.getItem('cars_name')) : [];
    // var price = !!localStorage.getItem('cars_price') ? JSON.parse(localStorage.getItem('cars_price')) : [];

    // if(){
    //     name.push(vehicle[0])
    //     price.push(vehicle[1])
    // }
    // else{
    //     name.push(vehicle["vehicle_info"]["label"].replace(" with:", "") + " similar to " + vehicle["vehicle_info"]["v_name"])
    //     price.push(vehicle["pricing_info"]["price"])
    // }

    // localStorage.setItem(addPage("name"), JSON.stringify(name))
    // localStorage.setItem(addPage("price"), JSON.stringify(price))
    // // else if(Array.isArray(vehicle) && localStorage.getItem("cars_name") == null){
    // //     localStorage.setItem(addPage("name"), [vehicle[0]])
    // //     localStorage.setItem(addPage("price"), [vehicle[1]])
    // // }

    // console.log(localStorage.getItem("cars_name"));
    // console.log(localStorage.getItem("cars_price"));

	//window.location.href="./cards.html";
}
function getMinDate(){
    return localStorage.getItem("depart-date")
}
function backUpdate()
{
	chosen.forEach((listing, i) => listing.index = i);
	localStorage.setItem("chosenVehicle", JSON.stringify(chosen));
}
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
}


document.addEventListener("DOMContentLoaded", function() {
    let button = document.getElementById("find-rides-button");
    button.addEventListener("click", async function() {
        let loading = '<img src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gifz" style="padding: 3.5em" alt="Loading listings..." width="50" height="50">'
        let element = createElementFromHTML(loading)
        document.getElementById("listings").replaceChildren(element)

        console.log("GETTING DATA FROM RENTAL CAR API");
        //debugger;
        if (document.getElementById("rental").checked) {
            console.log("GETTING DATA FROM RENTAL CAR API");
            rentalCarData = await fetchRentalCars();
        }

        console.log("GETTING DATA FROM UBER/LYFT API");

        let preferences = {
            "origin": {
                "latitude": Number(localStorage.getItem("destination_latitude")),
                "longitude": Number(localStorage.getItem("destination_longitude")), 
            },
            "destination": {
                "latitude": Number(localStorage.getItem("destination_latitude")), // need to change based on user inputs
                "longitude": Number(localStorage.getItem("destination_longitude")), // need to change based on user inputs
            }
        };

        //debugger;
        uberLyftData = await fetchUberLyft(preferences);

        if (localStorage.getItem("transportation_destination") !== null && localStorage.getItem("transportation_iata") !== null) {
            let airportLongLat = await airportGeoLoc("destination");
            //debugger;
            preferences.origin.latitude = Number(airportLongLat.latitude);
            preferences.origin.longitude = Number(airportLongLat.longitude);
            
            if (localStorage.getItem("lodging_latitude") !== null && localStorage.getItem("lodging_longitude") !== null) {
                preferences.destination.latitude = Number(localStorage.getItem("lodging_latitude"));
                preferences.destination.longitude = Number(localStorage.getItem("lodging_longitude"));

                uberLyftHotel = await fetchUberLyft(preferences);
            }

        }
        

        
        if (uberLyftHotel.length !== 0) {
            uberLyftData = uberLyftData.concat(uberLyftHotel)
        }
        
        if (rentalCarData.length !== 0 && uberLyftData.length !== 0) {
            carData = merge(rentalCarData, uberLyftData);
        } else if (rentalCarData.length === 0 && uberLyftData.length !== 0) {
            carData = uberLyftData;
        } else if (rentalCarData.length !== 0 && uberLyftData.length === 0) {
            carData = rentalCarData;
        }
        //debugger;
        carData.forEach((car, i) => car.index = i);

        await loadCars(parseInt(document.getElementById("budget").value));
    });
});