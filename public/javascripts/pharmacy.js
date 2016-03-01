(function() {

  populateFields = function(obj) {
    var data = JSON.parse(obj), dialogID = "#overlay-edit-medicine-dialog";
    $(dialogID).prev('.ui-dialog-titlebar').find('span').text('Edit Medicine - ( ' + data.medicineName+ ' )');
    $(dialogID + " #medicineID").val(data._id);
    $(dialogID + " #medicineName").val(data.medicineName);
    $(dialogID + " #medicineQuantity").val(0);
    $(dialogID + " .in_stock span").text(data.medicineQuantity);
    $(dialogID + " #medicineDesc").val(data.medicineDesc);
  }

  validateFields = function($frm) {
    var medicineName = $frm.find('#medicineName').val(),
        medicineQuantity = $frm.find('#medicineQuantity').val();

    if(!medicineName) {
      return "Medicine name could not be empty.";
    } else if(medicineQuantity < 0) {
      return "Negative values not allowed";
    }
    return true;
  }

  clearForm = function(_id) {
    $(_id).find("#medicineName, #medicineDesc").val('');
    $(_id).find("#medicineQuantity").val(1);
  }

  var medicineItems = $('#medicineItems').DataTable({
    "ajax": "/api/medicines/?datatable=true",
    "columns": [
      { "data": "_id", "visible": false },
      { "data": "addedDate" },
      { "data": "medicineName" },
      { "data": "medicineQuantity" },
      { "data": "medicineDesc" },
      { "data": "Actions" }
    ],

    "columnDefs": [
      {
        "targets": 1,
        "render": function(d, t, r) {
          return "<span title='"+moment(r.addedDate).format('LT')+"'>"+moment(r.addedDate).format('ll')+  "</span>";
        }
      },
      {
        "targets": 2,
        "width": "30%",
        "render": function(d, t, r) {
          return "<div style='width: 255px' title='"+r.medicineName+"' class='truncate'>"+r.medicineName+"</div>"
        }
      },
      { "targets": 3, "className": "dt-center" },
      {
        "targets": 4,
        "render": function(d, t, r) {
          return "<div title='"+r.medicineDesc+"' class='truncate'>"+r.medicineDesc+"</div>"
        }
      },
      {
        "targets": 5,
        "className": "dt-center",
        "render": function(d, t, r) {
          var markup = "<a class='label label-primary editMedicine' refObj='"+JSON.stringify(r)+"' ref='"+r._id+"' href='#'>EDIT</a>&nbsp;" +
                       "<a class='label label-danger deleteMedicine' ref='"+r._id+"' href='#'>DELETE</a>"
          return markup;
        }
      }
    ],

    "fnDrawCallback": function(settings) {

      // Edit medicine modal
      $('#medicineItems tr .editMedicine').unbind('click').click( function(e) {
        e.preventDefault();
        editMedicineDialog.dialog("open");
        populateFields( $(this).attr('refObj') );
      });

      // Remove medicine modal
      $('#medicineItems tr .deleteMedicine').unbind('click').click( function(e) {
        e.preventDefault();
        var isDelete = confirm("Delete current medicine?");

        if(isDelete) {
          var _id = $(this).attr('ref');
          execAjax('/api/medicines/' + _id, 'DELETE', {}).success( function(resp) {
            medicineItems.ajax.reload();
          });
        }

      });

    }
  });

  // Trigger create medicine dialog
  $('#addMedicine').click(function() {
    addMedicineDialog.dialog('open');
    clearForm("#overlay-add-medicine-dialog form");
  });

  // Edit medicine UI dialog
  var editBtnActions = {
    "Update": function() {
      var $frm = $("#overlay-edit-medicine-dialog form"),
          _id = $("#overlay-edit-medicine-dialog #medicineID").val();

      var serialData = $frm.serialize(),
          notif = validateFields($frm);

      if(typeof(notif) == "boolean") {
        // Execute update request
        execAjax('/api/medicines/' + _id, 'PUT', serialData).success( function(resp) {
          editMedicineDialog.dialog('close');
          medicineItems.ajax.reload();
        });
      } else {
        alert(notif);
      }

    },
    "Cancel": function() {
      $(this).dialog("close");
    }
  }

  // Add medicine UI dialog
  var addBtnActions = {
    "Create": function() {
      var $frm = $("#overlay-add-medicine-dialog form");
      var serialData = $frm.serialize();

      if(validateFields($frm)) {
        // Execute POST/ create request
        execAjax('/api/medicines/', 'POST', serialData).success( function(resp) {
          addMedicineDialog.dialog('close');
          medicineItems.ajax.reload();
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
  var editMedicineDialog = initDialog("#overlay-edit-medicine-dialog", editBtnActions);
  var addMedicineDialog = initDialog("#overlay-add-medicine-dialog", addBtnActions);

}).call(this);
