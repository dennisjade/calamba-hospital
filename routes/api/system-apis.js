(function() {
  var path = require('path')
  var fs = require('fs')
  var Patient = require('../../models/patient')
  var moment = require('moment')
  var commonHelper = require('../../helpers/common')
  var async = require('async')

  module.exports = function(app){

    parsePatientData = function(req, res){
      var path = req.query.path || './fixtures/patient_data.csv'
      var data = fs.readFileSync(path).toString().split("\n");

      async.eachSeries(data, function(record, cb){
        console.log(record)
        var patientArr = record.split(':')
        res.json({status:200, msg:"Process patient record around #{patientArr.length}"})

        if (patientArr && patientArr[1].length>0){
          var patientId = commonHelper.getNumber(patientArr[0])
          var name = patientArr[1].split(',')
          
          console.log('aaaa', patientArr, name, patientArr[4]=='')

          if (name.length>1){
            var lname = name[0].replace('"','').trim()
            var fname = name[1].replace('"','').trim()
            var mname = patientArr[2]
            var bday = patientArr[4]==''? null: moment(patientArr[4]).toString()
            bday = bday=='Invalid date'?null:bday
            var add = patientArr[5].replace('"','')

            var patientObj = {
              patientId: patientId,
              fname  : fname,
              lname  : lname,
              mname  : mname,
              gender : null,
              bday   :bday,
              address:add
            }

            console.log(patientObj);
            Patient.getCreateOrUpdate(req, patientObj, function(err, data){
              if (err)
                console.log('Error creating person: ', err)
              
              cb(null)
            })
          }else{
            cb(null)
          }
        }else
          cb(null)

      }, function(err){
        console.log('Done')
      })
    }


    app.get('/api/parsePatientData', parsePatientData)
  }
}).call(this)