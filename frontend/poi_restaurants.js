const filters = [
	getPricePred,
	// getRatingPredicate, 
    // getTagPredicate,
];

let activities = [];

document.addEventListener("DOMContentLoaded", async function() {
    let button = document.getElementById("poi_search_button");

    button.addEventListener("click", async function() {
        document.getElementById("listings").innerText = "Loading listings...";
        let radius = document.querySelectorAll(`#filters input`)[0].valueAsNumber;
		let rad = null;
		if(radius != null && radius <= 20)
			rad = radius;
		else
			rad = 5;

		let entList = await fetchEntertainmentListings(rad);
		let restList = await fetchRestaurantListings();
		activities = merge(entList, restList);
		console.log(activities);
		activities.forEach((listing, i) => listing.index = i);
		
        await loadActivities(parseInt(document.getElementById("budget").value));
    });
});

function merge(list1, list2)
{
	// let merged = []
	// let i = 0, j = 0;
	// while(i < list1.length && j < list2.length)
	// {
	// 	if(list1[i].sortPrice <= list2[j].sortPrice)
	// 		merged.push(list1[i++]);
	// 	else
	// 		merged.push(list2[j++]);
	// }
	
	// while(i < list1.length)
	// 	merged.push(list1[i++]);
	// while(j < list2.length)
	// 	merged.push(list2[j++]);

	// return merged;

	return list2.concat(list1);
}

function getPricePred(budget) {
	let values = getDoubleRangeValues("price");
	if(!values.min)
    {
        values.min = 0;
    }
    if(!values.max)
    {
        values.max = budget;
    }
	return activity => values.min <= activity.sortPrice && activity.sortPrice <= values.max;
}

//console.log(localStorage.getItem("destination").split(", ")[0])
async function fetchRestaurantListings() {
	let package = {
        language: "en_US",
        q: localStorage.getItem("destination").split(", ")[0]
    };

	try 
	{
		let response = await fetch('/restaurant-preferences', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify(package)
		});
		let extracted = await response.json();
		// extracted = extracted.filter(listing => listing["price"])
		extracted.forEach((listing) => {
			if(!listing["price"])
			{
				listing.sortPrice = 0;
				return;
			}
			let format = listing["price"].replace(/\$|\s/g, '')
			let range = format.split('-');
			range = range.map(val => parseFloat(val))
			if(range.length == 1)
			{
				listing.sortPrice = range[0];
			}
			else
			{
				let avg = (range[0] + range[1]) / 2;
				listing.sortPrice = avg;
			}
		});
		let sorted = extracted.sort((a, b) => a.sortPrice - b.sortPrice);
        return sorted;
	}
	catch(error) 
	{
		console.error('ERROR IN FETCHING DATA: ', error);
	}
}

async function fetchEntertainmentListings(rad) {
	let package = {
        latitude: localStorage.getItem("destination_latitude"),
        longitude: localStorage.getItem("destination_longitude"), 
        radius: rad
    };
    // console.log(package)

	try 
	{
		let response = await fetch('/entertainment-preferences', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify(package)
		});
		let extracted = await response.json();
		let sorted = extracted.sort((a, b) => parseFloat(a["price"]["amount"]) - parseFloat(b["price"]["amount"]));
		sorted.forEach((listing) => listing.sortPrice = parseFloat(listing["price"]["amount"]));
        return sorted;
	} 
	catch(error) 
	{
		console.error('ERROR IN FETCHING DATA: ', error);
	}
}

function loadActivities(budget) {
	let listings = document.querySelector("#listings");
	if (!listings) {
		return;
	}

	let elements = activities;
    let predicates = filters.map(supplier => supplier(budget));
    elements = elements.filter(elem => predicates.every(p => p(elem)))
        .map((elem) => {
            let container = document.createElement("li");
            container.classList.add("listing-container");
            let listing = document.createElement("div");
            container.addEventListener("click", () => selectActivity(listing));
            listing.classList.add("listing");
            container.appendChild(listing);
            listing.dataset.index = elem.index;

			// let table = document.createElement("table");
			
			// // FIRST TABLE ROW
			// let firstRow = document.createElement("tr");

			// let img = document.createElement("img");
			// if(elem.type)
			// 	img.setAttribute("src", elem.pictures[0]);
			// else
			// 	img.setAttribute("src", elem.photo.images.original.url);
			// img.setAttribute("alt", "POI Image");
			// img.classList.add("small-pic");

			// let p = document.createElement("p");
			// p.innerText = "Hello World!"

			// firstRow.appendChild(img);
			// firstRow.appendChild(p);

			// table.appendChild(firstRow);
			// listing.appendChild(table);

			let details = '';
			// details += elem.name + "<br>";
			details += `<span class="poi-name">${elem.name}</span><br>`
			if(elem.type)
			{
				details += "Categories: " + elem.shortDescription + "<br>";
				details += `<a href=${elem.bookingLink}>Make Reservation</a>`
			}
			else
			{
				details += elem.address + "<br>"
				let neighbors = '';
				for(let obj of elem.neighborhood_info)
				{
					neighbors += obj.name + ", "
				}
				neighbors = neighbors.substring(0, neighbors.length - 2);
				details += neighbors + "<br><br>";
				if(elem.email)
					details += "Contact: " + elem.email + "<br>";
				details += `<a href=${elem.website}>Visit Website</a>`
			}
			// if(elem.type)
			// 	details += `<span class="poi-categ">Categories: ${elem.shortDescription}</span><br>`
			let detailsPack = createGenericElement(details, "div");
			
			let img = document.createElement("img");
			if(elem.type)
				img.setAttribute("src", elem.pictures[0]);
			else
				img.setAttribute("src", elem.photo.images.original.url);
			img.setAttribute("alt", "POI Image");
			img.classList.add("small-pic");

			listing.appendChild(detailsPack);
			listing.appendChild(img);

            return container;
        });

	if (elements.length > 0) {
		listings.replaceChildren(...elements);
	} else {
		listings.innerHTML = "No results found!";
	}
}

function selectActivity(listing)
{}

function formatDuration(raw) {
	return [...raw.matchAll(/\d+[A-Z]/g)].join(" ").toLowerCase();
}

function formatTime(time) {
	time = new Date(time);
	let hours = time.getHours();
	let suffix = hours >= 12 ? " PM" : " AM";
	hours = hours % 12;
	hours = hours ? hours : 12;
	let minutes = time.getMinutes();
	minutes = minutes < 10 ? "0" + minutes : minutes;
	return hours + ":" + minutes + suffix;
}