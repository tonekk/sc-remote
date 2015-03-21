var randomstring = require('randomstring'),
    connections = [];

RemoodConnection = function(socket, type) {

  var id = randomstring.generate(8),
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

  // Setters
  this.setRemoteSocket = function(remoteSock) {
    remoteSocket = remoteSock;
  };
  this.setReceiverSocket = function(remoteSock) {
    remoteSocket = remoteSock;
  };
  this.setSocketForType = function(socket, type) {
    if (type == 'remote') {
      this.setReceiverSocket(socket);
    } else {
      this.setRemoteSocket(socket);
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
    if(connections[i].id == id) {
      return connections[i];
    }
  }
};

module.exports = RemoodConnection;
