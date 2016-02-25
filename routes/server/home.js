(function() {

  module.exports =  function(app){

    showHome = function(req, res) {
      var json = {error:null, page: "Login"}
      if (!req.session.user){
        return res.redirect('/login')
      }else{
        json.user = req.session.user;
        json.page = "home";
        return res.render('home.jade', json)
      };
    }

    showLogin = function(req, res){
      var json = {}
      json.error = req.query.error || '';
      json.page = "login";
      res.render('login.jade', json)
    }

    logout = function(req, res) {
      req.session.user = null
      res.redirect('/login')
    }

    app.get('/', showHome)
    app.get('/home', showHome)
    app.get('/login', showLogin)
    app.get('/logout', logout)
  }
}).call(this);
