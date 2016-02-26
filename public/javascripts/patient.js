(function () {
  
  $('#searchPatient').on( 'keypress', function (e) {
    if (e.which==13){
      patientDataTable.draw()
    }
  });

  var patientDataTable = $('#patient')
      .DataTable( {
        "ajax": {
          url : "/api/patients/?datatable=true",
          data: function ( d ) {
                d.search['value'] = $('#searchPatient').val()
            }
        },
        "processing": true,
        "serverSide": true,
        "searching" : false,
        "columns": [
          { "data": "_id", "visible": false },
          { "data": "fname" },
          { "data": "lname" },
          { "data": "mname" },
          { "data": "gender" },
          { "data": "bday" },
          { "data": "isCurrentlyAdmitted" },
          { "data": "Actions" }
        ],
        "columnDefs": [
          {
            "targets": 3,
            "render": function(d, t, r) {
              return "<span title='"+r.mname+"</span>";
            }
          },
          {
            "targets": 5,
            "render": function(d, t, r) {
              return "<span>"+moment(r.bday).format('L')+"</span>";
            }
          },
          {
            "targets": 7,
            "className": "dt-center",
            "render": function(d, t, r) {
              var markup = "<a class='label label-primary editService' refObj='"+JSON.stringify(r)+"' ref='"+r._id+"' href='#'>EDIT</a>&nbsp;";
              
              /*do not allow deletion if patient is admitted*/
              if (!r.isCurrentlyAdmitted)
                  markup = markup + "<a class='label label-danger deleteService' ref='"+r._id+"' href='#'>DELETE</a>"
              return markup;
            }
          }
        ],
        "fnDrawCallback": function(settings) {

          // Edit service modal
          $('#patientSearch tr .selectPatient').unbind('click').click( function(e) {
            e.preventDefault();
            admissionSearch.dialog("open");
            populateFields( $(this).attr('refObj') );

          });
        }
  } );

}).call(this)
