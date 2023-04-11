const startFields = ["origin", "destination", "depart", "return", "budget", "people"];

loadStartData();

function loadStartData() {
	
	for (const field of startFields) {
		let value = localStorage.getItem(field) ?? "";
		const input = document.querySelector(`#start-form input[name='${field}']`);
		if (input) {
			input.value = value;
		}
	}
}

function createGenericElement(data, tag) {
	
	let element = document.createElement(tag);
	element.innerHTML = data;
	return element;
}

function createImageElement(url) {
	
	let icon = document.createElement("img");
	icon.src = url;
	return icon;
}

function createAirlineIconElement(iata, width, height) {

	return createImageElement(`https://daisycon.io/images/airline/?iata=${iata}&width=${width}&height=${height}`);
}

function getDoubleRangeValues(name) {
	
	return {min: 0, max: 10000}; //TODO
}

function getRadioValue(name) {
	
	return document.querySelector(`#filters input[name=${name}]:checked`).value;
}