class WebScrape {
    async uberPrices(pickupLat, pickupLong, destLat, destLong) {
        fetch("https://www.uber.com/api/loadFEEstimates?localeCode=en", {
            method: 'POST',
            body: JSON.stringify({
                "pickup": {
                    "latitude": pickupLat,
                    "longitude": pickupLong
                },
                "destination": {
                    "latitude": destLat,
                    "longitude": destLong
                },
                "locale": "en"
            }),
            headers: {
                'content-type': 'application/json',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
                'x-csrf-token': 'x'
            }
        })
        .then(response => response.json())
        // getting only necessary data and putting it in a nested array
        .then(res => console.log((res.data.prices).map(obj => Object.hasOwn(obj, 'vehicleViewDisplayName') && Object.hasOwn(obj, 'fareString') ? [obj.vehicleViewDisplayName, obj.fareString] : console.log("Specified keys not found"))))
        .catch(err => console.log(`UBER API error: ${err}`));
    }
    // Testing
    //uberPrices(42.385150, -72.525290, 42.039370, -72.613620);

    async lyftPrices(pickupLat, pickuplong, destLat, destLong) {
        let priceStr = ""
        fetch("https://www.lyft.com/api/costs?start_lat="+pickupLat+"&start_lng="+pickuplong+"&end_lat="+destLat+"&end_lng="+destLong)
        .then(response => response.json())
        .then(res => console.log(res.cost_estimates.map(obj => {
            if (Object.hasOwn(obj, 'estimated_cost_cents_min') && Object.hasOwn(obj, 'estimated_cost_cents_max')) {
                obj['estimated_cost_cents_min'] = obj.estimated_cost_cents_min / 100;
                obj['estimated_cost_cents_max'] = obj.estimated_cost_cents_max / 100;
                priceStr = "$"+ obj.estimated_cost_cents_min + "-" + obj.estimated_cost_cents_max;
            }
            return [obj.display_name, priceStr] // same format as uber function
        }))).catch(err => console.log(`Lyft API error: ${err}`));
    }
    // Testing
    //lyftPrices(42.387119, -72.526435, 42.038042, -72.617054);
}