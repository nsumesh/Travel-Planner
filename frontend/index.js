function submit() {
	data = {};
	for (const field of startFields) {
		const input = document.querySelector(`#start-form input[name='${field}']`);
		if (!input.value) {
			return;
		}
		data[field] = input.value;
	}
	for (const [field, value] of Object.entries(data)) {
		localStorage.setItem(field, value);
	}
	console.log(Object.entries(localStorage));
	window.location.href="./cards.html"; //TODO change once attached to backend
}