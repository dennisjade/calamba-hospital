(function() {
  var mongoose  = require('mongoose')
  var modelHelper = require('../helpers/model')

  var ServiceSchema = {
    serviceName : {
      type : String,
      trim: true,
      index: true
    },
    servicePrice: {
      type : Number
    },
    serviceDesc: {
      type : String,
      trim: true
    },
    deleted: {
      type: Boolean,
      default: false
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      index: true
    },
    addedDate: {
      type: Date,
      default: function() {
        return new Date()
      }
    },
    updateDate:{
      type: Date,
      default: function() {
        return new Date()
      }
    }
  };

  var Service = modelHelper.createSchemaModel('Services', ServiceSchema);
  module.exports.model = Service;

  // Define Services model methods
  module.exports = {

    saveService : function(newObj, callback) {
      var serviceObj = new Service();
      for(prop in newObj) {
        if(ServiceSchema[prop] != null) {
          serviceObj[prop] = newObj[prop];
        }
      }

      serviceObj.save(function(err) {
        if(err) return callback(err, null);
        callback(null, serviceObj);
      });
    },

    getAllServices : function(callback) {
      Service.find({deleted: false}, function(err, services) {
        if(err) return callback(err, null);
        callback(null, services);
      });
    },

    getService : function(_id, callback) {
      Service.findOne({_id: _id}, function(err, serviceObj) {
        if(err) return callback(err, null);
        if(!serviceObj) return callback("Item `" + _id + "` not found", null);
        callback(null, serviceObj);
      });
    },

    updateService : function(_id, updateObj, callback) {
      Service.findOne({_id: _id}, function(err, serviceObj) {
        if(err) return callback(err, null);
        if(!serviceObj) return callback("Item `" + _id + "` not found", null);

        serviceObj.updateDate = new Date();

        for(prop in updateObj) {
          if(ServiceSchema[prop] != null) {
            serviceObj[prop] = updateObj[prop];
          }
        }

        serviceObj.save(function(err) {
          if(err) return callback(err, null);
          callback(null, serviceObj);
        });
      });
    },

    removeService : function(_id, callback) {
      Service.findOne({_id: _id}, function(err, serviceObj) {
        if(err) return callback(err, null);
        if(!serviceObj) return callback("Item `" + _id + "` not found", null);

        serviceObj.deleted = true;
        serviceObj.save(function(err) {
          if(err) return callback(err, null);
          callback(null, serviceObj);
        });
      });
    }

  }

}).call(this);
