const filters = [
	getPricePred
];

async function getData(location) {
    let token = await amadeusToken();
    let locDetails = await fetch("https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=" + location, {headers: {'Authorization': token}});
    let body = await locDetails.json();
    let geo = body?.data?.[0]?.geoCode;
    return { latitude: geo.latitude, longitude: geo.longitude };
}

function getPricePred() {
	let values = getDoubleRangeValues("price");
	return flight => values.min <= flight["offers"]["0"]["price"]["total"] && 
            flight["offers"]["0"]["price"]["total"] <= values.max;
}

async function getLodging()
{
    let destination = document.getElementById("destination").value;
    let checkIn = document.getElementById("check-in").value;
    let checkOut = document.getElementById("check-out").value;
    let budget = "-" + document.getElementById("budget").value;
    let adultCount = document.getElementById("adult-count").value;
    let roomCount = document.getElementById("room-count").value;
    
    let gridLines = await getData(destination);
	
	let package = {
        location: gridLines,
        adults: adultCount,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        roomQuantities: roomCount,
        priceRange: budget,
        currency: 'USD'
    };
    
    let radios = document.querySelectorAll('input[name="board"]');
    let room_type_list = ["ROOM_ONLY", "BREAKFAST", "HALF_BOARD", "FULL_BOARD", "ALL_INCLUSIVE"];
    for(let i in radios)
    {
        if(radios[i].checked)
        {
            package["board_type"] = room_type_list[i];
			console.log(room_type_list[i]);
            break;
        }
    }

    let response = await fetch('/lodging-preferences', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(package)
    });
    let extracted = await response.json();
	sorted = extracted.sort((a, b) => parseFloat(a["offers"]["0"]["price"]["total"]) - parseFloat(b["offers"]["0"]["price"]["total"]));
    console.log(sorted);

    return sorted;
}

// async function loadLodging(data) 
// {
// 	let listings = document.querySelector("#listings");
// 	if (!listings) {
// 		return;
// 	}

//     let elements = data;
//     let predicates = filters.map(supplier => supplier());
//     elements = elements.filter(lodging => predicates.every(p => p(lodging)))
//         .map((lodging) => {
//             let container = document.createElement("li");
//             container.classList.add("listing-container");
//             let listing = document.createElement("div");
//             // container.addEventListener("click", () => selectFlight(listing));
//             listing.classList.add("listing");
//             container.appendChild(listing);
//             // listing.dataset.index = lodging.index;

//             let nameAndBeds = lodging.hotel.name;
//             let room = lodging["offers"]["0"]["room"];
//             if("typeEstimated" in room)
//             {
//                 let roomBeds = lodging["offers"]["0"]["room"]["typeEstimated"];
//                 {
//                     if("beds" in roomBeds && "bedType" in roomBeds)
//                     {
//                         let bedType = roomBeds["bedType"].toLowerCase();
//                         bedType = bedType.charAt(0).toUpperCase() + bedType.slice(1);
//                         let beds = roomBeds["beds"].toString() + " " + bedType + " bed(s)";
//                         nameAndBeds += "<br>" + beds;
//                     }
//                 }
//             }
//             listing.appendChild(createGenericElement(nameAndBeds, "div"));
            
//             let price = "$" + lodging["offers"]["0"]["price"]["total"] + "<br>" + "total";
//             listing.appendChild(createGenericElement(price, "div"));

//             return container;
//         });

// 	if (elements.length > 0) {
// 		listings.replaceChildren(...elements);
// 	} else {
// 		listings.innerHTML = "No results found!";
// 	}
// }

async function loadLodging(data) 
{
	let listings = document.querySelector("#listings");
	if (!listings) {
		return;
	}

    let elements = data;
    elements = elements.map((lodging) => {
        let container = document.createElement("li");
        container.classList.add("listing-container");
        let listing = document.createElement("div");
        // container.addEventListener("click", () => selectFlight(listing));
        listing.classList.add("listing");
        container.appendChild(listing);
        // listing.dataset.index = lodging.index;

        let nameAndBeds = lodging.hotel.name;
        let room = lodging["offers"]["0"]["room"]
        if("typeEstimated" in room)
        {
            let roomBeds = lodging["offers"]["0"]["room"]["typeEstimated"];
            {
                if("beds" in roomBeds && "bedType" in roomBeds)
                {
                    let bedType = roomBeds["bedType"].toLowerCase();
                    bedType = bedType.charAt(0).toUpperCase() + bedType.slice(1);
                    let beds = roomBeds["beds"].toString() + " " + bedType + " bed(s)";
                    nameAndBeds += "<br>" + beds
                    // listing.appendChild(createGenericElement(beds, "div"));
                }
            }
        }
        listing.appendChild(createGenericElement(nameAndBeds, "div"));
        
        let price = "$" + lodging["offers"]["0"]["price"]["total"] + "<br>" + "total";
        listing.appendChild(createGenericElement(price, "div"));

        return container;
    });

	if (elements.length > 0) {
		listings.replaceChildren(...elements);
	} else {
		listings.innerHTML = "No results found!";
	}
}

document.addEventListener("DOMContentLoaded", function() {
    let button = document.getElementById("find-lodging-button");
    button.addEventListener("click", async function() {
        document.getElementById("listings").innerText = "Loading listings...";
        let data = await getLodging();
        await loadLodging(data);
    });
});