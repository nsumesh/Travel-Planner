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

function createImageElement(data) {
	
	let icon = document.createElement("img");
	icon.src = data;
	return icon;
}
