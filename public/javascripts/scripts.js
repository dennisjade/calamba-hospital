(function () {

  execAjax = function(url, type, data) {
    return $.ajax({ url: url, type: type, data: data, dataType: 'JSON' });
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

}).call(this)
