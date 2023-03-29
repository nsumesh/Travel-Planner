class API
{    
    constructor()
    {
        this.FLIGHT_URL = null; // API URL for flights
        this.LODGING_URL = null; // API URL for lodging
        this.INTRANSPORT_URL = null; // API URL for internal transport
    }

    getFlights()
    {
        let response = fetch(this.FLIGHT_URL).then((response) => response.json());
        return response;
    }

    getLodging()
    {
        let response = fetch(this.LODGING_URL).then((response) => response.json());
        return response;
    }

    getInternalTransport()
    {
        let response = fetch(this.INTRANSPORT_URL).then((response) => response.json());
        return response;
    }
}