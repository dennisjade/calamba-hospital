
(function() {
  var props = {};
  props = require('./properties')

  module.exports = exports = config = {}

  //Database
  config.getDB = function() {
    return props.db || 'mongodb://localhost/calamba';
  };

}).call(this);