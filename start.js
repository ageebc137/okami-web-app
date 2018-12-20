const express = require('express');
const hbs = require('hbs');
const yargs = require('yargs');

var app = express();

let port = 3000;

app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// const argv = yargs
//     .options({
//       q: {
//           demand: true,
//           alias: 'query',
//           describe: 'Query to fetch SDN entity or individual',
//           string: true
//       }
//     })
//       .help()
//       .alias('help', 'h')
//       .argv;
//
// console.log('You searched:', argv.query);
//
// let queryURI = encodeURIComponent(argv.query);
// let querycodeUrl = `https://api.trade.gov/consolidated_screening_list/search?api_key=lVRffURh533foYGOFnvH6gnA&q=${queryURI}`
//
// axios.get(querycodeUrl).then((response) => {
//   console.log(JSON.stringify(response.data.results, undefined, 2));
// }).catch((e) => {
//   console.log(e.message);
// })

app.get(('/'), (req, res) => {
  res.render('home.hbs');
});

app.get(('/about'), (req, res) => {
  res.render('about.hbs');
});

app.get(('/contacts'), (req, res) => {
  res.render('contacts.hbs');
});

app.get(('/results'), (req, res) => {
  res.render('results.hbs');
});


app.listen(port, () => {
  console.log(`Server is on port ${port}`);
});
