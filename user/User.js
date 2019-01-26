var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  name: {
    type: String,
    required: true
  },
  email: String,
  password: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');