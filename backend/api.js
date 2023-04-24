const Amadeus = require('amadeus');

class API {
  constructor() 
  {
    // Amadeus API connection
    this.amadeus = new Amadeus({
      clientId: '80B4rAGUjIF5uHUeOe6W2USRyUGFO0ug',
      clientSecret: 'NILxAX1ZQT8v9WPP'
    });
  }

  async getCityCodes(cityName)
  {
    try 
    {
      let details = { keyword: cityName, subType: Amadeus.location.city }
      let response = await this.amadeus.referenceData.locations.get(details);
      // high prob that first entry is a match
      if(response.data.length != 0)
      {
        let elem = response.data[0];
        return { iata: elem.iataCode, cityCode: elem.address.cityCode };
      }
      return "CITY CODES NOT FOUND";
    } 
    catch(error) 
    {
      console.error("ERROR IN FETCHING CITY CODES DATA: ", error);
    }
  }
  
  async getFlights(preferences) 
  {
    try
    {
      let departCodes = await this.getCityCodes(preferences.originLocationCode);
      let destCodes = await this.getCityCodes(preferences.destinationLocationCode);
      preferences.originLocationCode = departCodes.iata;
      preferences.destinationLocationCode = destCodes.iata;

      let response = await this.amadeus.shopping.flightOffersSearch.get(preferences);
      return response;
    } 
    catch(error) 
    {
      console.error("ERROR IN FETCHING FLIGHT DATA: ", error);
    }
  }

  async getHotels(preferences)
  {
    /* Example  
    let pref = {
      cityCode: '', // Need city ()
      adults: '2', 
      'checkInDate': '2023-10-10', 
      'checkOutDate': '2023-10-12',
      roomQuantity: 1, 
      paymentPolicy: GUARANTEE, 
      priceRange: '200-300',
      currency: 'USD',
      boardType: 'FULL_BOARD', 
      hotelIds: 'RTPAR001',
    }
    */

    let pref = 
    {
      cityCode: 'SFO',
      adults: '2', 
      checkInDate: '2023-05-10', 
      checkOutDate: '2023-05-12',
    }
    
    
    this.amadeus.referenceData.locations.hotels.byCity.get({cityCode: pref.cityCode})
      .then(repsonse => {
        pref["hotelIds"] = repsonse.data.map(obj => obj.hotelId).slice(0,180).join()
        pref["bestRateOnly"] = true
        pref["includeClosed"] = false
        delete pref.cityCode

        return this.amadeus.shopping.hotelOffersSearch.get(pref)
          .then(response => response.data)
          .then(response => console.log(response))
          .catch(err => console.error("ERROR IN FETCHING DATA:", err))
      })
    }

  async getRestuarant(preferences)
  {

    let param = new URLSearchParams();
    param.set("q", "language"); 
    param.set(preferences.cityCode, "en_US")

    let location = await fetch('https://worldwide-restaurants.p.rapidapi.com/typeahead', {
      method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '2c6c2eb443msh480181c2458bcdbp10edb5jsn81e8919e6c2b',
            'X-RapidAPI-Host': 'worldwide-restaurants.p.rapidapi.com'
        },
        body: param
    })

    let info = await location.json(); 
    let location_id = info.results.data[0].result_object.location_id; 
    console.log(info.results.data[0].result_object.location_id)

    let encodedParams = new URLSearchParams();
    encodedParams.set("currency", "language", "limit", "location_id");
    encodedParams.set("USD", "en_US", 200, location_id);

    var options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '2c6c2eb443msh480181c2458bcdbp10edb5jsn81e8919e6c2b',
            'X-RapidAPI-Host': 'worldwide-restaurants.p.rapidapi.com'
        },
        body: encodedParams
    };

    fetch('https://worldwide-restaurants.p.rapidapi.com/search', options)
      .then(response => response.json())
      .catch(err => console.error(err));
  }


  async getToursAndAttractions(preferences)
  {
    this.amadeus.shopping.activities.get(preferences)
        .then(response => response)
        .then(response => console.log(response))
        .catch(err => console.error("ERROR IN FETCHING DATA:", err));
  }

  async getRentalCars(preferences){

    // ALL THE PARAMETRS WE NEED 
    // var parameters = {
    //   currency:"USD",
    //   locale:"en-us",
    //   drop_off_latitude:"50.08773",
    //   drop_off_longitude:"14.421133",
    //   sort_by:"price_low_to_high", 
    //   drop_off_datetime: "2023-06-30 16:00:00",
    //   pick_up_latitude:"50.08773",
    //   pick_up_longitude:"14.421133",
    //   pick_up_datetime:"2023-06-29 16:00:00",
    //   from_country: "it"
    // };


    let query =  new URLSearchParams(preferences);

    let url = 'https://booking-com.p.rapidapi.com/v1/car-rental/search?'+decodeURIComponent(query.toString()); 
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/octet-stream',
        'X-RapidAPI-Key': '2c6c2eb443msh480181c2458bcdbp10edb5jsn81e8919e6c2b',
        'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
      }
    };
    
   
    let response = await fetch(url, options).catch(err => console.error("ERROR IN FETCHING DATA:", err));
    
    let data = await response.text(); 
  
    console.log(data); 
  }


  async getPublicTranist(preferences)
  {
   // Create the parameters for the routing request:
  var routingParameters = {
    // The start point of the route:
    origin:'41.79457,12.25473',
    // The end point of the route:
    destination:'41.90096,12.50243',
  };

  let query =  new URLSearchParams(preferences);
  let url = "https://transit.router.hereapi.com/v8/routes?apikey=FNdz8YE1AkNUN4SS2fvYdMNIezN6OJZ3HLVhgPrwzxg&"+decodeURIComponent(query.toString())
  let response = await fetch(url, {
    method: 'GET'
  }).catch(err => console.error("ERROR IN FETCHING DATA:", err));
  
  let data = await response.json(); 
  
  //console.log(data); 
  return data; 

  }
}

module.exports = API;