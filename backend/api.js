const Amadeus = require('amadeus');

class API {
  constructor() 
  {
    // Amadeus API connection
    this.amadeus = new Amadeus({
      clientId: 'mXUCuCKB5fiaj9GLrCvZmA0Er5HrteeT',
      clientSecret: 'jC0nFnaUu0CptD1e'
    });
  }

  async getFlights(preferences) 
  {
    try 
    {
      let response = await this.amadeus.shopping.flightOffersSearch.get(preferences);
      // sorts the list of flights in ascending order of total price
      // let sortedList = response.data.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
      // return sortedList;
      return response;
    } 
    catch(error) 
    {
      console.error("ERROR IN FETCHING DATA: ", error);
    }
  }
}

module.exports = API;