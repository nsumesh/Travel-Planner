const components = {
	transportation: basicFactory("transportation"),
	lodging: basicFactory("lodging"),
	poi: activitiesFactory(),
	cars: carsFactory()
};

loadSummary();

function retrieve(card, entry) {
	
	let data = localStorage.getItem(card + "_" + entry);
	if (entry === "price") {
		data = "$" + data;
	}
	return data;
}

function basicFactory(component) {
	
	let elements = ["name", "info", "price"];
	return () => {
		let container = document.createElement("div");
		let data = elements.map(elem => retrieve(component, elem));
		if (data.every(d => d)) {
			data.forEach(d => container.appendChild(createGenericElement(d, "div")));
		} else {
			container.innerHTML = "None selected!";
		}
		return container;
	};
}

function activitiesFactory() {
    let chosen = [];
    if (localStorage.hasOwnProperty("chosenPOI") && JSON.parse(localStorage.getItem("chosenPOI")).length !== 0) {
        chosen = JSON.parse(localStorage.getItem("chosenPOI"));
    }

    return () => {
		let container = document.createElement("div");
        if (chosen.length !== 0) {
			container.style.display = "flex";
			container.style.flexWrap = "wrap";
            chosen.forEach((activity) => {
                let subcontainer = document.createElement("div");
                let name = createGenericElement(activity.name, "div");
                let price = createGenericElement("$"+activity.sortPrice, "div");
                subcontainer.appendChild(name);
                subcontainer.appendChild(price);
                container.appendChild(subcontainer);
            });
        } else {
            container.innerHTML = "No Activities Selected !";
        }
		return container;
    };
}

	  


function carsFactory() {
	if(localStorage.hasOwnProperty("chosenVehicle") && JSON.parse(localStorage.getItem("chosenVehicle")).length !== 0)
	{
		chosen = JSON.parse(localStorage.getItem("chosenVehicle"));
	}

	return () => {
		let container = document.createElement("div");
		if(chosen.length!==0){
			container.style.display = "flex";
			container.style.flexWrap = "wrap";
			chosen.forEach((car) => {
				let subContainer = document.createElement("div");
				let image = document.createElement("img");
				image.src = car.vehicle_info.image_thumbnail_url;
				image.width = 150;
				image.height = 100;

				let name = createGenericElement(car["vehicle_info"]["label"].replace(" with:", "") + " similar to " + car["vehicle_info"]["v_name"] + "<br>", "div");
				let seats = createGenericElement(car["vehicle_info"]["seats"] + " seats" + "<br><br>"  + car["vehicle_info"]["mileage"].replace(" km", "") + "<br><br>" + car["vehicle_info"]["transmission"] + "<br>", "div");
				let price = createGenericElement("$" + car["pricing_info"]["price"] + "<br>", "div");

				subContainer.appendChild(image);
				subContainer.appendChild(name);
				subContainer.appendChild(seats);
				subContainer.appendChild(price);
				container.appendChild(subContainer);
			});
		}
		else
		{
			container.innerHTML = "No Cars Selected !";
		}
		return container;
	};
}

function capitalizeFirstLetter(string) {
	
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function loadSummary() {
	let params = new URLSearchParams(window.location.search);
	if (params.has("id")) {
		Promise.resolve(params.get("id"))
		.then(id => fetch('/load-summary', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({id: id})
			})
		).then(response => response.json())
		.then(data => {
			Object.entries(data).forEach(([key, value]) => localStorage.setItem(key, value));
			displaySummary();
		});
	} else {
		displaySummary();
	}
}

function displaySummary() {
	for (const [component, factory] of Object.entries(components)) {
		let summary = document.querySelector("#" + component + "-summary");
		if (!summary) {
			continue;
		}
		summary.appendChild(factory());
	}
	document.querySelector("#grand-total").innerHTML = "<b>Grand Total: </b> $" + formatDollarAmount(getTotalSpending());
	document.querySelector("#remaining-budget").innerHTML = "<b>Remaining budget: </b> $" + formatDollarAmount(getRemainingBudget());
}

function share(element) {
	
	package = {};
	for (const [name, value] of Object.entries(localStorage)) {
		package[name] = value;
	}
	fetch('/create-trip', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(package)
	})
	.then(response => response.json())
	.then(data => data.id)
	.then(id => navigator.clipboard.writeText(window.location.href + "?id=" + id))
	.then(() => element.innerHTML = "Link copied to clipboard!");
}