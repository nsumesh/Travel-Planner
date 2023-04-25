let origin = document.getElementById('start-place');
let destination = document.getElementById('end-place');
let departDate = document.getElementById('depart-date');
let returnDate = document.getElementById('return-date');
let oneWay = document.getElementById('one-way');
let budget = document.getElementById('budget');
let people = document.getElementById('adult-count');
let submitButton = document.getElementById('start-submit');

initLocationAutoFill();

function initLocationAutoFill() {
	
	amadeusToken().then(token => {
		document.querySelectorAll(`input.location-input`).forEach((input, index) => {
			let list = document.createElement("datalist");
			list.id = "locations-" + index;
			input.setAttribute("list", list.id);
			let memo = {};
			let update = element => {
				let value = element.value.toLowerCase();
				if (value.length < 1 || value.includes(",")) {
					list.replaceChildren();
					return;
				}
				if (value in memo) {
					list.replaceChildren(...memo[value]);
					return;
				}
				fetch("https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=" + value, {headers: {'Authorization': token}})
				.then(response => response.json())
				.then(body => {
					options = body.data.map(location => {
						let address = location.address;
						let option = document.createElement("option");
						option.value = titleCase(address.cityName) + ", ";
						if (address.countryCode == "US") {
							option.value += address.stateCode;
						} else {
							option.value += address.countryCode;
						}
						return option;
					});
					memo[value] = options;
					list.replaceChildren(...options);
				}, console.log);
			};
			input.addEventListener('input', event => update(event.target));
			update(input);
			input.appendChild(list);
		});
	});
}

function submit() {

	data = {};
	for (const field of startFields) {
		const input = document.querySelector(`#start-form input[name='${field}']`);
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

/* TODO: Check whether both dates are AFTER present day and whether
return date is AFTER depart date */
function checkInputs() 
{
	if (origin.value === '' || destination.value === '' || departDate.value === '' || 
		(!oneWay.checked && returnDate.value === '') || budget.value === '' || people.value === '') 
	{
	  	submitButton.disabled = true;
	} 
	else 
	{
	  	submitButton.disabled = false;
	}
}

origin.addEventListener('input', checkInputs);
destination.addEventListener('input', checkInputs);
departDate.addEventListener('input', checkInputs);
returnDate.addEventListener('input', checkInputs);
oneWay.addEventListener('input', checkInputs);
budget.addEventListener('input', checkInputs);
people.addEventListener('input', checkInputs);