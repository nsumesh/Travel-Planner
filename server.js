const express = require('express');
const app = express();
const DataInterface = require('./backend/data-interface.js');

let manager = new DataInterface();

// middleware that puts incoming data into req.body
app.use(express.json());

// serves static files of the homepage to browser
app.use('/', express.static('frontend/homepage-static'));

app.post('/initial-preferences', (req, res) => {
    let package = req.body;
    let results = manager.getFlights(package)
        .then(data => console.log(data))
        .catch(err => console.error("ERROR IN FETCHING DATA: ", err));
    res.send(package);
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});