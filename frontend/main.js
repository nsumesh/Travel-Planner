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
