(function() {

  /**
  * Exports for handling utilities routes
  */
  module.exports = function(app) {

    laboratory = function(req, res) {
      // serve laboratory route
    },

    pharmacy = function(req, res) {
      var json = {};
      json.user = req.session.user;
      json.page = 'pharmacy';
      res.render('utilities/pharmacy.jade', json);
    },

    services = function(req, res) {
      var json = {};
      json.user = req.session.user;
      json.page = 'services';
      res.render('utilities/services.jade', json);
    }

    // Refer route map
    app.get('/utilities/services', services);
    app.get('/utilities/pharmacy', pharmacy);
  }

}).call(this);
