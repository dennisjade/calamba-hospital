(function() {
  var Patient = require('../../models/patient')

  module.exports = function(app){

    managePatients = function(req, res){
      var json = {}
      json.user =req.session.user
      json.page = 'manage-patient'
      res.render('patient/manage-patient.jade', json)
    }

    app.get('/server/manage/patients', managePatients)
  }

}).call(this)