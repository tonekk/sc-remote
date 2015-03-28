(function($, io, _) {

  var socket = io();

  remood = function(options) {

    var connectionIdDeferred = $.Deferred(),
        remoodType = (options && options.remote ? 'remote' : 'receiver'),
        connectionId,
        self = this;

    this.socket = socket;

    // Initial handshake to establish connection
    this.socket.on('remood', function(data) {
      _.each(self.findFunctionsFor(data), function(func) {
        func(data);
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
          return this.emit('remood-auth', { type: remoodType });
        }

        this.emit('remood-auth', { type: remoodType, id: connectionId });
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

      var eventName = arguments.length == 3 ? callback : eventType,
          cb = arguments.length == 3 ? arguments[2] : callback;

      this.on(eventType, function() {
        var $this = $(this);

        socket.emit('remood', {
          id: $this.attr('data-remood-id') || $this.attr('id'),
          type: eventName,
          data: $this.val() || $this.attr('data-remood-value')
        });

        if (cb && typeof(cb) === 'function') {
          cb.apply(this);
        }
      });
    }
  });
})(window.jQuery, window.io, window._);
