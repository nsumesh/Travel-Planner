const filters = [
	getPricePred
];

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

    return lodging => values.min <= lodging["offers"]["0"]["price"]["total"] && 
            lodging["offers"]["0"]["price"]["total"] <= values.max;
}

async function getLodging()
{
    let checkIn = document.getElementById("check-in").value;
    let checkOut = document.getElementById("check-out").value;
    let adultCount = document.getElementById("adult-count").value;
    let roomCount = document.getElementById("room-count").value;
    
    let gridLines = { 
        latitude: localStorage.getItem("destination_latitude"),
        longitude: localStorage.getItem("destination_longitude") 
    };
	
	let package = {
        location: gridLines,
        adults: adultCount,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        roomQuantities: roomCount,
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

async function loadLodging(data, budget)
{
	let listings = document.querySelector("#listings");
	if (!listings) {
		return;
	}

    let elements = data;
    let predicates = filters.map(supplier => supplier(budget));
    elements = elements.filter(lodging => predicates.every(p => p(lodging)))
        .map((lodging) => {
            let container = document.createElement("li");
            container.classList.add("listing-container");
            let listing = document.createElement("div");
            // container.addEventListener("click", () => selectFlight(listing));
            listing.classList.add("listing");
            container.appendChild(listing);
            // listing.dataset.index = lodging.index;

            let nameAndBeds = lodging.hotel.name;
            let room = lodging["offers"]["0"]["room"];
            if("typeEstimated" in room)
            {
                let roomBeds = lodging["offers"]["0"]["room"]["typeEstimated"];
                {
                    if("beds" in roomBeds && "bedType" in roomBeds)
                    {
                        let bedType = roomBeds["bedType"].toLowerCase();
                        bedType = bedType.charAt(0).toUpperCase() + bedType.slice(1);
                        let beds = roomBeds["beds"].toString() + " " + bedType + " bed(s)";
                        nameAndBeds += "<br>" + beds;
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
        await loadLodging(data, parseInt(document.getElementById("budget").value));
    });
});