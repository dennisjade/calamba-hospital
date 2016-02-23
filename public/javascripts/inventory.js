(function () {

  execAjax = function(url, type, data) {
    return $.ajax({ url: url, type: type, data: data, dataType: 'JSON' });
  }

  populateFields = function(obj) {
    var data = JSON.parse(obj);
    $("#overlay-edit-dialog #itemID").val(data._id);
    $("#overlay-edit-dialog #itemName").val(data.itemName);
    $("#overlay-edit-dialog #itemQuantity").val(data.itemQuantity);
    $("#overlay-edit-dialog #itemDesc").val(data.itemDesc);
  }

  validateFields = function($frm) {
    var item_name = $frm.find('#itemName').val();
    var item_desc = $frm.find('#itemDesc').val();
    if(!item_name || !item_desc) return false;
    return true;
  }

  clearForm = function(_id) {
    $(_id).find("#itemName, #itemDesc").val('');
    $(_id).find("#itemQuantity").val(1);
  }

  initDialog = function(_id, btnActions) {
    return $(_id).dialog({
      autoOpen: false,
      resizable: false,
      width: 700,
      height: "auto",
      modal: true,
      show: { effect: "slideDown", duration: 100 },
      buttons: btnActions,
    });
  }

  var inventoryItems = $('#inventoryItems').DataTable({
    "ajax": "/api/inventory/?datatable=true",
    "columns": [
      { "data": "_id", "visible": false },
      { "data": "updateDate" },
      { "data": "itemName" },
      { "data": "itemQuantity" },
      { "data": "itemDesc" },
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
          return "<div title='"+r.itemDesc+"' class='truncate'>"+r.itemDesc+"</div>"
        }
      },
      {
        "targets": 5,
        "className": "dt-center",
        "render": function(d, t, r) {
          var markup = "<a class='label label-primary editItem' refObj='"+JSON.stringify(r)+"' ref='"+r._id+"' href='#'>EDIT</a>&nbsp;" +
                       "<a class='label label-danger deleteItem' ref='"+r._id+"' href='#'>DELETE</a>"
          return markup;
        }
      }
    ],

    "fnDrawCallback": function(settings) {

      // Edit item modal
      $('#inventoryItems tr .editItem').unbind('click').click( function(e) {
        e.preventDefault();
        editDialog.dialog("open");
        populateFields( $(this).attr('refObj') );
      });

      // Remove item modal
      $('#inventoryItems tr .deleteItem').unbind('click').click( function(e) {
        e.preventDefault();
        var isDelete = confirm("Delete current item?");

        if(isDelete) {
          var _id = $(this).attr('ref');
          execAjax('/api/inventory/' + _id, 'DELETE', {}).success( function(resp) {
            inventoryItems.ajax.reload();
          });
        }

      });

    }
  });

  // Trigger create item dialog
  $('#addItem').click(function() {
    addDialog.dialog('open');
    clearForm("#overlay-add-dialog form");
  });

  // Edit item UI dialog
  var editBtnActions = {
    "Update": function() {
      var frm = $("#overlay-edit-dialog form").serialize(),
          _id = $("#overlay-edit-dialog #itemID").val();
      // Execute update request
      execAjax('/api/inventory/' + _id, 'PUT', frm).success( function(resp) {
        editDialog.dialog('close');
        inventoryItems.ajax.reload();
      });
    },
    "Cancel": function() {
      $(this).dialog("close");
    }
  }

  // Add item UI dialog
  var addBtnActions = {
    "Create": function() {
      var $frm = $("#overlay-add-dialog form");
      var serialData = $("#overlay-add-dialog form").serialize();

      if(validateFields($frm)) {
        // Execute POST/ create request
        execAjax('/api/inventory/', 'POST', serialData).success( function(resp) {
          addDialog.dialog('close');
          inventoryItems.ajax.reload();
        });
      } else {
        alert("Please completed required fields.");
      }
    },
    "Cancel": function() {
      $(this).dialog("close");
    }
  }

  var editDialog = initDialog("#overlay-edit-dialog", editBtnActions);
  var addDialog = initDialog("#overlay-add-dialog", addBtnActions);

}).call(this)
