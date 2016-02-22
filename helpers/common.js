(function() {
  module.exports.getNumber = function(data) {
    return Number(data.toString().replace(/[^0-9\.]+/g, ""));
  }
}).call(this)