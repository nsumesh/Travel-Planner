const Amadeus = require('amadeus');

class API
{
    constructor()
    {
        this.amadeus = new Amadeus({
            clientId: 'mXUCuCKB5fiaj9GLrCvZmA0Er5HrteeT',
            clientSecret: 'jC0nFnaUu0CptD1e'
        });
    }

    async getFlights(preferences)
    {
        // let somePreferences = { originLocationCode: 'SYD', destinationLocationCode: 'BKK', departureDate: '2023-05-01', adults: '2'}
        this.amadeus.shopping.flightOffersSearch.get(preferences)
            .then(response => console.log(response.data))
            .catch(err => console.error("ERROR IN FETCHING DATA:",err));
    }
}

module.exports = API;

// const express = require('express');
// const app = express();
// const DataInterface = require('./backend/data-interface.js');

// let manager = new DataInterface();

// app.use(express.static('frontend'));

// app.post('/initial-preferences', (req, res) => {
//     let package = req.body;
//     res.send(package);
// });

// app.listen(3000, () => {
//     console.log("Server started on port 3000");
// });