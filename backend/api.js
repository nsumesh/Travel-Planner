const Amadeus = require('amadeus');

class API {
  constructor() 
  {
    // Amadeus API connection
    this.amadeus = new Amadeus({
      clientId: '80B4rAGUjIF5uHUeOe6W2USRyUGFO0ug',
      clientSecret: 'NILxAX1ZQT8v9WPP'
    });
  }

  async getCityCodes(cityName)
  {
    try 
    {
      let details = { keyword: cityName, subType: Amadeus.location.city }
      let response = await this.amadeus.referenceData.locations.get(details);
      // high prob that first entry is a match
      if(response.data.length != 0)
      {
        let elem = response.data[0];
        return { iata: elem.iataCode, cityCode: elem.address.cityCode };
      }
      return "CITY CODES NOT FOUND";
    } 
    catch(error) 
    {
      console.error("ERROR IN FETCHING CITY CODES DATA: ", error);
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
      console.error("ERROR IN FETCHING FLIGHT DATA: ", error);
    }
  }
}

module.exports = API;