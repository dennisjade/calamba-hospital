(function() {

  var mongoose  = require('mongoose')
  var modelHelper = require('../helpers/model')

  var SupplySchema = {
    supplyName : {
      type : String,
      trim: true,
      index: true
    },
    supplyPrice: {
      type : Number
    },
    supplyQuantity: {
      type : Number
    },
    supplyDesc: {
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

  var Supply = modelHelper.createSchemaModel('Supply', SupplySchema);
  module.exports.model = Supply;

  // Define Supplies model methods
  module.exports = {

    saveSupply : function(newObj, callback) {
      var supplyObj = new Supply();
      for(prop in newObj) {
        if(SupplySchema[prop] != null) {
          supplyObj[prop] = newObj[prop];
        }
      }

      supplyObj.save(function(err) {
        if(err) return callback(err, null);
        callback(null, supplyObj);
      });
    },

    getAllSupplies : function(callback) {
      Supply.find({deleted: false}, function(err, supplies) {
        if(err) return callback(err, null);
        callback(null, supplies);
      });
    },

    getSupply : function(_id, callback) {
      Supply.findOne({_id: _id}, function(err, supplyObj) {
        if(err) return callback(err, null);
        if(!supplyObj) return callback("Supply `" + _id + "` not found", null);
        callback(null, supplyObj);
      });
    },

    updateSupply : function(_id, updateObj, callback) {
      Supply.findOne({_id: _id}, function(err, supplyObj) {
        if(err) return callback(err, null);
        if(!supplyObj) return callback("Supply `" + _id + "` not found", null);

        for(prop in updateObj) {
          if(SupplySchema[prop] != null) {
            supplyObj[prop] = updateObj[prop];
          }
        }

        supplyObj.updateDate = new Date();
        supplyObj.save(function(err) {
          if(err) return callback(err, null);
          callback(null, supplyObj);
        });
      });
    },

    removeSupply : function(_id, callback) {
      Supply.findOne({_id: _id}, function(err, supplyObj) {
        if(err) return callback(err, null);
        if(!supplyObj) return callback("Supply `" + _id + "` not found", null);

        supplyObj.deleted = true;
        supplyObj.save(function(err) {
          if(err) return callback(err, null);
          callback(null, supplyObj);
        });
      });
    }

  };

}).call(this)
