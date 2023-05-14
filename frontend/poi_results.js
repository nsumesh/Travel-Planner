let listContainer = document.querySelector("#listings");

window.addEventListener("load", () => {
    // console.log(localStorage.getItem("chosenPOI"));
    if(localStorage.hasOwnProperty("chosenPOI") && JSON.parse(localStorage.getItem("chosenPOI")).length !== 0)
    {
        let elements = JSON.parse(localStorage.getItem("chosenPOI"));
        elements = elements.map((elem) => {
            let container = document.createElement("li");
            container.classList.add("listing-container");
            // container.addEventListener("click", () => removeActivity(listing));
            let listing = document.createElement("div");
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
				rankDetails += "Price (per person): " + elem.price_level
				rankPack = createGenericElement(rankDetails, "div")
				rankPack.classList.add("rank-pack");
				listing.appendChild(rankPack);
			}
			listing.appendChild(img);

            return container;
        });

        listContainer.replaceChildren(...elements);
    }
    else
    {
        listContainer.innerText = "No activities selected!";
    }
});

// async function loadResults()
// {

// }

// async function removeActivity(listing)
// {
//     let poiElem = activities[listing.dataset.index];
//     // console.log(poiElem);
// 	if(!chosen.some(obj => obj.name === poiElem.name))
// 		chosen.push(poiElem);
// 	// console.log(chosen);
// 	chosen.splice(listing.dataset.index, 1);
// 	chosen.forEach((listing, i) => listing.index = i);
// 	await loadResults();
// }