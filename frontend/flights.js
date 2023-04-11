const filters = [
	getPricePredicate,
	getStopsPredicate
];

let flights = [];
let carrierDetails = {};

async function main() 
{
	await fetchListings();
	console.log(flights);
	console.log(carrierDetails);
	loadListings();
	document.querySelectorAll(`#filters input`).forEach(element => element.addEventListener("change", loadListings));
}

main();

function getPricePredicate() {
	
	let values = getDoubleRangeValues("price");
	return flight => values.min <= flight.price.grandTotal && flight.price.grandTotal <= values.max;
}

function getStopsPredicate() {
	
	let value = getRadioValue("stops");
	if (value >= 2) {
		return flight => true
	}
	return flight => value >= getNumberStops(flight.itineraries[0]);
}

async function fetchListings() {
	let start = document.getElementById("start-place").value;
	let end = document.getElementById("end-place").value;
	let departDate = document.getElementById("depart-date").value;
	let returnDate = document.getElementById("return-date").value;
	let maxAmount = document.getElementById("budget").value;
	let adultCount = document.getElementById("adult-count").value;
	
	let package = { 
		originLocationCode: start,
		destinationLocationCode: end,
		departureDate: departDate,
		maxPrice: maxAmount,
		adults: adultCount,
		currencyCode: 'USD',
	};

	// checks user's one-way choice in local storage
	if(localStorage.getItem("one-way") === "false")
	{
		package["returnDate"] = returnDate;
	}

	try
	{
		let response = await fetch('/initial-preferences', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify(package)
		});
		let extracted = await response.json();
		flights = extracted["result"]["data"].sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
		carrierDetails = extracted["result"]["dictionaries"]["carriers"];
	}
	catch(error)
	{
		console.error('ERROR IN FETCHING DATA: ', error);
	}
}

function loadListings() {
	
	let listings = document.querySelector("#listings");
	if (!listings) {
		return;
	}
	let predicates = filters.map(supplier => supplier());
	let newListings = flights.filter(flight => predicates.every(p => p(flight)))
		.map((flight, i) => {
			let container = document.createElement("li");
			container.classList.add("listing-container");
			let listing = document.createElement("div");
			container.addEventListener("click", () => selectFlight(listing));
			listing.classList.add("listing");
			container.appendChild(listing);
			listing.dataset.index = i;
			listing.appendChild(createAirlineIconElement(flight.validatingAirlineCodes[0].toLowerCase(), "height=60", "width=150"));
			let itinerary = flight.itineraries[0];
			let duration = formatDuration(itinerary.duration) + "<br>" + getAirlineName(flight);
			listing.appendChild(createGenericElement(duration, "div"));
			let time = itinerary.segments.map(seg => formatTime(seg.departure.at) + " - " + formatTime(seg.arrival.at)).join("<br>");
			listing.appendChild(createGenericElement(time, "div"));
			listing.appendChild(createGenericElement(appendUnits(getNumberStops(itinerary), "stop"), "div"));
			let price = "$" + flight.price.grandTotal + "<br>" + (flight.oneWay ? "one way" : "round trip");
			listing.appendChild(createGenericElement(price, "div"));
			return container;
		});
	if (newListings.length > 0) {
		listings.replaceChildren(...newListings);
	} else {
		listings.innerHTML = "No results found!";
	}
}

function selectFlight(listing) {
	
	let flight = flights[listing.dataset.index];
	localStorage.transportation_iata = flight.validatingAirlineCodes[0].toLowerCase();
	localStorage.transportation_name = getAirlineName(flight);
	localStorage.transportation_info = "TODO info";
	window.location.href="./cards.html"; //TODO change once attached to backend
}

function formatDuration(raw) {
	
	let hours = parseInt(raw.match(/(\d+)H/)[1]);
	let minutes = parseInt(raw.match(/(\d+)M/)[1]);
	let days = raw.match(/(\d+)D/);
	if (days) {
		hours += 24 * parseInt(days[1]);
	}
	return `${hours}h ${minutes}m`;
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

function getAirlineName(flight) {
	
	return "TODO airline name";
}

function getNumberStops(itinerary) {
	
	return itinerary.segments.reduce((acc, curr) => acc + curr.numberOfStops + 1, 0) - 1;
}

function appendUnits(value, units) {
	
	let out = value + " " + units;
	if (value != 1) {
		out += "s";
	}
	return out;
}