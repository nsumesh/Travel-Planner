const API = require('./api.js');
const Database = require('./database.js');
const mysql = require('mysql2/promise');

class DataInterface 
{
    constructor() 
    {
        // creates db connection
        this.database = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'getaway',
            database: 'travel-data'
        });
        // for doing CRUD on db
        this.db = new Database(this.database);
        // to get data from APIs
        this.api = new API();
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