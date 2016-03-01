(function() {

  var Medicine = require('../../models/medicines'),
      MedicineMeta = require('../../models/medicines-meta-actions')

  module.exports = function(app) {

    getMedicines = function(req, res) {
      var retVal = {};
      Medicine.getAllMedicines(function(err, medicines) {
        if(err) return res.status(500).send(err);
        if(req.query.datatable) retVal = {data: medicines}; else retVal = medicines;
        res.status(200).json(retVal);
      });
    }

    createMedicine = function(req, res) {
      var medicineFields = {
        medicineName: req.body.medicineName,
        medicineQuantity: req.body.medicineQuantity,
        medicineDesc: req.body.medicineDesc,
        updatedBy: req.session.user._id,
      };
      Medicine.saveMedicine(medicineFields, function(err, createdMedicine) {
        if(err) return res.status(500).send(err);
        res.status(201).json(createdMedicine);
      });
    }

    updateMedicine = function(req, res) {

      var medicineID = req.params.medicineID;

      MedicineMeta.createAction(medicineID, req.body, function(err, response) {
        if(err) return res.status(500).send(err);
        if(response.affected > 0) {
          Medicine.updateMedicine(medicineID, req.body, function(errUpdate, updatedObj) {
            if(err) return res.status(500).send(errUpdate);
            res.status(200).json(updatedObj);
          });
        } else {
          res.status(200).json({status: 200, message: "Medicine record still up to date"});
        }
      });

    }

    removeMedicine = function(req, res) {
      Medicine.removeMedicine(req.params.medicineID, function(err, deletedObj) {
        if(err) return res.status(500).send(err);
        res.status(200).json(deletedObj)
      });
    }

    app.post('/api/medicines', createMedicine);
    app.put('/api/medicines/:medicineID', updateMedicine);
    app.delete('/api/medicines/:medicineID', removeMedicine);
    app.get('/api/medicines', getMedicines);

  }
}).call(this)
