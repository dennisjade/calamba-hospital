(function() {
  var Service = require('../../models/services')

  module.exports = function(app) {

    getServices = function(req, res) {
      var retVal = {};
      Service.getAllServices(function(err, services) {
        if(err) return res.status(500).send(err);
        if(req.query.datatable) retVal = {data: services}; else retVal = services;
        res.status(200).json(retVal);
      });
    }

    createService = function(req, res) {
      var serviceFields = {
        serviceName: req.body.serviceName,
        servicePrice: req.body.servicePrice,
        serviceDesc: req.body.serviceDesc,
      };
      Service.saveService(serviceFields, function(err, createdService) {
        if(err) return res.status(500).send(err);
        res.status(201).json(createdService);
      });
    }

    updateService = function(req, res) {
      Service.updateService(req.params.serviceID, req.body, function(err, updatedObj) {
        if(err) return res.status(500).send(err);
        res.status(200).json(updatedObj)
      });
    }

    removeService = function(req, res) {
      Service.removeService(req.params.serviceID, function(err, deletedObj) {
        if(err) return res.status(500).send(err);
        res.status(200).json(deletedObj)
      });
    }

    app.post('/api/services', createService);
    app.put('/api/services/:serviceID', updateService);
    app.delete('/api/services/:serviceID', removeService);
    app.get('/api/services', getServices);

  }
}).call(this)
