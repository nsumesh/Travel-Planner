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

    async getUserPrefs(cookie)
    {
        let prefs = await this.db.getUserPrefs(cookie);
        return prefs;
    }

    async updateUserPrefs(cookie, data)
    {
        await this.db.updateUserPrefs(cookie, data);
    }
    
    async get_results(type, prefs)
    {
        let results = await this.db.getListData(type, prefs);
        if(!results)
        {
            // will change this url implementation later on
            let url = type === "Flights" ? this.api.FLIGHT_URL : (type === "Lodging" ? this.api.LODGING_URL: this.api.INTRANSPORT_URL);
            let apiData = await this.api.getFromAPI(url);
            await this.db.updateListData(type, apiData);
            results = await this.db.getListData(type, prefs);
        }
        return results;
    }
}

module.exports = DataInterface;