const startFields = ["origin", "destination", "depart", "return", "budget", "people"];

loadStartData();

function loadStartData() {
	
	let data = {};
	for (const field of startFields) {
		data[field] = localStorage.getItem(field) ?? "";
	}
	for (const [field, value] of Object.entries(data)) {
		const input = document.querySelector(`#start-form input[name='${field}']`);
		if (input) {
			input.value = value;
		}
	}
}
