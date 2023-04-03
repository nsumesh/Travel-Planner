const DataInterface = require('./backend/data-interface.js');

const express = require('express');
const app = express();

app.get('/', (req, res) => {
	// res.send('Prefs!');
	res.sendFile(__dirname + '/frontend/index.html');
})

app.get('/cards', (req, res) => {
	res.send('Cards!');
})

app.get('/flights', (req, res) => {
	res.send('Flights!');
})

app.get('/lodging', (req, res) => {
	res.send('Lodging!');
})

app.get('/internal-transport', (req, res) => {
	res.send('Internal Transport!');
})

app.get('/summary', (req, res) => {
	res.send('Summary!');
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});