(function() {

  /**
  * Exports for handling utilities routes
  */
  module.exports = function(app) {

    billing = function(req, res) {
      // serve billing route
    },

    inventory = function(req, res) {
      var json = {};
      json.user = req.session.user;
      json.page = 'inventory';
      res.render('reports/inventory.jade', json);
    }

    // Refer route map
    app.get('/reports/inventory', inventory);
  }

}).call(this);
