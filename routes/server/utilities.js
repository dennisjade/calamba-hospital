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

    supplies = function(req, res) {
      var json = {
        user : req.session.user,
        page : 'supplies',
      };
      res.render('utilities/supplies.jade', json);
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
      var json = {
        user : req.session.user,
        page : 'services',
      };
      res.render('utilities/services.jade', json);
    }

    // Refer route map
    app.get('/utilities/supplies', supplies);
    app.get('/utilities/services', services);
    app.get('/utilities/pharmacy', pharmacy);
  }

}).call(this);
