require('dotenv').load();

const express = require('express');
const hbs = require('hbs');
const yargs = require('yargs');
const path = require('path');

var app = express();
var publicPath = path.join(__dirname, '../public');
var partialsPath = path.join(__dirname, '../views/partials');
let port = process.env.PORT;


app.use(express.static(publicPath));
hbs.registerPartials(partialsPath);

app.get(('/'), (req, res) => {
  res.render('home.hbs');
});

app.get(('/about'), (req, res) => {
  res.render('about.hbs');
});

app.get(('/contacts'), (req, res) => {
  res.render('contacts.hbs');
});

app.get(('/login'), (req, res) => {
  res.render('/login');
});

app.post(('/search'), (req, res) => {
  res.send('chicken');
});


app.get(('/results'), (req, res) => {
  res.render('results.hbs');
});

app.get(('/bulksearch'), (req, res) => {
  res.render('bulk.hbs');
})

app.listen(port, () => {
  console.log(`Server is on port ${port}`);
});
