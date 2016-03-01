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
    isCurrentlyAdmitted: {
      type: Boolean,
      default: false
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


  module.exports.getPatients = function(req, query, callback){
    if (!query || typeof(query)!='object')
      return callback('Wrong query type', null)

    Patient.find(query).exec(function(err, data){
      if (err)
        return callback(err, null)
      else
        return callback(null, data)
    })
  }

  module.exports.getPatient = function(req, pid, callback){
    if (!pid )
      return callback('No patient id specified', null)

    var query = {_id:mongoose.Types.ObjectId(pid)}
    Patient.findOne(query).exec(function(err, data){
      if (err)
        return callback(err, null)
      else
        return callback(null, data)
    })
  }

}).call(this);
