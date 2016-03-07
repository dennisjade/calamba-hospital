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
}).call(this)