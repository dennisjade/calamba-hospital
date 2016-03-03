(function() {

  var medSources = [
    { label: 'Hospital Budget', value: 'HOSPITAL_BUDGET' },
    { label: 'Consignment', value: 'CONSIGNMENT' },
    { label: 'Public Pharmacy', value: 'PUBLIC_PHARMA' },
    { label: 'Map', value: 'MAP' }
  ];

  /**
  * Exports for handling utilities routes
  */
  module.exports = function(app) {

    laboratory = function(req, res) {
      // serve laboratory route
    },

    pharmacy = function(req, res) {
      var json = {
        user : req.session.user,
        medSources: medSources,
        page : 'pharmacy',
      };
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
