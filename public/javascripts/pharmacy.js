(function() {

  'use strict';

  // Medicine sources constant
  var medSources = {
    'HOSPITAL_BUDGET': 'Hospital Budget',
    'CONSIGNMENT': 'Consignment',
    'PUBLIC_PHARMA': 'Public Pharmacy',
    'MAP': 'Map'
  };

  // Populate fields for EDIT modal
  var populateFields = function(obj) {
    var data = JSON.parse(obj),
        dialogID = "#overlay-edit-medicine-dialog";
    $(dialogID).prev('.ui-dialog-titlebar').find('span').text('Edit Medicine - ( ' + data.medicineName+ ' )');
    $(dialogID + " #medicineID").val(data._id);
    $(dialogID + " #medicineName").val(data.medicineName);
    $(dialogID + " #medicineSource").val(data.medicineSource);
    $(dialogID + " #medicineQuantity").val(0);
    $(dialogID + " .in_stock span").text(data.medicineQuantity);
    $(dialogID + " #medicineDesc").val(data.medicineDesc);
  };

  // Form validation during create and edit medicines
  var validateFields = function($frm, action) {
    var medicineName = $frm.find('#medicineName').val(),
        medicineQuantity = $frm.find('#medicineQuantity').val(),
        medicineSource = $frm.find('#medicineSource').val();

    if(!medicineName) {
      return "Medicine name could not be empty";
    } else if(action === 'create' && medicineQuantity < 1) {
      return "Medicine quantity should not be less than 1";
    } else if(!medicineSource) {
      return "Medicine source could not be empty";
    }
    return true;
  };

  // Clear form prior to create and edit modal
  var clearForm = function(_id) {
    $(_id).find("#medicineName, #medicineDesc").val('');
    $(_id).find("#medicineQuantity").val(0);
    $(_id).find("#medicineSource").val("");
  };

  // Instantiate datatable
  var medicineItems = $('#medicineItems').DataTable({
    "bProcessing": true,
    "ajax": "/api/medicines/?datatable=true",
    "columns": [
      { "data": "_id", "visible": false },
      { "data": "addedDate" },
      { "data": "medicineName" },
      { "data": "medicineSource" },
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
        "width": "20%",
        "render": function(d, t, r) {
          return "<div style='width: 255px' title='"+r.medicineName+"' class='truncate'>"+r.medicineName+"</div>"
        }
      },
      {
        "targets": 3,
        "render": function(d, t, r) {
          return "<div style='width: 200px' title='"+medSources[r.medicineSource]+"' class='truncate'>"+medSources[r.medicineSource]+"</div>"
        }
      },
      { "targets": 4, "className": "dt-center" },
      {
        "targets": 5,
        "render": function(d, t, r) {
          return (!r.medicineDesc ? "N/A" : "<div title='"+r.medicineDesc+"' class='truncate'>"+r.medicineDesc+"</div>")
        }
      },
      {
        "targets": 6,
        "className": "dt-center",
        "render": function(d, t, r) {
          var markup = "<a class='hide action_style label label-primary editMedicine' refObj='"+JSON.stringify(r)+"' ref='"+r._id+"' href='#'>EDIT</a>" +
                       "<a title='Add Quantity' class='action_style label label-primary addQuantity' refObj='"+JSON.stringify(r)+"' ref='"+r._id+"' href='#'>ADD</a>&nbsp;" +
                       "<a title='Remove item' class='action_style label label-danger deleteMedicine' ref='"+r._id+"' href='#'>DELETE</a>"
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

      // Add medicine quantity modal
      $('#medicineItems tr .addQuantity').unbind('click').click( function(e) {
        e.preventDefault();
        var data = JSON.parse($(this).attr('refObj')),
            $frm = $("#overlay-add-medicine-quantity-dialog");
        addQuantityDialog.dialog("open");
        $frm.find("#medicineQuantity").val(0);
        $frm.find("#medicineID").val($(this).attr('ref'));
        $frm.prev('.ui-dialog-titlebar').find('span').text('Add Quantity - ( ' + data.medicineName+ ' ) -- ' + data.medicineQuantity);
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

  // Trigger edit medicine on dblclick
  $('#medicineItems').on('dblclick', 'tr', function() {
    $(this).find('.editMedicine').click();
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
          _id = $("#overlay-edit-medicine-dialog #medicineID").val(),
          serialData = $frm.serialize(),
          notif = validateFields($frm, 'edit');

      if(typeof(notif) == "boolean") {
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
  };

  // Add medicine UI dialog
  var addBtnActions = {
    "Create": function() {
      var $frm = $("#overlay-add-medicine-dialog form"),
          serialData = $frm.serialize(),
          notif = validateFields($frm, 'create');

      if(typeof(notif) == "boolean") {
        execAjax('/api/medicines/', 'POST', serialData).success( function(resp) {
          addMedicineDialog.dialog('close');
          medicineItems.ajax.reload();
        });
      } else {
        alert(notif);
      }
    },
    "Cancel": function() {
      $(this).dialog("close");
    }
  };

  // Add medicine quantity UI dialog
  var addQuanBtnActions = {
    "Save": function() {
      var $frm = $("#overlay-add-medicine-quantity-dialog form"),
          _id = $frm.find("#medicineID").val(),
          quan = $frm.find('#medicineQuantity').val();

      if(quan > 0) {
        execAjax('/api/medicines/' + _id, 'PUT', {medicineQuantity: quan}).success( function(resp) {
          addQuantityDialog.dialog('close');
          medicineItems.ajax.reload();
        });
      } else {
        alert('Quantity should not be empty')
      }
    },
    "Cancel": function() {
      $(this).dialog("close");
    }
  };

  // Initialize dialogs
  var editMedicineDialog = initDialog("#overlay-edit-medicine-dialog", editBtnActions, 700);
  var addMedicineDialog = initDialog("#overlay-add-medicine-dialog", addBtnActions, 700);
  var addQuantityDialog = initDialog("#overlay-add-medicine-quantity-dialog", addQuanBtnActions, 500);

}).call(this);
