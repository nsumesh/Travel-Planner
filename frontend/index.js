function submit() {

	data = {};
	for (const field of startFields) {
		const input = document.querySelector(`#start-form input[name='${field}']`);
		if (!input || !(input.value || (field == "return" && data["one-way"] == "true"))) {
			return;
		}
		if (input.getAttribute("type") == "checkbox") {
			data[field] = !!input.checked;
		} else {
			data[field] = input.value;
		}
	}
	localStorage.clear();
	for (const [field, value] of Object.entries(data)) {
		localStorage.setItem(field, value);
	}
	window.location.href="./cards.html";
}