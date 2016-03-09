(function() {

  'use strict';

  // Populate fields for EDIT modal
  var populateFields = function(obj) {
    var data = JSON.parse(obj),
        dialogID = "#overlay-edit-supply-dialog";
    $(dialogID).prev('.ui-dialog-titlebar').find('span').text('Edit Supply - ( ' + data.supplyName+ ' )');
    $(dialogID + " #supplyID").val(data._id);
    $(dialogID + " #supplyName").val(data.supplyName);
    $(dialogID + " #supplyPrice").val(data.supplyPrice);
    $(dialogID + " #supplyQuantity").val(0);
    $(dialogID + " .in_stock span").text(data.supplyQuantity);
    $(dialogID + " #supplyDesc").val(unescape(data.supplyDesc));
  };

  // Form validation during create and edit supplies
  var validateFields = function($frm, action) {
    var supplyName = $frm.find('#supplyName').val(),
        supplyQuantity = $frm.find('#supplyQuantity').val();

    if(!supplyName) {
      return "Supply name could not be empty";
    } else if(action === 'create' && supplyQuantity < 1) {
      return "Supply quantity should not be less than 1";
    }
    return true;
  };

  // Clear form prior to create and edit modal
  var clearForm = function(_id) {
    $(_id).find("#supplyName, #supplyDesc").val('');
    $(_id).find("#supplyQuantity").val(0);
  };

  // Instantiate datatable
  var supplyItems = $('#supplyItems').DataTable({
    "bProcessing": true,
    "ajax": "/api/supplies/?datatable=true",
    "columns": [
      { "data": "_id", "visible": false },
      { "data": "addedDate" },
      { "data": "supplyName" },
      { "data": "supplyPrice" },
      { "data": "supplyQuantity" },
      { "data": "supplyDesc" },
      { "data": "Actions" }
    ],

    "columnDefs": [
      {
        "targets": 1,
        "render": function(d, t, r) {
          return "<span title='"+moment(r.addedDate).format('LT')+"'>"+moment(r.addedDate).format('L')+  "</span>";
        }
      },
      {
        "targets": 2,
        "render": function(d, t, r) {
          return "<div title='"+r.supplyName+"' class='truncate'>"+r.supplyName+"</div>"
        }
      },
      { "targets": 3, "className": "dt-center" },
      { "targets": 4, "className": "dt-center" },
      {
        "targets": 5,
        "render": function(d, t, r) {
          return (!r.supplyDesc ? "N/A" : "<div title='"+unescape(r.supplyDesc)+"' class='truncate'>"+unescape(r.supplyDesc)+"</div>")
        }
      },
      {
        "targets": 6,
        "className": "dt-center",
        "render": function(d, t, r) {
          var markup = "<a class='hide action_style label label-primary editSupply' refObj='"+JSON.stringify(r)+"' ref='"+r._id+"' href='#'>EDIT</a>" +
                       "<a title='Add Quantity' class='action_style label label-primary addQuantity' refObj='"+JSON.stringify(r)+"' ref='"+r._id+"' href='#'>ADD</a>&nbsp;" +
                       "<a title='Remove item' class='action_style label label-danger deleteSupply' ref='"+r._id+"' href='#'>DELETE</a>"
          return markup;
        }
      }
    ],
    "fnDrawCallback": function(settings) {

      // Edit supply modal
      $('#supplyItems tr .editSupply').unbind('click').click( function(e) {
        e.preventDefault();
        editSupplyDialog.dialog("open");
        populateFields( $(this).attr('refObj') );
      });

      // Add supply quantity modal
      $('#supplyItems tr .addQuantity').unbind('click').click( function(e) {
        e.preventDefault();
        var data = JSON.parse($(this).attr('refObj')),
            $frm = $("#overlay-add-supply-quantity-dialog");
        addQuantityDialog.dialog("open");
        $frm.find("#supplyQuantity").val(0);
        $frm.find("#supplyID").val($(this).attr('ref'));
        $frm.prev('.ui-dialog-titlebar').find('span').text('Add Quantity - ( ' + data.supplyName+ ' ) -- ' + data.supplyQuantity);
      });

      // Remove supply modal
      $('#supplyItems tr .deleteSupply').unbind('click').click( function(e) {
        e.preventDefault();
        var isDelete = confirm("Delete current supply?");

        if(isDelete) {
          var _id = $(this).attr('ref');
          execAjax('/api/supplies/' + _id, 'DELETE', {}).success( function(resp) {
            supplyItems.ajax.reload();
          });
        }

      });

    }
  });

  // Trigger edit supply on dblclick
  $('#supplyItems').on('dblclick', 'tr', function() {
    $(this).find('.editSupply').click();
  });

  // Trigger create supply dialog
  $('#addSupply').click(function() {
    addSupplyDialog.dialog('open');
    clearForm("#overlay-add-supply-dialog form");
  });

  // Edit supply UI dialog
  var editBtnActions = {
    "Update": function() {
      var $frm = $("#overlay-edit-supply-dialog form"),
          _id = $("#overlay-edit-supply-dialog #supplyID").val(),
          serialData = $frm.serialize(),
          notif = validateFields($frm, 'edit');

      if(typeof(notif) == "boolean") {
        execAjax('/api/supplies/' + _id, 'PUT', serialData).success( function(resp) {
          editSupplyDialog.dialog('close');
          supplyItems.ajax.reload();
        });
      } else {
        alert(notif);
      }

    },
    "Cancel": function() {
      $(this).dialog("close");
    }
  };

  // Add supply UI dialog
  var addBtnActions = {
    "Create": function() {
      var $frm = $("#overlay-add-supply-dialog form"),
          serialData = $frm.serialize(),
          notif = validateFields($frm, 'create');

      if(typeof(notif) == "boolean") {
        execAjax('/api/supplies/', 'POST', serialData).success( function(resp) {
          addSupplyDialog.dialog('close');
          supplyItems.ajax.reload();
        });
      } else {
        alert(notif);
      }
    },
    "Cancel": function() {
      $(this).dialog("close");
    }
  };

  // Add supply quantity UI dialog
  var addQuanBtnActions = {
    "Save": function() {
      var $frm = $("#overlay-add-supply-quantity-dialog form"),
          _id = $frm.find("#supplyID").val(),
          quan = $frm.find('#supplyQuantity').val();

      if(quan > 0) {
        execAjax('/api/supplies/' + _id, 'PUT', {supplyQuantity: quan}).success( function(resp) {
          addQuantityDialog.dialog('close');
          supplyItems.ajax.reload();
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
  var editSupplyDialog = initDialog("#overlay-edit-supply-dialog", editBtnActions, 700);
  var addSupplyDialog = initDialog("#overlay-add-supply-dialog", addBtnActions, 700);
  var addQuantityDialog = initDialog("#overlay-add-supply-quantity-dialog", addQuanBtnActions, 500);

}).call(this);
