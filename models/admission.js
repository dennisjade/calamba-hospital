(function() {
  var mongoose  = require('mongoose')
  var modelHelper = require('../helpers/model')

  var AdmissionSchema = {
    patientRef : {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
      index: true
    },
    complain: {
      type : String
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

  var Admission = modelHelper.createSchemaModel('Admission', AdmissionSchema);
  module.exports.model = Admission;


  module.exports.admit = function(req, admitObj, callback) {
    var admission = new Admission();
    for (prop in admitObj) {
      if (AdmissionSchema[prop] != null) {
        if (prop=='patientRef')
          admitObj[prop] = mongoose.Types.ObjectId(admitObj[prop])
        admission[prop] = admitObj[prop];
      }
    }

    admission.save(function(err){
      if (err)
        return callback(err, null)

      return callback(null, admission)
    })
  }

  module.exports.cancelAdmission = function(req, admitObj, callback){
    var removeQuery = {}
    admission.remove(removeQuery, function(err, data){
      if (err)
        return callback(err, null)

      return callback(null, data)
    })
  }

}).call(this);
