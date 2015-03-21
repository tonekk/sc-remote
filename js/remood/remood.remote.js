(function($, io) {
  var socket = io(),
      connectionId = hash('id'),
      remood;

  // Register handshake
  socket.on('remood-auth', function(msg) {
    socket.emit('remood-auth', { isRemote: true, id: connectionId });
  });

  // Function to send remood message directly
  remood = function(value, type, id) {
    socket.emit('remood', { type: 'direct', data: value, id: id });
  };

  // Connect a jQuery event to a remood event
  $.fn.extend({
    connect: function(eventType, callback) {

      var self = this,
          eventName = arguments.length == 3 ? callback : eventType,
          cb = arguments.length == 3 ? arguments[2] : callback;

      self.on(eventType, function() {
        socket.emit('remood', JSON.stringify({
          id: self.attr('data-remood-id') || self.attr('id'),
          type: eventName,
          data: self.val() || self.attr('data-remood-value')
        }));

        if (cb && typeof(cb) === 'function') {
          cb.apply(this);
        }
      });
    }
  });
})(window.jQuery, window.io);
