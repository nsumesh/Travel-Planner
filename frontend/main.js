const startFields = ["origin", "destination", "depart", "one-way", "return", "budget", "people"];

loadStartData();

function loadStartData() {
	
	for (const field of startFields) {
		let value = localStorage.getItem(field) ?? "";
		const input = document.querySelector(`#start-form input[name='${field}']`);
		if (input) {
			if (input.getAttribute("type") == "checkbox") {
				input.checked = value === 'true';
			} else {
				input.value = value;
			}
		}
	}
}

function titleCase(str) {
	
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
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
	
	let min = document.querySelector(`input.range-min[type=number][name=${name}]`);
	let max = document.querySelector(`input.range-max[type=number][name=${name}]`);
	return {min: parseFloat(min.value), max: parseFloat(max.value)};
}

function getRadioValue(name) {
	
	return document.querySelector(`#filters input[name=${name}]:checked`).value;
}

function priceRangeValidation() {
	
	let min = document.querySelector("input.range-min[type=number][name='price']");
	let max = document.querySelector("input.range-max[type=number][name='price']");
	if (max && min) {
		let budget = parseFloat(localStorage.getItem("budget"));
		max.value = formatDollarAmount(budget);
		min.addEventListener("change", (event) => {
			let value = parseFloat(event.target.value || 0);
			if (value > budget) {
				value = budget;
			}
			let formatted = formatDollarAmount(value);
			if (value > parseFloat(max.value)) {
				max.value = formatted;
			}
			event.target.value = formatted;
		});
		max.addEventListener("change", (event) => {
			let value = parseFloat(event.target.value || 0);
			if (value > budget) {
				value = budget;
			}
			let formatted = formatDollarAmount(value);
			if (value < parseFloat(min.value)) {
				min.value = formatted;
			}
			event.target.value = formatted;
		});
	}
}

function formatDollarAmount(amount) {
	
	return amount.toFixed(2).replace(/[.,]00$/, "");
}