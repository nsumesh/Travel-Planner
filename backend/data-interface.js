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
    /*
    Sample input:
        budget: "500"
        depart: "2023-04-28"
        destination: "BOS"
        one-way: "false"
        origin: "MCO"
        people: "1"
        return: "2023-04-30"
        transportation_iata: "nk"
        transportation_info: "Flight #103<br>4:00 PM - 7:01 PM<br>Nonstop<br>$145.78"
        transportation_name: "Spirit Airlines"
        transportation_price: "145.78"
    */

    // convert YYYY-MM-DD to JavaScript datetime object
    make_datetime_object(str) {
        return Date.parse(str)
    }

    async createTrip(info)
    {
        let reformatted = {}
        reformatted['Trips'] = {
            budget: info['budget'],
            depart_date: this.make_datetime_object(info['depart']),
            return_date: this.make_datetime_object(info['return']),
            location: info['destination'],
            num_people: info['people']
        }

        reformatted['Flights'] = {
            'departing': [
                {
                    airline_name: info['transportation_name'],
                    airline_iata: info['transportation_iata'],
                    depature_time: this.make_datetime_object(info['depart']), // these might be different in the future
                    arrival_time: this.make_datetime_object(info['return']), //
                    depature_location: info['origin'],
                    arrival_location: info['destination'],
                    price: info['transportation_price']
                }
            ],
            'returning': [
                            // How can I tell if there are returning flights?
            ]
        }

        return await this.db.createTrip(reformatted)
    }

    async getTrip(tripID)
    {
        let allInfo = await this.db.getTrip(tripID)
        let trip = allInfo['Trips']

        // handle trip
        let one_way = allInfo['Flights']['returning'].length == 0 ? true : false
        
        // ! this doesn't work for multiple flights, assuming one for now
        let flight = allInfo['Flights']['departing'][0]
        let origin = flight.departure_location
        
        let response = {
            'budget': trip.budget,
            'depart': trip.depart_date.toISOString().substring(0, 10), // toISOString() returns it in YYYY-MM-DD format, just take first 10 characters
            'destination': trip.location,
            'one-way': one_way,
            'origin': origin,
            'people': trip.num_people,
            'return': (trip.return_date != null) ? trip.return_date.toISOString().substring(0, 10) : null, // toISOString() returns it in YYYY-MM-DD format, just take first 10 characters
            'transportation_iata': flight.airline_iata,
            'transportation_name': flight.airline_name,
            'transportation_price': flight.price
        }

        return response
    }
}

module.exports = DataInterface;