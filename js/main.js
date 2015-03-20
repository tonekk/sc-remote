(function(io) {

  // Library code (kind of)
  (function() {
    remood = function() {
      var socket = io(),
          self = this;

      socket.on('remood', function(data) {

        var msg = JSON.parse(data);

        _.each(self.findFunctionsFor(msg), function(func) {
          func(msg);
        });
      });

      this.functions = [];
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
  })();

  $(function() {
    // Initialize SC Player
    var widget = SC.Widget(document.getElementById('sc-widget'));

    // Initialize remood, register remood events
    var r = new remood();

    r.on('play', function(msg) {
      widget.play();
    });

    r.on('pause', function(msg) {
      widget.pause();
    });

    r.on({
      eventType: 'sc url',
      callback: function(msg) {
        widget.load(msg.data);
      }
    });

  });
})(window.io);
