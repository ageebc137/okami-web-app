const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message:`{VALUE} is not a valid email`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  tokens: [{
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      required: true
    }
  }]

});

/*
  toJSON method only returns the email and id of a User account.
*/

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ["email", "_id"]);
}

/*
  findByToken return a User account by token information.
*/


UserSchema.statics.findByCredentials = function(email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
      if (!user) {
        return Promise.reject();
      }
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              resolve(user);
            }else{
              reject();
            }
        });
      });
  });
}


UserSchema.pre('save', function(next) {
  var user = this;
  if (user.isModified('password')) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
        });
      });
  }else{
    next();
  }
});

const User = mongoose.model('User', UserSchema)

module.exports = {User}
