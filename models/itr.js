(function() {
  var mongoose  = require('mongoose')
  var modelHelper = require('../helpers/model')

  var ITRSchema = {
    patientRef : {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
      index: true
    },
    bp:{
      type: String
    },
    temp: {
      type: String
    },
    weight: {
      type: String
    },
    pr: {
      type: String
    },
    rr: {
      type: String
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

  var ITR = modelHelper.createSchemaModel('ITR', ITRSchema);
  module.exports.model = ITR;

}).call(this)