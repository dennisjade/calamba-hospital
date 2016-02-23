(function() {
  var mongoose  = require('mongoose')
  var modelHelper = require('../helpers/model')

  var InventorySchema = {
    itemName : {
      type : String,
      trim: true,
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
    },
    updatedBy: {
      type: String,
      trim: true
    },
    updateDate:{
      type: Date,
      default: function() {
        return new Date()
      }
    }
  };

  var Inventory = modelHelper.createSchemaModel('Inventory', InventorySchema);
  module.exports.model = Inventory;

  // Define Inventory model methods
  module.exports = {

    saveItem : function(newObj, callback) {
      var inventoryObj = new Inventory();
      for(prop in newObj) {
        if(InventorySchema[prop] != null) {
          inventoryObj[prop] = newObj[prop];
        }
      }

      inventoryObj.save(function(err) {
        if(err) return callback(err, null);
        callback(null, inventoryObj);
      });
    },

    getAllItems : function(callback) {
      Inventory.find({deleted: false}, function(err, items) {
        if(err) return callback(err, null);
        callback(null, items);
      });
    },

    getItem : function(_id, callback) {
      Inventory.find({_id: _id}, function(err, itemObj) {
        if(err) return callback(err, null);
        if(!itemObj) return callback("Item `" + _id + "` not found", null);
        callback(null, itemObj);
      });
    },

    updateItem : function(_id, updateObj, callback) {
      Inventory.findOne({_id: _id}, function(err, itemObj) {
        if(err) return callback(err, null);
        if(!itemObj) return callback("Item `" + _id + "` not found", null);

        for(prop in updateObj) {
          if(InventorySchema[prop] != null) {
            itemObj[prop] = updateObj[prop];
          }
        }

        itemObj.save(function(err) {
          if(err) return callback(err, null);
          callback(null, itemObj);
        });
      });
    },

    removeItem : function(_id, callback) {
      Inventory.findOne({_id: _id}, function(err, itemObj) {
        if(err) return callback(err, null);
        if(!itemObj) return callback("Item `" + _id + "` not found", null);

        itemObj.deleted = true;
        itemObj.save(function(err) {
          if(err) return callback(err, null);
          callback(null, itemObj);
        });
      });
    }

  }

}).call(this);
