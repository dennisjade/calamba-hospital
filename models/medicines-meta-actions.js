(function() {
  var mongoose  = require('mongoose')
  var modelHelper = require('../helpers/model')
  var Medicine = require('./medicines')

  var MedicinesMetaSchema = {
    metaRef : {
      type: mongoose.Schema.ObjectId,
      ref: 'Medicines',
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

  var MedicineMeta = modelHelper.createSchemaModel('Medicines.MetaAction', MedicinesMetaSchema);
  module.exports.model = MedicineMeta;

  // Define Medicines Meta model methods
  module.exports = {

    createAction : function(medicineID, newObj, callback) {
      var fields = ['medicineName', 'medicineQuantity', 'medicineSource'],
          retval = {affected : 0};

      Medicine.getMedicine(medicineID, function(err, oldObj) {
        newObj.medicineQuantity = (newObj.medicineQuantity*1 + oldObj.medicineQuantity*1);
        modelHelper.getAffectedRows(medicineID, oldObj, newObj, fields, function(listAffected) {
          if(listAffected.length > 0) {
            MedicineMeta.collection.insert(listAffected, function(errBatch ,resp) {
              if(errBatch) return callback(errBatch, null);
              callback(null, {affected: listAffected.length});
            });
          } else {
            callback(null, {affected: 0})
          }
        });
      });
    }

  }

}).call(this);
