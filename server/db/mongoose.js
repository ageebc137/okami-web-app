const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Okami', {useNewUrlParser: true}).then(() => {
  console.log("You are connected to the database")
})
  .catch((err) => console.log("No connection to database", err));

module.exports = {mongoose}
