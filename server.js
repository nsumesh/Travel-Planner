const express = require('express');
const app = express();
const DataInterface = require('./backend/data-interface.js');

let manager = new DataInterface();

// middleware that puts incoming data into req.body
app.use(express.json());

// serves static files of the homepage to browser
app.use('/', express.static('frontend'));

app.post('/initial-preferences', async (req, res) => {
    try 
    {
        let package = req.body;
        let results = await manager.getFlights(package);
        res.send(results);
    } 
    catch(error) 
    {
        console.error("ERROR IN FETCHING DATA: ", error);
        res.status(500).send("ERROR IN FETCHING DATA!");
    }
});

app.listen(3000, async () => {
    await manager.initDatabase()
    console.log("Server started on port 3000");
    // let tripInformation = {
    //     "Trips": {
    //         "budget": 300,
    //         "depart_date": Date.now(),
    //         "location": "NYC",
    //         "num_people": 6
    //     },
    //     "Flights":{
    //         "departing": [
    //             {    
    //                 "airline": "Delta",
    //                 "flight_number": 3023,
    //                 "departure_time": Date.now(),
    //                 "arrival_time": Date.now(),
    //                 "departure_location": "NYC",
    //                 "arrival_location": "BOS",
    //                 "price": 324
    //             },
    //             {    
    //                 "airline": "Delta",
    //                 "flight_number": 3033,
    //                 "departure_time": Date.now(),
    //                 "arrival_time": Date.now(),
    //                 "departure_location": "BOS",
    //                 "arrival_location": "LAX",
    //                 "price": 324
    //             }
    //         ],
    //         "returning": [
    //             {
    //                 "airline": "American Airlines",
    //                 "flight_number": 1234,
    //                 "departure_time": Date.now(),
    //                 "arrival_time": Date.now(),
    //                 "departure_location": "BOS",
    //                 "arrival_location": "NYC",
    //                 "price": 30000
    //             },
    //             {
    //                 "airline": "American Airlines",
    //                 "flight_number": 12,
    //                 "departure_time": Date.now(),
    //                 "arrival_time": Date.now(),
    //                 "departure_location": "NYC",
    //                 "arrival_location": "TOR",
    //                 "price": 30000
    //             }
    //         ]
    //     },
    //     "Lodgings": [
    //         {
    //             name: 'HolidayInn',
    //             location: 'Boston',
    //             price: 300,
    //             num_bedrooms: 3
    //         }
    //     ],
    //     "Transportation": [
    //         {
    //             vendor_name: "Peter Pan",
    //             price: 70,
    //             departure_time: Date.now(),
    //             arrival_time: Date.now(),
    //             departure_location: "NYC",
    //             arrival_location: "BOS"
    //         }
    //     ]
    // }
    // manager.createTrip(tripInformation)
    manager.getTrip(2)
});