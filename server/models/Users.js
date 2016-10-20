var mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
  name: String,
  friends: Array,
  online: Boolean
});


var Users = module.exports = mongoose.model('Users', usersSchema);