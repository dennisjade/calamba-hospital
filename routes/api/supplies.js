(function() {

  var Supply = require('../../models/supplies'),
      mongoose = require('mongoose'),
      SupplyMeta = require('../../models/supplies-meta-actions');

  module.exports = function(app) {

    getSupplies = function(req, res) {
      var retVal = {};
      Supply.getAllSupplies(function(err, supplies) {
        if(err) return res.status(500).send(err);
        if(req.query.datatable) retVal = {data: supplies}; else retVal = supplies;
        res.status(200).json(retVal);
      });
    }

    createSupply = function(req, res) {
      var supplyFields = {
        supplyName: req.body.supplyName,
        supplyPrice: req.body.supplyPrice,
        supplyQuantity: req.body.supplyQuantity,
        supplyDesc: escape(req.body.supplyDesc),
        updatedBy: mongoose.Types.ObjectId(req.session.user._id),
      };
      Supply.saveSupply(supplyFields, function(err, createdSupply) {
        if(err) return res.status(500).send(err);
        res.status(201).json(createdSupply);
      });
    }

    updateSupply = function(req, res) {

      var supplyID = req.params.supplyID;

      SupplyMeta.createAction(supplyID, req.body, function(err, response) {
        if(err) return res.status(500).send(err);
        req.body.updatedBy = mongoose.Types.ObjectId(req.session.user._id);
        // Prevent desc from overwrite during update
        if(req.body.supplyDesc) req.body.supplyDesc = escape(req.body.supplyDesc);
        Supply.updateSupply(supplyID, req.body, function(errUpdate, updatedObj) {
          if(err) return res.status(500).send(errUpdate);
          res.status(200).json(updatedObj);
        });
      });

    }

    removeSupply = function(req, res) {
      Supply.removeSupply(req.params.supplyID, function(err, deletedObj) {
        if(err) return res.status(500).send(err);
        res.status(200).json(deletedObj)
      });
    }

    app.post('/api/supplies', createSupply);
    app.put('/api/supplies/:supplyID', updateSupply);
    app.delete('/api/supplies/:supplyID', removeSupply);
    app.get('/api/supplies', getSupplies);

  }
}).call(this)
