(function() {
  var Patient = require('../../models/patient')


  formatForDatatable = function(req, data, totalRecords){
    var dataTable = {
      "recordsTotal": totalRecords,
      "recordsFiltered": totalRecords, //data.length,
      "data" : data
    }
    return dataTable
  }

  module.exports = function(app) {

    getPatients = function(req, res) {
      var json = {status:200, msg:'Success'}
      var paginateStart = req.query.start
      var paginateLength = req.query.length
      var searchQuery = req.query.search
      var query = {
        $or: 
          [
            { fname: { $regex: searchQuery.value, $options: 'i'} },
            { lname: { $regex: searchQuery.value, $options: 'i'} }
          ],
        isCurrentlyAdmitted: (req.query.admitted=='true')
      }

      if (!req.query.admitted)
        delete query.isCurrentlyAdmitted

      sendResponse = function(data){
        if (req.query.datatable=='true'){
          /*lets get the total records for paginations*/
          Patient.getTotalPatiens(req, query, function(err, totalData){
            json = formatForDatatable(req, data, totalData)
            return res.json(json)
          })
        }else{
          json.data = data
          return res.json(json)
        }
      }
      
      if (searchQuery.value.length==0)
        return sendResponse([])
      else{
        Patient.getPatients(req, query, paginateStart, paginateLength,  function(err, data){
          if (err){
            json.status = 500
            json.msg  = "Error loading patients: " + JSON.stringify(err)
            data = []
          }
          
          return sendResponse(data)
        })
      }
    }

    deletePatient = function(req, res){
      var json = {status:200, msg:'Success'}

      Patient.deletePatient(req, req.params.pid, function(err, data){
        if (err){
          json.status = 500
          json.msg  = "Error deleting patient: " + JSON.stringify(err)
          data = []
        }

        return res.json(json)
      })
    }

    app.get('/api/patients', getPatients)
    app.delete('/api/patient/:pid', deletePatient)

  }
}).call(this)