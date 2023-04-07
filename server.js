const express = require('express');
const app = express();
const DataInterface = require('./backend/data-interface.js');

// middleware that puts incoming data into req.body
app.use(express.json());

// serves static files to browser
app.use(express.static('frontend'));

app.post('/initial-preferences', (req, res) => {
    let package = req.body;
    res.send(package);
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});