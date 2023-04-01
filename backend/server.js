import { DataInterface } from './data-interface';

const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.send('Prefs!');
})

app.get('/cards', (req, res) => {
	res.send('Cards!');
})

app.get('/flights', (req, res) => {
	res.send('Flights!');
})

app.get('/hotels', (req, res) => {
	res.send('Hotels!');
})

app.get('/transport', (req, res) => {
	res.send('Transport!');
})

app.get('/summary', (req, res) => {
	res.send('Summary!');
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});