const API = require('./api.js');
const Database = require('./database.js');

class DataInterface 
{
    constructor() 
    {
        // set up the database interface
        this.db = new Database();
        // to get data from APIs
        this.api = new API();
    }

    async initDatabase()
    {
        let success = await this.db.initDatabase()
        if (success) {
            console.log('Database successfully initialized')
        }
    }

    async getUserPrefs(cookie) 
    {
        try 
        {
            let prefs = await this.db.getUserPrefs(cookie);
            return prefs;
        } 
        catch(error) 
        {
            console.error('ERROR IN GETTING PREFS: ', error);
        }
    }

    async updateUserPrefs(cookie, data) 
    {
        try 
        {
            await this.db.updateUserPrefs(cookie, data);
            console.log('PREFERENCES UPDATED');
        } 
        catch(error) 
        {
            console.error('ERROR IN UPDATING PREFS: ', error);
        }
    }

    async getFlights(preferences) 
    {
        try 
        {
            let flights = await this.api.getFlights(preferences);
            return flights;
        } 
        catch(error) 
        {
            console.error('ERROR IN FETCHING FLIGHTS: ', error);
        }
    }

    async getUserItinerary(cookie) 
    {
        try 
        {
            let trip = await this.db.getUserItinerary(cookie);
            return trip;
        } 
        catch(error) 
        {
            console.error('ERROR IN GETTING ITINERARY: ', error);
        }
    }

    async updateUserItinerary(cookie, data) 
    {
        try 
        {
            await this.db.updateUserItinerary(cookie, data);
            console.log('ITINERARY UPDATED');
        } 
        catch(error) 
        {
            console.error('ERROR IN UPDATING ITINERARY: ', error);
        }
    }
}

module.exports = DataInterface;