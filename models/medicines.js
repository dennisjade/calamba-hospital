(function() {

  var mongoose  = require('mongoose')
  var modelHelper = require('../helpers/model')

  var MedicineSchema = {
    medicineName : {
      type : String,
      trim: true,
      index: true
    },
    medicineQuantity: {
      type : Number
    },
    medicineDesc: {
      type : String,
      trim: true
    },
    medicineSource: {
      type: String,
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

  var Medicine = modelHelper.createSchemaModel('Medicines', MedicineSchema);
  module.exports.model = Medicine;

  // Define Medicines model methods
  module.exports = {

    saveMedicine : function(newObj, callback) {
      var medicineObj = new Medicine();
      for(prop in newObj) {
        if(MedicineSchema[prop] != null) {
          medicineObj[prop] = newObj[prop];
        }
      }

      medicineObj.save(function(err) {
        if(err) return callback(err, null);
        callback(null, medicineObj);
      });
    },

    getAllMedicines : function(callback) {
      Medicine.find({deleted: false}, function(err, medicines) {
        if(err) return callback(err, null);
        callback(null, medicines);
      });
    },

    getMedicine : function(_id, callback) {
      Medicine.findOne({_id: _id}, function(err, medicineObj) {
        if(err) return callback(err, null);
        if(!medicineObj) return callback("Item `" + _id + "` not found", null);
        callback(null, medicineObj);
      });
    },

    updateMedicine : function(_id, updateObj, callback) {
      Medicine.findOne({_id: _id}, function(err, medicineObj) {
        if(err) return callback(err, null);
        if(!medicineObj) return callback("Item `" + _id + "` not found", null);

        for(prop in updateObj) {
          if(MedicineSchema[prop] != null) {
            medicineObj[prop] = updateObj[prop];
          }
        }

        medicineObj.save(function(err) {
          if(err) return callback(err, null);
          callback(null, medicineObj);
        });
      });
    },

    removeMedicine : function(_id, callback) {
      Medicine.findOne({_id: _id}, function(err, medicineObj) {
        if(err) return callback(err, null);
        if(!medicineObj) return callback("Item `" + _id + "` not found", null);

        medicineObj.deleted = true;
        medicineObj.save(function(err) {
          if(err) return callback(err, null);
          callback(null, medicineObj);
        });
      });
    }

  }

}).call(this);
