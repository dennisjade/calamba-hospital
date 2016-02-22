(function() {

  module.exports =  function(app){
    admission = function(req, res){
      var json = {}
      json.user =req.session.user
      json.page = 'admission'
      res.render('admission.jade', json)
    }

    app.get('/server/admission', admission)
  }

}).call(this);