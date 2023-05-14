// For lots of options in uber and lyft, I need to get possible locations: 
// airport to hotel, hotel to airport (leaving)
// hotel to restaurants (2-way)
// hotel to entertainments (2-way)



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
const lyftRideType = {
    "Lux": 4, 
    "Lux Black": 4, 
    "Lux XL": 6, 
    "Lux Black XL": 6,
    "Scooter": 1, 
    "Bikes": 1,
}

const filters = [
	filterBySeats,
    filterByPrice,

];

async function fetchRentalCars() {
    let package = {
        currency: 'USD',
        locale:"en-us",
        drop_off_latitude: localStorage.getItem("destination_latitude"), // airport or hotel location or user input??
        drop_off_longitude: localStorage.getItem("destination_longitude"), // airport or hotel location or user input??
        drop_off_datetime: "2023-06-30 16:00:00", // user input
        sort_by:"price_low_to_high", // user filter
        pick_up_latitude: localStorage.getItem("destination_latitude"), // destination airport location
        pick_up_longitude: localStorage.getItem("destination_longitude"), // destination airport location
        pick_up_datetime:"2023-06-29 16:00:00", // arrival date from flight or user input??
        from_country: "it", // get from flight destination
    };

    console.log(package);

    let response = await fetch('/rentalCar-preferences', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(package)
    });
    console.log(response.body);
    let extracted = await response.json();
	//sorted = extracted.sort((a, b) => parseFloat(a["offers"]["0"]["price"]["total"]) - parseFloat(b["offers"]["0"]["price"]["total"]));
    console.log(extracted);

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

async function fetchUberLyft() {
	
	let package = {
        "origin": {
            "latitude": Number(localStorage.getItem("destination_latitude")),
            "longitude": Number(localStorage.getItem("destination_longitude")), 
        },
        "destination": {
            "latitude": Number(localStorage.getItem("destination_latitude")), // need to change based on user inputs
            "longitude": Number(localStorage.getItem("destination_longitude")), // need to change based on user inputs
        }
    };
    let type = typeof package.origin.latitude;
    console.log(package)

	try 
	{
		let response = await fetch('/uberlyft-preferences', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify(package)
		});
		let extracted = await response.json();
        console.log(extracted);

        (extracted.Uber).map(el => el.splice(2, 0, "https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png") );
        (extracted.Lyft).map(el => el.push("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Lyft_logo.svg/2560px-Lyft_logo.svg.png"));

        if (document.getElementById("uber").checked && !(document.getElementById("lyft").checked)) {
            extracted = extracted.Uber;
        } else if (!(document.getElementById("uber").checked) && document.getElementById("lyft").checked) {
            extracted = extracted.Lyft;
        } else{
            extracted = (extracted.Uber).concat(extracted.Lyft);
        }

        //sorted = extracted.sort((a, b) => parseFloat(a["offers"]["0"]["price"]["total"]) - parseFloat(b["offers"]["0"]["price"]["total"]));

        console.log(extracted);
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


// function filterByAccessibility(){
//     let checkboxes = document.querySelectorAll('input[name="accessibility"]:checked'); 
//     let numSeat = [];
//     checkboxes.forEach((checkbox) => { numSeat.push(checkbox.value)})

//     return vehicle => {
//         if(Array.isArray(vehicle)){
//             return numSeat <= vehicle[2]
//         }
//         else{
//             return numSeat <= rentalCar["accessibility"]["seats"]
//         }
//     }
// }


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
            let min = (vehicle[1].includes("-"))?  Number(vehicle[1].split("-")[0].substring(1)) : Number(vehicle[1].split("$")[0]) 
            let max = (vehicle[1].includes("-"))? Number(vehicle[1].split("-")[1]): Number(localStorage.getItem("budget"))

            return values.min <= max <= values.max || values.min <= min <= values.max;
        }
        else{
            return values.min <= vehicle["pricing_info"]["price"] <= values.max
        }
    }
}

function formatDate(date) { 
    let elems = date.split("/");
    return elems[2] + "-" + elems[0] + "-" + elems[1];
}

function formatTime(time) {
    if (time.includes("PM")) {
        let elems = time.replace(" PM", "").split(":");
        elems[0] = (parseInt(elems[0]) + 12).toString(); 
        return elems[0] + ":" + elems[1] + ":00";
    } else if (time.includes("AM")) {
        time = time.replace(" AM", "");
        return time + ":00"
    }
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
            //container.addEventListener("click", () => selectLodging(listing));
            listing.classList.add("listing");
            container.appendChild(listing);
            listing.dataset.index = car.index;
            listing.style.display = "flex";
            listing.style.alignItems = "center";

            if (!Array.isArray(car)) {
                console.log(car);
                let icon = document.createElement("img");
                icon.src = car.vehicle_info.image_thumbnail_url;
                icon.width = 150
                icon.height = 100;
                listing.appendChild(icon);
                let label = document.createElement("div");
                label.innerHTML = car["vehicle_info"]["label"].replace(" with:", "") + " similar to " + car["vehicle_info"]["v_name"] + "<br>";
                label.style.fontSize = 'large';
                label.style.fontWeight = 'bold';
                listing.appendChild(label);
                let seats = document.createElement("div");
                seats.innerHTML = car["vehicle_info"]["seats"] + " seats" + "<br><br>"  + car["vehicle_info"]["mileage"].replace(" km", "") + " mileage" + "<br><br>" + car["vehicle_info"]["transmission"] + "<br>";
                listing.appendChild(seats);
                
                let price = document.createElement("div");
                price.innerHTML = "$" + car["pricing_info"]["price"] + "<br>";
                listing.appendChild(price);
            } else {
                let icon = document.createElement("img");
                icon.src = car[2];
                icon.width = 150
                icon.height = 100;
                listing.appendChild(icon);

                let label = document.createElement("div");
                label.innerHTML = car[0] + "<br>";
                label.style.fontSize = 'large';
                label.style.fontWeight = 'bold';
                listing.appendChild(label);

                let seats = document.createElement("div");
                seats.innerHTML = car[3] + " seats"+ "<br>";
                listing.appendChild(seats);
                

                let price = document.createElement("div");
                price.innerHTML = car[1] + "<br>";
                listing.appendChild(price);
            }

            return container;
        });

	if (elements.length > 0) {
		listings.replaceChildren(...elements);
	} else {
		listings.innerHTML = "No results found!";
	}
}

//console.log(formatTime('02:12 AM'))
document.addEventListener("DOMContentLoaded", function() {
    let button = document.getElementById("find-rides-button");
    button.addEventListener("click", async function() {
        document.getElementById("listings").innerText = "Loading listings...";

        console.log("GETTING DATA FROM RENTAL CAR API");
        rentalCarData = await fetchRentalCars();

        console.log("GETTING DATA FROM UBER/LYFT API"); 
        //debugger;
        uberLyftData = await fetchUberLyft();

    
        carData = merge(rentalCarData, uberLyftData);
        console.log(carData);

        carData.forEach((car, i) => car.index = i);


        // rentalCarData.forEach((rentalCar, i) => rentalCar.index = i);
        // uberLyftData.forEach((uberLyftCar, i) => uberLyftCar.index = i);
        debugger;
        await loadCars(parseInt(document.getElementById("budget").value));
    });
});