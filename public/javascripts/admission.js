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

  var admissionSearch = $( "#overlay-patient-search" ).dialog({
    autoOpen: false,
    resizable: false,
    width:800,
    height:670,
    modal: true,
    show: { effect: "slideDown", duration: 100 },
    buttons: {
      Cancel: function() {
        $( this ).dialog( "close" );
      }
    }
  });

  //initialize datepicker
  $('#datetimepickerBday').datepicker();

  //handle click event to open search patient
  $('a.searchPatient').on('click',function(e){
    admissionSearch.dialog( "open" );
  })

  //handle event to admit patient
  $("#admitPatient").on("click", function(e){
    successfn = function(res){
      if (res.status==200){
        var msg = res.msg
        $('.serverResponse').addClass('text-success')
        $('#admitPatient').addClass('disabled')
        $('#admitPatient').attr("disabled", "disabled")
        $('#pid').val(res.data.pid)
        $('#patientId').html(res.data.patientId)
      }else{
        var msg = res.msg + "@" + res.data.error
        $('.serverResponse').addClass('text-danger')
      }
      $('.serverResponse').html(msg)
    }
    errorfn = function(res){
    }

    var url  = "/api/admit/patient"
    var type = "POST"
    var data = $('.admissionForm').serialize()
    
    makeAjax(url, type, data, successfn, errorfn)
  })


  $("#cancelAdmission").on("click",function(e){
    var cancelAdmission = confirm("Cancell patient admission?")

    if (cancelAdmission){
      $("#admissionForm input").val('')

      successfn = function(res){
        if (res.status==200){
          var msg = res.msg
          $('.serverResponse').addClass('text-success')
          $('#cancelAdmission').addClass('disabled')
          $('#cancelAdmission').attr("disabled", "disabled")
        }else{
          var msg = res.msg + "@" + res.data.error
          $('.serverResponse').addClass('text-danger')
        }
        $('.serverResponse').html(msg)
      }
      errorfn = function(res){
      }

      var url  = "/api/cancel/admission/"+$("#pid").val()
      var type = "DELETE"

      makeAjax(url, data, successfn, errorfn)
    }
  })

  var patient = $('#patientSearch').DataTable( {
        "ajax": "/api/patients/?datatable=true&admitted=false",
        "processing": true,
        "serverSide": true,
        "columns": [
          { "data": "_id", "visible": false },
          { "data": "fname" },
          { "data": "lname" },
          { "data": "mname" },
          { "data": "gender" },
          { "data": "bday" },
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
              return "<span title='"+moment(r.bday).format('LT')+  "</span>";
            }
          },
          {
            "targets": 6,
            "className": "dt-center",
            "render": function(d, t, r) {
              var markup = "<a class='label label-primary selectPatient' refObj='"+JSON.stringify(r)+"' ref='"+r._id+"' href='#'>Select</a>&nbsp;"
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