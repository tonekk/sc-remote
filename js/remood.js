(function($, io, _) {

  var socket = io();

  remood = function() {

    var connectionIdDeferred = $.Deferred(),
        connectionId,
        self = this;

    this.socket = socket;

    // Initial handshake to establish connection
    this.socket.on('remood', function(data) {

      // FIME: Consistent msg type
      var msg = _.isObject(data) ? data : JSON.parse(data);

      _.each(self.findFunctionsFor(msg), function(func) {
        func(msg);
      });
    });

    // Register handshake
    this.socket.on('remood-auth', function(data) {
      // If we get no id here, we first have to tell the server
      // that we are a new receiver
      if (data && data.id) {
        connectionId = data.id;
      } else {
        if (hash('id')) {
          connectionId = hash('id');
        } else {
          return this.emit('remood-auth', { type: window.remoodType });
        }

        this.emit('remood-auth', { type: window.remoodType, id: connectionId });
      }

      hash('id', connectionId);
      connectionIdDeferred.resolve();
    });

    this.functions = [];

    // Async because we have to fetch connectionId first
    this.getConnectionId = function(cb) {
      connectionIdDeferred.done(function() {
        cb(connectionId);
      });
    };
  };

  remood.prototype.findFunctionsFor = function(msg) {
    var matches = _.select(this.functions, function(item) {
      return (item.id ? item.id == msg.id : true) &&
             (item.eventType ? item.eventType == msg.type : true);
    });

    return _.pluck(matches, 'callback');
  };

  remood.prototype.on = function(id, callback) {
    if (arguments.length == 1) {
      var options = arguments[0];
      if (options.callback && typeof(options.callback) === 'function') {
        this.functions.push(options);
      }
    } else {
      this.functions.push({ id: id, callback: callback });
    }
  };

  remood.prototype.send = function(msg) {
    this.socket.emit('remood', msg);
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
})(window.jQuery, window.io, window._);
