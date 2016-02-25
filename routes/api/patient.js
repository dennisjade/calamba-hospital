(function() {
  var Patient = require('../../models/patient')


  formatForDatatable = function(data){
    return {data:data}
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
        if (req.query.datatable=='true')
          json = formatForDatatable(data)
        else
          json.data = data

        res.json(json)
      }
      
      if (searchQuery.value.length==0)
        sendResponse([])
      else{
        Patient.getPatients(req, query, function(err, data){
          if (err){
            json.status = 500
            json.msg  = "Error loading patients: " + JSON.stringify(err)
            json.data = []
          }

          sendResponse(data)
        })
      }
    }

    app.get('/api/patients', getPatients)

  }
}).call(this)