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
var sslRedirect = require('heroku-ssl-redirect');




var app = express();
var publicPath = path.join(__dirname, '../public');
var partialsPath = path.join(__dirname, '../views/partials');
let port = process.env.PORT;

// enable ssl redirect
app.use(sslRedirect());

app.use(bodyParser.json());
app.use(express.static(publicPath));
hbs.registerPartials(partialsPath);

app.get(('/'), (req, res) => {
  res.render('homepage.hbs');
});

app.get(('/login'), (req, res) => {
  res.render('login.hbs');
});

app.post(('/search'), (req, res) => {
  axios.get(`${process.env.TRADEGOV}${process.env.TRADEGOV_API}&name=${req.body.queryURI}&fuzzy_name=true`).then((response) => {
    res.send(response.data);
  });
});

app.post(('/searchbatch'), (req, res) => {

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
});

app.get(('/join'), (req, res) => {
  res.render("registration.hbs");
});

app.get(('/batchsearch'), (req,res) => {
  res.render('batchpage.hbs');
});

app.get(('/myaccount'), (req,res) => {
  res.render('profilepage.hbs');
});

app.post(('/createaccount'), (req, res) => {
  let body = _.pick(req.body, ['email', 'password', 'firstName', 'lastName','city', 'state']);
  let user = new User(body);

  user.save().then(() => {
      body._userid = new ObjectId(user._id);
      let account = new Account(body);
      return account.save().then(() => {
          res.send({user, account});
      });
  }).catch((e) => {
    res.status(400).send(e);
  });

});

app.get('/termsofservice', (req,res) => {
  res.render('termsofservice.hbs');
});

app.post(('/getuser'), (req, res) => {

  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    Account.findByUserId(user._id)
      .then((account) => {
            res.send({account, user});
          });
    }).catch((e) => {
        res.status(400).send();
  });
});

app.post(('/update'), (req, res) => {
  let id = new ObjectId(req.body._userid);
  let report = req.body.report;
  Account.findByUserId(id).then((account) => {
    return account.addReport(report);
  }).then((response) => {
    return Account.findByUserId(id);
  }).then((account) => {
    res.send(account);
  }).catch((e) => {
    res.send(e);
  });
});

app.post(('/delete'), (req, res) => {
  console.log(req.body);
  let id = new ObjectId(req.body._userid);
  let sdnId = req.body.sdnId;
  Account.findByUserId(id).then((account) => {
    console.log(account);
    return account.deleteReport(sdnId);
  }).then((response) => {
    return Account.findByUserId(id);
  }).then((account) => {
    res.send(account);
  }).catch((e) => {
    res.send(e);
  });
});

app.get(('/tryit'), (req, res) => {
  res.render('trialresults.hbs');
});

app.get(('/results'), (req, res) => {
  res.render('results.hbs');
});

app.listen(port, () => {
  console.log(`Server is on port ${port}`);
});
