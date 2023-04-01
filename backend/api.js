export class API
{
    constructor()
    {
        this.FLIGHT_URL = null; // API URL for flights
        this.LODGING_URL = null; // API URL for lodging
        this.INTRANSPORT_URL = null; // API URL for internal transport
    }

    async getFromAPI(url)
    {
        /* fetch() and json() return promises, so we have to ensure
            that they are resolved */
        try
        {
            let response = await fetch(url);
            let data = await response.json();
            return data;
        }
        catch(error)
        {
            console.error('ERROR IN GETTING API DATA: ', error);
        }
    }
}