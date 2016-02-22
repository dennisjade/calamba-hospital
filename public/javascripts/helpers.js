//$(function(){
  

  function makeAjax(url,method,data,successfn,errorfn){
    return $.ajax({
       url : url,
       type: method,
       data: data, 
       success: successfn,
       error: errorfn
    }) //end ajax
  }

//})