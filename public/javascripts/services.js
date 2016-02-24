(function() {

  populateFields = function(obj) {
    var data = JSON.parse(obj);
    $("#overlay-edit-service-dialog #serviceID").val(data._id);
    $("#overlay-edit-service-dialog #serviceName").val(data.serviceName);
    $("#overlay-edit-service-dialog #servicePrice").val(data.servicePrice);
    $("#overlay-edit-service-dialog #serviceDesc").val(data.serviceDesc);
  }

  validateFields = function($frm) {
    var service_name = $frm.find('#serviceName').val();
    if(!service_name) return false;
    return true;
  }

  clearForm = function(_id) {
    $(_id).find("#serviceName, #serviceDesc").val('');
    $(_id).find("#servicePrice").val(1);
  }

  var serviceItems = $('#serviceItems').DataTable({
    "ajax": "/api/services/?datatable=true",
    "columns": [
      { "data": "_id", "visible": false },
      { "data": "updateDate" },
      { "data": "serviceName" },
      { "data": "servicePrice" },
      { "data": "serviceDesc" },
      { "data": "Actions" }
    ],

    "columnDefs": [
      {
        "targets": 1,
        "render": function(d, t, r) {
          return "<span title='"+moment(r.updateDate).format('LT')+"'>"+moment(r.updateDate).format('ll')+  "</span>";
        }
      },
      { "targets": 2, "width": "30%" },
      { "targets": 3, "className": "dt-center" },
      {
        "targets": 4,
        "render": function(d, t, r) {
          return "<div title='"+r.serviceDesc+"' class='truncate'>"+r.serviceDesc+"</div>"
        }
      },
      {
        "targets": 5,
        "className": "dt-center",
        "render": function(d, t, r) {
          var markup = "<a class='label label-primary editService' refObj='"+JSON.stringify(r)+"' ref='"+r._id+"' href='#'>EDIT</a>&nbsp;" +
                       "<a class='label label-danger deleteService' ref='"+r._id+"' href='#'>DELETE</a>"
          return markup;
        }
      }
    ],

    "fnDrawCallback": function(settings) {

      // Edit service modal
      $('#serviceItems tr .editService').unbind('click').click( function(e) {
        e.preventDefault();
        editServiceDialog.dialog("open");
        populateFields( $(this).attr('refObj') );
      });

      // Remove service modal
      $('#serviceItems tr .deleteService').unbind('click').click( function(e) {
        e.preventDefault();
        var isDelete = confirm("Delete current service?");

        if(isDelete) {
          var _id = $(this).attr('ref');
          execAjax('/api/services/' + _id, 'DELETE', {}).success( function(resp) {
            serviceItems.ajax.reload();
          });
        }

      });

    }
  });

  // Trigger create service dialog
  $('#addService').click(function() {
    addServiceDialog.dialog('open');
    clearForm("#overlay-add-service-dialog form");
  });

  // Edit service UI dialog
  var editBtnActions = {
    "Update": function() {
      var frm = $("#overlay-edit-service-dialog form").serialize(),
          _id = $("#overlay-edit-service-dialog #serviceID").val();
      // Execute update request
      execAjax('/api/services/' + _id, 'PUT', frm).success( function(resp) {
        editServiceDialog.dialog('close');
        serviceItems.ajax.reload();
      });
    },
    "Cancel": function() {
      $(this).dialog("close");
    }
  }

  // Add service UI dialog
  var addBtnActions = {
    "Create": function() {
      var $frm = $("#overlay-add-service-dialog form");
      var serialData = $("#overlay-add-service-dialog form").serialize();

      if(validateFields($frm)) {
        // Execute POST/ create request
        execAjax('/api/services/', 'POST', serialData).success( function(resp) {
          addServiceDialog.dialog('close');
          serviceItems.ajax.reload();
        });
      } else {
        alert("Please complete required fields.");
      }
    },
    "Cancel": function() {
      $(this).dialog("close");
    }
  }

  // Initialize dialogs
  var editServiceDialog = initDialog("#overlay-edit-service-dialog", editBtnActions);
  var addServiceDialog = initDialog("#overlay-add-service-dialog", addBtnActions);

}).call(this);
