var randomstring = require('randomstring'),
    connections = [];

RemoodConnection = function(socket, type) {

  var id = randomstring.generate(8),
      self = this,
      receiverSocket,
      remoteSocket;

  // Getters
  this.id = function() {
    return id;
  };
  this.receiverSocket = function() {
    return receiverSocket;
  };
  this.remoteSocket = function() {
    return remoteSocket;
  };

  var bindEvents = function() {
    receiverSocket.on('remood', function(msg) {
      console.log('RemoodConnection with id', self.id(), 'receiver -> remote:', msg);
      remoteSocket.emit('remood', msg);
    });

    remoteSocket.on('remood', function(msg) {
      console.log('RemoodConnection with id', self.id(), 'remote -> receiver:', msg);
      receiverSocket.emit('remood', msg);
    });
  };

  // Setters
  this.setRemoteSocket = function(socket) {
    remoteSocket = socket;

    if (receiverSocket) {
      bindEvents();
    }
  };
  this.setReceiverSocket = function(socket) {
    receiverSocket = socket;

    if (remoteSocket) {
      bindEvents();
    }
  };
  this.setSocketForType = function(socket, type) {
    if (type == 'remote') {
      this.setRemoteSocket(socket);
    } else {
      this.setReceiverSocket(socket);
    }
  };

  // Initialize
  this.setSocketForType(socket, type);
  connections.push(this);
};

RemoodConnection.all = function() {
  return connections;
};

RemoodConnection.find = function(id) {
  for(var i = 0; i < connections.length; i++) {
    if(connections[i].id() == id) {
      return connections[i];
    }
  }
};

module.exports = RemoodConnection;
