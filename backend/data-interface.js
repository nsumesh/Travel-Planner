const API = require('./api.js');
const Database = require('./database.js');
const mysql = require('mysql2/promise'); // now each function will return a promise

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

    getUserPrefs(cookie) 
    {
        return this.db.getUserPrefs(cookie)
    }

    updateUserPrefs(cookie, data) 
    {
        return this.db.updateUserPrefs(cookie, data);
    }

    getFlights(preferences)
    {
        return this.api.getFlights(preferences);
    }

    getUserItinerary(cookie)
    {
        return this.db.getUserItinerary(cookie);
    }

    updateUserItinerary(cookie, data) 
    {
        return this.db.updateUserItinerary(cookie, data);
    }
}

module.exports = DataInterface;