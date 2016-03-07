
(function() {
  var props = {};
  props = require('./properties')

  module.exports = exports = config = {}

  //Database
  config.getDB = function() {
    return props.db || 'mongodb://localhost:27017/calamba';
  };

}).call(this);
