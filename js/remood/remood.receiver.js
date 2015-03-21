(function(io, _) {

  remood = function() {

    var socket = io(),
        connectionId,
        self = this;


    // Initial handshake to establish connection
    socket.on('remood', function(data) {

      var msg = JSON.parse(data);

      _.each(self.findFunctionsFor(msg), function(func) {
        func(msg);
      });
    });

    socket.on('remood-auth', function(data) {
      // If we get no id here, we first have to tell the server
      // that we are a new receiver
      if (!data || !data.id) {
        socket.emit('remood-auth', { type: 'receiver' });
      } else {
        connectionId = data.id;
      }
    });

    this.functions = [];
    this.connectionId = function() {
      return connectionId;
    };
  };

  remood.prototype.findFunctionsFor = function(msg) {
    var matches = _.select(this.functions, function(item) {
      return (item.id ? item.id == msg.id : true) &&
             (item.eventType ? item.eventType == msg.type : true);
    });

    return _.map(matches, function(m) { return m.callback });
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
})(window.io, window._);
