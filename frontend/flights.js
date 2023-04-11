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
	
	let package = { 
		originLocationCode: localStorage.getItem("origin"),
		destinationLocationCode: localStorage.getItem("destination"),
		departureDate: localStorage.getItem("depart"),
		maxPrice: localStorage.getItem("budget"), //TODO price filter
		adults: localStorage.getItem("people"),
		currencyCode: 'USD',
	};

	// checks user's one-way choice in local storage
	if(localStorage.getItem("one-way") === "false") {
		package.returnDate = localStorage.getItem("return");
	}

	try {
		let response = await fetch('/initial-preferences', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify(package)
		});
		flights = await response.json();
		flights.forEach((flight, i) => flight.index = i);
	} catch(error) {
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
		.map((flight) => {
			let container = document.createElement("li");
			container.classList.add("listing-container");
			let listing = document.createElement("div");
			container.addEventListener("click", () => selectFlight(listing));
			listing.classList.add("listing");
			container.appendChild(listing);
			listing.dataset.index = flight.index;
			let iata = flight.validatingAirlineCodes[0].toLowerCase()
			listing.appendChild(createAirlineIconElement(iata, 150, 60));
			let itinerary = flight.itineraries[0];
			let duration = formatDuration(itinerary.duration) + "<br>" + getAirlineName(iata);
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
	localStorage.setItem("transportation_iata", flight.validatingAirlineCodes[0].toLowerCase());
	localStorage.setItem("transportation_name", formatFlightName(flight));
	localStorage.setItem("transportation_info", formatFlightInfo(flight));
	localStorage.setItem("transportation_price", flight.price.grandTotal);
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

function formatFlightName(flight) {
	
	let numbers = flight.itineraries[0].segments.map(seg => seg.number);
	numbers = (numbers.length > 1 ? " flights " :  " flight ") + numbers.join(", ");
	return getAirlineName(flight.validatingAirlineCodes[0]);
}

function formatFlightInfo(flight) {
	
	let itinerary = flight.itineraries[0];
	let segments = itinerary.segments;
	let stops = segments.slice(1).map(seg => seg.departure.iataCode);
	if (stops.length > 0) {
		stops = appendUnits(stops.length, "stop") + " in " + stops.join(", ");
	} else {
		stops = "Nonstop";
	}
	let time = formatTime(segments[0].departure.at) + " - " + formatTime(segments[segments.length - 1].arrival.at);
	let price = "$" + flight.price.grandTotal;
	return [time, stops, price].join("<br>");
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

function getAirlineName(iata) {
	
	return "TODO " + iata + " name";
}