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

}).call(this)