(function() {

  var mongoose  = require('mongoose')
  var modelHelper = require('../helpers/model')
  var Supplies = require('./supplies')

  var SuppliesMetaSchema = {
    metaRef : {
      type: mongoose.Schema.ObjectId,
      ref: 'Services',
      index: true
    },
    columnAffected : {
      type : String,
      trim: true,
      index: true
    },
    oldValue: {
      type : String,
      trim: true
    },
    newValue: {
      type : String,
      trim: true
    },
    changeDate:{
      type: Date,
      default: function() {
        return new Date()
      }
    }
  };

  var SuppliesMeta = modelHelper.createSchemaModel('Supplies.MetaAction', SuppliesMetaSchema);
  module.exports.model = SuppliesMeta;

  // Define Supplies Meta model methods
  module.exports = {

    createAction : function(supplyID, newObj, callback) {
      var fields = ['supplyName', 'supplyPrice', 'supplyQuantity'];

      Supplies.getSupply(supplyID, function(err, oldObj) {
        newObj.supplyQuantity = (newObj.supplyQuantity*1 + oldObj.supplyQuantity*1);
        modelHelper.getAffectedRows(supplyID, oldObj, newObj, fields, function(listAffected) {
          if(listAffected.length > 0) {
            SuppliesMeta.collection.insert(listAffected, function(errBatch ,resp) {
              if(errBatch) return callback(errBatch, null);
              callback(null, {affected: listAffected.length});
            });
          } else {
            callback(null, {affected: 0})
          }
        });
      });
    }

  };

}).call(this)
