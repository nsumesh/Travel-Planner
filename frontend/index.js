let origin = document.getElementById('start-place');
let destination = document.getElementById('end-place');
let departDate = document.getElementById('depart-date');
let returnDate = document.getElementById('return-date');
let oneWay = document.getElementById('one-way');
let budget = document.getElementById('budget');
let people = document.getElementById('adult-count');
let submitButton = document.getElementById('start-submit');

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