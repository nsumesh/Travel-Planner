filters = [
	{
		name: "price",
		getter: getDoubleRangeValues,
		predicate: (data, values) => values.min <= data.price.grandTotal && data.price.grandTotal <= values.max
	},
	{
		name: "stops",
		getter: getRadioIndex,
		predicate: (data, value) => value >= 2 || value > data.itineraries.reduce((acc, curr) => acc + curr.numberOfStops + 1, 0) - 1
	}
];

function getDoubleRangeValues(name) {
	
	return; //TODO
}

function getRadioValue(name) {
	
	return document.querySelector(`.filters input[name=${name}]:checked`).value;
}


function fetchListings() {
	//TODO Ishan
}

function createListings() {
	
}

function filter() {
	
}