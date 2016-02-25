(function() {

  module.exports =  function(app){
    admit = function(req, res){
      var json = {}
      json.user =req.session.user
      json.page = 'admission'
      res.render('admission/admit.jade', json)
    }

    cancelAdmission = function(req, res){
      var json = {}
      json.user =req.session.user
      json.page = 'cancel-admission'
      res.render('admission/cancel-admit.jade', json)
    }

    app.get('/server/admit', admit)
    app.get('/server/cancel/admission', cancelAdmission)
  }

}).call(this);