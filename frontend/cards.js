const cards = {//TODO add others
	transportation: [
		{key: "iata", factory: (data) => createImageElement(`https://daisycon.io/images/airline/?iata=${data}`)},
		{key: "name", factory: (data) => createGenericElement(data, "h3")},
		{key: "info", factory: (data) => createGenericElement(data, "div")}
	]
};

loadCards();

function capitalizeFirstLetter(string) {
	
    return string.charAt(0).toUpperCase() + string.slice(1);
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

function loadCards() {
	
	for (const [card, components] of Object.entries(cards)) {
		let id = `#${card}-card `;
		let details = document.querySelector(id + ".card-details");
		let button = document.querySelector(id + ".submit-button");
		if (!details || !button) {
			continue;
		}
		if (components.every(comp => localStorage[card + "_" + comp.key])) {
			for (const component of components) {
				details.appendChild(component.factory(localStorage[card + "_" + component.key]));
			}
			button.innerHTML = "Change " + capitalizeFirstLetter(card);
		} else {
			details.appendChild(createImageElement(`./${card}-icon.png`));
		}
	}
}

function chooseFlight() {
	
	window.location.href="./flights.html"; //TODO change once attached to backend
}
