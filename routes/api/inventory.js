(function() {
  var Inventory = require('../../models/inventory')

  module.exports = function(app) {

    getItems = function(req, res) {
      var retVal = {};
      Inventory.getAllItems(function(err, items) {
        if(err) return res.status(500).send(err);
        if(req.query.datatable) retVal = {data: items}; else retVal = items;
        res.status(200).json(retVal);
      });
    }

    createItem = function(req, res) {
      var itemFields = {
        itemName: req.body.itemName,
        itemQuantity: req.body.itemQuantity,
        itemDesc: req.body.itemDesc,
      };
      Inventory.saveItem(itemFields, function(err, createdItem) {
        if(err) return res.status(500).send(err);
        res.status(201).json(createdItem);
      });
    }

    updateItem = function(req, res) {
      Inventory.updateItem(req.params.itemID, req.body, function(err, updatedObj) {
        if(err) return res.status(500).send(err);
        res.status(200).json(updatedObj)
      });
    }

    removeItem = function(req, res) {
      Inventory.removeItem(req.params.itemID, function(err, deletedObj) {
        if(err) return res.status(500).send(err);
        res.status(200).json(deletedObj)
      });
    }

    app.post('/api/inventory', createItem);
    app.put('/api/inventory/:itemID', updateItem);
    app.delete('/api/inventory/:itemID', removeItem);
    app.get('/api/inventory', getItems);

  }
}).call(this)
