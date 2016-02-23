(function() {

  /**
  * Exports for handling utilities routes
  */
  module.exports = function(app) {

    laboratory = function(req, res) {
      // serve laboratory route
    },

    medicines = function(req, res) {
      // serve medicines route
    },

    pharmacy = function(req, res) {
      // serve pharmacy route
    },

    services = function(req, res) {
      var json = {};
      json.user = req.session.user;
      json.page = 'services';
      res.render('utilities/services.jade', json);
    }

    // Refer route map
    app.get('/utilities/services', services);
  }

}).call(this);
