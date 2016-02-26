(function () {
  
  populateFields = function(obj) {
    var data = JSON.parse(obj);
    $(".admissionForm #pid").val(data._id);
    $(".admissionForm #patientId").html(data.patientId);
    $(".admissionForm #fname").val(data.fname);
    $(".admissionForm #lname").val(data.lname);
    $(".admissionForm #mname").val(data.mname);
    $(".admissionForm #datetimepickerBday").val(moment(data.bday).format('L'));
    
    $(".admissionForm input[name=gender]").attr("checked", false)
    if (data.gender=='male')
      $(".admissionForm #genderMale").attr("checked", true)
    else
      $(".admissionForm #genderFemale").attr("checked", true)

    $(".admissionForm #address").val(data.address);

    admissionSearch.dialog( "close" );
  }

  $('#searchPatient').on( 'keypress', function (e) {
    if (e.which==13){
      patientDataTable.draw()
    }
  });

  var patientUpdate = $( "#overlay-patient-update" ).dialog({
    autoOpen: false,
    resizable: false,
    width:800,
    height:600,
    modal: true,
    show: { effect: "slideDown", duration: 100 },
    buttons: {
      Cancel: function() {
        $( this ).dialog( "close" );
      }
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
          { "data": "patientId" },
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
            "targets": 1,
            "render": function(d, t, r) {
              return "<span>"+r.patientId+"</span>";
            }
          },
          {
            "targets": 4,
            "render": function(d, t, r) {
              return "<span>"+r.mname+"</span>";
            }
          },
          {
            "targets": 6,
            "render": function(d, t, r) {
              return "<span>"+moment(r.bday).format('L')+"</span>";
            }
          },
          {
            "targets": 8,
            "className": "dt-center",
            "render": function(d, t, r) {
              var markup = "<a class='label label-primary editPatient' refObj='"+JSON.stringify(r)+"' ref='"+r._id+"' href='#'>EDIT</a>&nbsp;";
              
              /*do not allow deletion if patient is admitted*/
              if (!r.isCurrentlyAdmitted)
                  markup = markup + "<a class='label label-danger deletePatient' ref='"+r._id+"' href='#'>DELETE</a>"
              return markup;
            }
          }
        ],
        "fnDrawCallback": function(settings) {

          // Edit service modal
          $('#patient tr .editPatient').unbind('click').click( function(e) {
            e.preventDefault();
            patientUpdate.dialog("open");
            populateFields( $(this).attr('refObj') );
          });

          $('#patient tr .deletePatient').unbind('click').click( function(e) {
            e.preventDefault();
            var isDelete = confirm("Delete current patient?");

            if(isDelete) {
              var _id = $(this).attr('ref');
              execAjax('/api/patient/' + _id, 'DELETE', {}).success( function(resp) {
                patientDataTable.ajax.reload();
              });
            }
          });

        }
  } );

}).call(this)
