require('dotenv').load();

const express = require('express');
const hbs = require('hbs');
const yargs = require('yargs');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');

var app = express();
var publicPath = path.join(__dirname, '../public');
var partialsPath = path.join(__dirname, '../views/partials');
let port = process.env.PORT;

app.use(bodyParser.json());
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
  res.render('login.hbs');
});

app.post(('/search'), (req, res) => {
  axios.get(`${process.env.TRADEGOV}${process.env.TRADEGOV_API}&name=${req.body.queryURI}&fuzzy_name=true`).then((response) => {
    res.send(response.data);
  });
});

app.post(('/searchmany'), (req, res) => {

  let promiseArray = req.body.queryArray.filter(query => query !== '').map(query => {
    let  queryURI = encodeURIComponent(query),
          querycodeUrl =
          `${process.env.TRADEGOV}${process.env.TRADEGOV_API}&name=${queryURI}&fuzzy_name=true`;
          // return axios.get(querycodeUrl)
          return axios.get(querycodeUrl);
  });
  Promise.all(promiseArray).then((responseArray) => {
    responseArray = responseArray.map((res, i) => {
      return {
        result: res.data,
        query: req.body.queryArray[i]
      }
      });
  res.send(responseArray);
});
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
