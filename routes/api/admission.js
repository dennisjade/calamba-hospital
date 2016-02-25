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
            json.data={error:JSON.stringify(err), patientId:'', pid:''}
          }else{
            json.data = {error:'', patientId:patientId, pid: data._id}
          }
          return res.json(json)
        })
      }

      var admitObj = {
          complain : req.body.complain,
          updatedBy : req.session.user.username
      }
      /*pid value means there is already an existing record of the patient in the system*/
      if (req.body.pid){
        admitObj.patientRef = req.body.patientId
        admit(req, admitObj, req.body.patientId)
      }else{
        var patientObj = {
          fname  : req.body.fname,
          lname  : req.body.lname,
          mname  : req.body.mname,
          gender : req.body.gender,
          bday   : req.body.bday,
          address: req.body.address,
          isCurrentlyAdmitted: true
        }
        Patient.createPatient(req, patientObj, function(err, patient){
          if (err)
            return res.json

          admitObj.patientRef = patient._id
          admit(req, admitObj, patient.patientId)
        })
      }
      
    }

    cancellAdmission = function(req, res){

      var pid = req.params.pid
      var json = {}
      json.status = 200
      json.msg = 'Patient admission was cancelled successfully'
      json.data = {}

      Patient.getPatient(req, pid, function(err, patient){
        if (err){
          json.status = 500
          json.msg = 'Failed getting patient info'
          json.data={error:JSON.stringify(err)}
        }else{
          patient.isCurrentlyAdmitted = false
          patient.updatedBy = req.session.user.username
          patient.save(function(e){
            var admitObj = {}
            Admission.cancelAdmission(req, admitObj, function(err, data){
              if (err){
                json.status = 500
                json.msg = 'Failed cancelling admission'
                json.data={error:JSON.stringify(err)}
              }else{
                json.data = data
              }

              return res.json(json)
            })
          })
        }
        return res.json(json)
      })
    }

    app.post('/api/admit/patient', admitPatient)
    app.delete('/api/cancel/admission/:pid', cancellAdmission)
  }
}).call(this)