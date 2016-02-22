(function() {
  var mongoose  = require('mongoose')
  var modelHelper = require('../helpers/model')

  var PatientSchema = {
    patientId :{
      type: Number,
      index:true,
      unique: true
    },
    fname: {
      type: String,
      index: true,
      trim:true,
      lowercase:true
    },
    mname: {
      type: String,
      index: true,
      trim:true,
      lowercase:true
    },
    lname: {
      type: String,
      index: true,
      trim:true,
      lowercase:true
    },
    gender: {
      type: String,
      index: true,
      trim:true
    },
    bday: {
      type: Date
    },
    address: {
      type: String
    },
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

  var Patient = modelHelper.createSchemaModel('Patient', PatientSchema);
  module.exports.model = Patient;


  module.exports.getCreateOrUpdate = function(req, patientObj, callback){
    var query = {patientId:patientObj.patientId}
    Patient.findOne(query).exec(function(err, data){
      if (err)
        return callback(err, null)

      if (!data){
        module.exports.createPatient(req, patientObj, function(err, patient){
          if (err){
            return callback(err, null)
          }else{
            return callback(null, patient)
          }
        })
      }else{
        return callback(null, data)
      }
    })
  }

  module.exports.createPatient = function(req, patientObj, callback){
    var patient = new Patient();
    for (prop in patientObj) {
      if (PatientSchema[prop] != null) {
        patient[prop] = patientObj[prop];
      }
    }

    patient.save(function(err){
      if (err)
        return callback(err, null)

      return callback(null, patient)
    })
  }


}).call(this);