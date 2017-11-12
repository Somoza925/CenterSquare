var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({ // creates structure for the User
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  }
});
var User = mongoose.model('User', UserSchema); // takes the Schema and returns a Javascript object
module.exports = User;