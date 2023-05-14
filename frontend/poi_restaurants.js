const filters = [
	getPricePred,
	getRatingPredicate
];

let activities = [];
let chosen = [];
if(localStorage.hasOwnProperty("chosenPOI") && JSON.parse(localStorage.getItem("chosenPOI")).length !== 0)
{
	chosen = JSON.parse(localStorage.getItem("chosenPOI"));
}

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
		activities = restList.concat(entList);
		activities = activities.slice(0, Math.min(100, activities.length))
		console.log(activities);
		activities.forEach((listing, i) => listing.index = i);
		
        await loadActivities(parseInt(document.getElementById("budget").value));
    });
});

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

function getRatingPredicate(budget)
{
	let radios = document.querySelectorAll('input[name="rating"]');
	let ratingThreshold = -1;
	for(let radio of radios)
	{
		if(radio.checked)
		{
			ratingThreshold = parseInt(radio.value);
			break;
		}
	}
	return activity => {
		if(!activity.type)
		{
			return parseInt(activity.rating) >= ratingThreshold;
		}
		else
		{
			return true;
		}
	}
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
			listing.sortPrice = listing.sortPrice * parseFloat(document.getElementById("adult-count").value);
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
		sorted.forEach((listing) => listing.sortPrice = parseFloat(listing["price"]["amount"]) * parseFloat(document.getElementById("adult-count").value));
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

			let details = '';
			details += `<span class="poi-name">${elem.name.toUpperCase()}</span><br>`
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
			let detailsPack = createGenericElement(details, "div");
			detailsPack.classList.add("details-pack");
			
			let img = document.createElement("img");
			if(elem.type)
				img.setAttribute("src", elem.pictures[0]);
			else
				img.setAttribute("src", elem.photo.images.original.url);
			img.setAttribute("alt", "POI Image");
			img.classList.add("small-pic");

			listing.appendChild(detailsPack);
			if(!elem.type)
			{
				let rankDetails = elem.ranking + "<br>";
				rankDetails += "Price: " + elem.price_level
				rankPack = createGenericElement(rankDetails, "div")
				rankPack.classList.add("rank-pack");
				listing.appendChild(rankPack);
			}
			listing.appendChild(img);

            return container;
        });

	if (elements.length > 0) {
		listings.replaceChildren(...elements);
	} else {
		listings.innerHTML = "No results found!";
	}
}

async function selectActivity(listing)
{
	let poiElem = activities[listing.dataset.index];
	if(!chosen.some(obj => obj.name === poiElem.name))
		chosen.push(poiElem);
	activities.splice(listing.dataset.index, 1);
	activities.forEach((listing, i) => listing.index = i);
	await loadActivities(parseInt(document.getElementById("budget").value));
}

function backUpdate()
{
	chosen.forEach((listing, i) => listing.index = i);
	localStorage.setItem("chosenPOI", JSON.stringify(chosen));
}