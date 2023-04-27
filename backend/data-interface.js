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

    async createTrip(tripInformation)
    {
        return await this.db.createTrip(tripInformation)
    }

    async getTrip(tripID)
    {
        return await this.db.getTrip(tripID)
    }
}

module.exports = DataInterface;