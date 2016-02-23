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

  var editDialog = $( "#overlay-edit-dialog").dialog({
    autoOpen: false,
    resizable: false,
    width: 700,
    height: "auto",
    modal: true,
    show: { effect: "slideDown", duration: 100 },
    buttons: {
      "Update": function() {
        var frm = $("#overlay-edit-dialog form").serialize(),
            _id = $("#overlay-edit-dialog #itemID").val();

        execAjax('/api/inventory/' + _id, 'PUT', frm).success( function(resp) {
          editDialog.dialog('close');
          inventoryItems.ajax.reload();
        });
      },
      "Cancel": function() {
        $( this ).dialog( "close" );
      }
    }
  });

}).call(this)
