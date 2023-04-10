const cards = ["flight"]; //TODO add others

loadCardData();

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function loadCardData() {
	
	for (const card of cards) {
		let data = localStorage.getItem(field);
		let id = `#${card}-card `;
		let info = document.querySelector(id + ".card-info");
		let button = document.querySelector(id + ".submit-button");
		if (!info || !button) {
			continue;
		}
		if (data) {
			button.innerHTML = "Change " + capitalizeFirstLetter(card); //TODO
			
		} else {
			
		}
	}
}

function chooseFlight() {
	
	window.location.href="./flights.html"; //TODO change once attached to backend
}
