(function() {

  var User = require('../../models/user')

  module.exports =  function(app) {
    
    authenticate = function(req, res) {
      User.validateAuth(req, req.body.username, req.body.password, function(err, data){
        if (err || !data){
          return res.redirect('/login?error=invalidLogin')
        }else{
          req.session.user = data
          return res.redirect('/home')
        }
      })
    }

    app.post('/server/authenticate', authenticate)
  }

}).call(this);