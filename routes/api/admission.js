(function() {
  var Patient = require('../../models/patient')
  var Admission = require('../../models/admission')

  module.exports = function(app){

    admitPatient = function(req, res){
      var json = {}
      json.status = 200
      json.msg = 'Patient admitted successfully.'
      json.data = {}

      admit = function(req, admitObj, patientId){
        Admission.admit(req, admitObj, function(err, data){
          if (err){
            json.status = 500
            json.msg = 'Failed admitting patient'
            json.data={error:err, patientId:''}
          }else{
            json.data = {error:'', patientId:patientId}
          }
          return res.json(json)
        })
      }

      var admitObj = {
          complain : req.body.complain,
          updatedBy : req.session.user.username
      }
      if (req.body.patientId){
        admitObj.patientRef = req.body.pid
        admit(req, admitObj, req.body.patientId)
      }else{
        var patientObj = {
          fname  : req.body.fname,
          lname  : req.body.lname,
          mname  : req.body.mname,
          gender : req.body.gender,
          bday   : req.body.bday,
          address: req.body.address
        }
        Patient.createPatient(req, patientObj, function(err, patient){
          if (err)
            return res.json

          admitObj.patientRef = patient._id
          admit(req, admitObj, patient.patientId)
        })
      }

      
    }

    app.post('/api/admit/patient', admitPatient)
  }
}).call(this)