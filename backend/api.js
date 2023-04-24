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

  async getCityCodes(cityName)
  {
    try 
    {
      let details = { keyword: cityName, subType: Amadeus.location.city }
      let response = await this.amadeus.referenceData.locations.get(details);
      // making sure that the input city name matches the fetched data
      for(let elem of response.data)
      {
        if(cityName.toUpperCase() === elem.name)
        {
          return { iata: elem.iataCode, cityCode: elem.address.cityCode };
        }
      }
      return "CITY CODES NOT FOUND";
    } 
    catch(error) 
    {
      console.error("ERROR IN FETCHING DATA: ", error);
    }
  }
  
  async getFlights(preferences) 
  {
    try
    {
      let departCodes = await this.getCityCodes(preferences.originLocationCode);
      let destCodes = await this.getCityCodes(preferences.destinationLocationCode);
      preferences.originLocationCode = departCodes.iata;
      preferences.destinationLocationCode = destCodes.iata;

      let response = await this.amadeus.shopping.flightOffersSearch.get(preferences);
      return response;
    } 
    catch(error) 
    {
      console.error("ERROR IN FETCHING DATA: ", error);
    }
  }
}

module.exports = API;