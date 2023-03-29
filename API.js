class API 
{
    constructor() 
    {
        this.FLIGHT_URL = null; // API URL for flights
        this.LODGING_URL = null; // API URL for lodging
        this.INTRANSPORT_URL = null; // API URL for internal transport
    }

    async getFromAPI(url) 
    {
        try 
        {
          let response = await fetch(url);
          let data = await response.json();
          return data;
        } 
        catch(error) 
        {
          console.error('ERROR FOUND: ', error);
        }
    }
}