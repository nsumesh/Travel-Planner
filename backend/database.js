class Database 
{
    constructor(db) 
    {
      // The db should be created in the DataInterface object
      this.db = db;
    }
  
    async getUserPrefs(cookie) 
    {
      let query = ``; // should get preferences associated with the cookie
      try 
      {
        let prefs = await this.db.query(query);
        return prefs;
      } 
      catch(error) 
      {
        console.error('ERROR IN GETTING PREFS: ', error);
      }
    }
  
    // the param "data" is the preferences we need to add to the db
    async updateUserPrefs(cookie, data) 
    {
      let query = ``; // should update the cookie's preferences with "data"
      try 
      {
        await this.db.query(query);
        console.log('PREFERENCES UPDATED');
      } 
      catch(error) 
      {
        console.error('ERROR IN UPDATING PREFS: ', error);
      }
    }
  
    async getUserItinerary(cookie) 
    {
      let query = ``; // should get full itinerary associated with the cookie
      try 
      {
        let trip = await this.db.query(query);
        return trip;
      } 
      catch(error) 
      {
        console.error('ERROR IN GETTING ITINERARY: ', error);
      }
    }
  
    // the param "data" is the itinerary details we need to add to the db
    async updateUserItinerary(cookie, data) 
    {
      let query = ``; // should update the cookie's itinerary with "data"
      try 
      {
        await this.db.query(query);
        console.log('ITINERARY UPDATED');
      } 
      catch(error) 
      {
        console.error('ERROR IN UPDATING ITINERARY: ', error);
      }
    }
  }
  
  module.exports = Database;  