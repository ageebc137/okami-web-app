require('dotenv').load();

const express = require('express');
const hbs = require('hbs');
const yargs = require('yargs');
const path = require('path');
const axios = require('axios');
const mongoose = require('./db/mongoose');
const {authenticate} = require('./middleware/authenticate');
const {User} = require('./models/user');
const {Account} = require('./models/account');
const {ObjectId} = require('mongodb');
const bodyParser = require('body-parser');
const _ = require('lodash');

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

app.get(('/me'), authenticate, (req, res) => {
  res.send(req.user);
});

app.get(('/bulksearch'), (req, res) => {
  res.render('bulk.hbs');
});

app.get(('/register'), (req, res) => {
  res.render("register.hbs");
});

app.get(('/test'), (req,res) => {
  res.render("test.hbs");
});

app.get(('/login'), (req,res) => {
  res.header('login.hbs');
})

app.post(('/createUser'), (req, res) => {
  let body = _.pick(req.body, ['email', 'password', 'firstName', 'lastName','city', 'state']);
  let user = new User(body);
  let tokenauth;

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
      body._userid = new ObjectId(user._id);
      let account = new Account(body);
      account.save().then(() => {
        res.header('x-auth', token).send({user, account});
      }).catch((e) => {
        res.status(400).send(e);
      });

  }).catch((e) => {
    res.status(400).send(e);
  });


});

app.listen(port, () => {
  console.log(`Server is on port ${port}`);
});
