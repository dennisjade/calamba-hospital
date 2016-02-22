(function () {

  selectPatient = function(){
    admissionSearch.dialog( "close" );
  }

  var admissionSearch = $( "#overlay-patient-search" ).dialog({
    autoOpen: false,
    resizable: false,
    width:700,
    height:700,
    modal: true,
    show: { effect: "slideDown", duration: 100 },
    buttons: {
      "Select patient": selectPatient,
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
        $('#patientId').val(res.data.patientId)
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

}).call(this)