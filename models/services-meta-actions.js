(function() {
  var mongoose  = require('mongoose')
  var modelHelper = require('../helpers/model')
  var Services = require('./services')

  var ServicesMetaSchema = {
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

  var ServicesMeta = modelHelper.createSchemaModel('Services.MetaAction', ServicesMetaSchema);
  module.exports.model = ServicesMeta;

  // Define Servicess Meta model methods
  module.exports = {

    createAction : function(serviceID, newObj, callback) {
      var fields = ['serviceName', 'servicePrice'],
          retval = {affected : 0};

      Services.getService(serviceID, function(err, oldObj) {
        modelHelper.getAffectedRows(serviceID, oldObj, newObj, fields, function(listAffected) {
          if(listAffected.length > 0) {
            ServicesMeta.collection.insert(listAffected, function(errBatch ,resp) {
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
