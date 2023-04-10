const filters = [
	getPricePredicate,
	getStopsPredicate
];

let flights = [];

fetchListings();
loadListings();
document.querySelectorAll(`#filters input`).forEach(element => element.addEventListener("change", loadListings));

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

function fetchListings() {
	//TODO Ishan - assign api output to flights variable
	
	flights = [];
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
			listing.classList.add("listing");
			container.appendChild(listing);
			listing.dataset.index = i;
			listing.appendChild(createAirlineIconElement(flight.validatingAirlineCodes[0].toLowerCase(), "height=60", "width=150"));
			let itinerary = flight.itineraries[0];
			let duration = formatDuration(itinerary.duration) + "<br>" + getAirlineName(flight);
			listing.appendChild(createGenericElement(duration, "div"));
			//TODO time
			//let time = 
			//listing.appendChild(createGenericElement(, "div"));
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