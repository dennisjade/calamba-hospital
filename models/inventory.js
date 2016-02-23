(function() {
  var mongoose  = require('mongoose')
  var modelHelper = require('../helpers/model')

  var InventorySchema = {
    itemName : {
      type : String
      index: true
    },
    itemQuantity: {
      type : Number
    },
    itemDesc: {
      type : String,
      trim: true
    },
    deleted: {
      type: Boolean,
      default: false
    }
    updatedBy: {
      type: String
    },
    updateDate:{
      type: Date,
      "default": function() {
        return new Date()
      }
    }
  };

  var Inventory = modelHelper.createSchemaModel('Inventory', InventorySchema);
  module.exports.model = Inventory;


  module.exports = {

    saveItem = function(req, admitObj, callback) {
      var inventoryObj = new Inventory();
      for(prop in admitObj) {
        if(AdmissionSchema[prop] != null) {
          inventoryObj[prop] = admitObj[prop];
        }
      }

      inventoryObj.save(function(err) {
        if(err) return callback(err, null);
        callback(null, inventoryObj);
      });
    },

    getItems = function(callback) {
      Inventory.model.find({}, function(err, items) {
        if(err) return callback(err, null);
        callback(null, items);
      });
    },

    removeItem = function(_id, callback) {
      Inventory.model.find({_id: _id}, function(err, itemObj) {
        if(err) return callback(err, null);
        if(!itemObj) return callback("Item " + _id + " not found", null);

        itemObj.deleted = true;
        itemObj.save(function(err) {
          if(err) return callback(err, null);
          callback(null, itemObj);
        });
      });
    }

  }

}).call(this);
