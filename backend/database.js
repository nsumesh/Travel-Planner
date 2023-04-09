class Database
{
    // The db should be created in the DataInterface object
    constructor(db)
    {
        this.db = db;
    }

    getUserPrefs(cookie)
    {
        let query = ``; // should get preferences associated with the cookie
        return this.db.query(query)
            .then(prefs => {
                return prefs;
            })
            .catch(error => {
                console.error('ERROR IN GETTING PREFS: ', error);
            });
    }
    
    // the param "data" is the preferences we need to add to the db
    updateUserPrefs(cookie, data) 
    {
        let query = ``; // should update the cookie's preferences with "data"
        return this.db.query(query)
            .then(() => {
                console.log('PREFERENCES UPDATED');
            })
            .catch(error => {
                console.error('ERROR IN UPDATING PREFS: ', error);
            });
    }

    getUserItinerary(cookie)
    {
        let query = ``; // should get full itinerary associated with the cookie
        return this.db.query(query)
            .then(trip => {
                return trip;
            })
            .catch(error => {
                console.error('ERROR IN GETTING ITINERARY: ', error);
            });
    }
    
    // the param "data" is the itinerary details we need to add to the db
    updateUserItinerary(cookie, data) 
    {
        let query = ``; // should update the cookie's itinerary with "data"
        return this.db.query(query)
            .then(() => {
                console.log('ITINERARY UPDATED');
            })
            .catch(error => {
                console.error('ERROR IN UPDATING ITINERARY: ', error);
            });
    }
}

module.exports = Database;