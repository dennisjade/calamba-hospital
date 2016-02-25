(function() {

  $('#login').click(function(event){
    var username = $('#username').val()
    var password = $('#password').val()
    var data = {user:username, pwd: password}
    // $.ajax({
    //   url : '/api/authenticate',
    //   type: 'POST',
    //   data: data, 
    //   success: function(resp) {
        
    //   }
    // }) //end ajax
  })

}).call(this);