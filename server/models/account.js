const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

var AccountSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  lastName: {
    type: String,
    minlength: 1,
    trim: true
  },
  city: {
    type: String,
    require: true,
    minlength: 1,
  },
  state: {
    type: String,
    require: true,
    minlength: 1
  },
  _userid: {
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },
  reports: {
    type: Array
  }
});

AccountSchema.methods.toJSON = function() {
    var account = this;
    var accountObject = account.toObject();
    return _.pick(accountObject, ["firstName", "lastName", "city", "state", "reports"]);
};

AccountSchema.methods.addReport = function(report) {
  var account = this;
  return account.update({
    $push:{
      reports: report
    }
  });
};

AccountSchema.methods.deleteReport = function(id) {
  var account = this;
  console.log(id);
  return account.update({
    $pull:{
      reports: {id}
    }
  });
}


AccountSchema.statics.findByUserId = function(id) {
  var Account = this;
  return Account.findOne({
    _userid: id
  }).catch((e) => {
    return Promise.reject();
  });
};

const Account = mongoose.model('Account', AccountSchema);

module.exports = {Account}
