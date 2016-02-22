(function() {
  var mongoose  = require('mongoose')
  var modelHelper = require('../helpers/model')

  var UserSchema = {
    name: String,
    username: {
      type: String,
      index:true,
      lowercase:true,
      trim:true
    },
    password: {
      type: String,
      index:true
    },
    permissions:{
      type: [String],
      "default": []         //admin,opd,lab,meds,pharma,,billing
    },
    updateBy: {
      type: String
    },
    updatedDate: {
      type: Date,
      default: new Date()
    },
    createdBy:{
      type: String
    },
    createdDate: {
      type: Date,
      "default": function() {
        return new Date(0)
      }
    }
  };

  var User = modelHelper.createSchemaModel('User', UserSchema);
  module.exports.model = User;

  module.exports.validateAuth = function(req, username, password, callback){
    var query = {username:username.trim(), password:password.trim()}
    User.findOne(query).exec( function (err, data){
      if (err)
        return callback(err, null);
      else
        return callback(null, data);
    })
  }

}).call(this);