export class Database
{
    // The db should be created in DataInterface.js
    constructor(db)
    {
        this.db = db;
    }

    async getUserPrefs(cookie)
    {
        try
        {
            let query = ``; // should have some relation to param cookie
            let prefs = await this.db.query(query);
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
            // the param data is the prefs we need to add to the db
            let query = ``; // should have some relation to params cookie and data
            await this.db.query(query);
        }
        catch(error)
        {
            console.error('ERROR IN UPDATING PREFS: ', error);
        }
    }
    
    async getListData(type, prefs)
    {
        let query = ``; // this query changes based on the category we want to get data from
        if(type === "Flights")
        {
            query += ``; // create this query based on the info in param prefs
        }
        if(type === "Lodging")
        {
            query += ``;
        }
        if(type === "Internal Transport")
        {
            query += ``;
        }

        try
        {
            let results = await this.db.query(query);
            return results;
        }
        catch(error)
        {
            console.error('ERROR IN RETRIEVING DATA: ', error);
        }
    }

    async updateListData(type, data)
    {
        let query = ``; // this query changes based on the category we want to put data in
        if(type === "Flights")
        {
            query += ``; // should involve adding param data to db
        }
        if(type === "Lodging")
        {
            query += ``;
        }
        if(type === "Internal Transport")
        {
            query += ``;
        }

        try
        {
            await this.db.query(query);
        }
        catch(error)
        {
            console.error('ERROR IN UPDATING DATA: ', error);
        }
    }
}