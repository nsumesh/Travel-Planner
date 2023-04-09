const Amadeus = require('amadeus');

class API
{
    constructor()
    {
        // Amadeus API connection
        this.amadeus = new Amadeus({
            clientId: 'mXUCuCKB5fiaj9GLrCvZmA0Er5HrteeT',
            clientSecret: 'jC0nFnaUu0CptD1e'
        });
    }

    getFlights(preferences)
    {
        return this.amadeus.shopping.flightOffersSearch.get(preferences)
            .then(response => response.data)
            .catch(err => console.error("ERROR IN FETCHING DATA: ", err));
    }
}

module.exports = API;

// let obj = new API();
// obj.getFlights({ originLocationCode: 'SYD', destinationLocationCode: 'BKK', departureDate: '2023-05-01', adults: '2' })
//     .then(data => console.log(data))
//     .catch(err => console.error("ERROR IN FETCHING DATA: ", err));