const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true}).then(() => {
  console.log("You are connected to the database", process.env.MONGODB_URI);
})
  .catch((err) => console.log("No connection to database", err));

module.exports = {mongoose}
