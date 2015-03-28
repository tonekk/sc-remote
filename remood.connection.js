var randomstring = require('randomstring'),
    pluralize = require('pluralize'),
    connections = [],
    _ = require('lodash');

RemoodConnection = function(socket, type, identifier) {

  var id = identifier || randomstring.generate(8),
      self = this,
      receiverSockets = [],
      remoteSockets = [];

  // Getters
  this.id = function() {
    return id;
  };
  this.receiverSockets = function() {
    return receiverSockets;
  };
  this.remoteSockets = function() {
    return remoteSockets;
  };

  // Setters
  var bindEvents = function(socket, targetSockets, type) {
    socket
      .on('remood', function(msg) {
        console.log('RemoodConnection with id', self.id(), 'receiver -> remote:', msg);
        _.each(targetSockets, function(targetSocket) {
          targetSocket.emit('remood', msg);
        });
      })
      .on('disconnect', function(msg) {
        console.log('- Socket (' + type + ') disconnected from id: ' + self.id());
        var sockets = (type == 'remote' ? remoteSockets : receiverSockets);
        _.remove(sockets, function(sock) {
          return sock == socket;
        });
        console.log(self.statusString(false));

        if (!receiverSockets.length && !remoteSockets.length) {
          console.log('- Connection has no sockets left. Destroying');
          RemoodConnection.destroy(self.id());
        }
      });
  };

  this.setRemoteSocket = function(socket) {
    remoteSockets.push(socket);
    bindEvents(socket, receiverSockets, 'remote');
  };
  this.setReceiverSocket = function(socket) {
    receiverSockets.push(socket);
    bindEvents(socket, remoteSockets, 'receiver');
  };
  this.setSocketForType = function(socket, type) {
    if (type == 'remote') {
      this.setRemoteSocket(socket);
    } else {
      this.setReceiverSocket(socket);
    }
  };

  this.statusString = function(connected) {
    var receiverCount = receiverSockets.length,
        remoteCount = remoteSockets.length;

    return [
      (connected ? '+' : '-'),
      ' Connection has (',
      receiverCount,
      ') ',
      pluralize('receiver', receiverCount),
      ' and (', remoteCount,
      ') ',
      pluralize('remotes', remoteCount)
    ].join('');
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

RemoodConnection.destroy = function(id) {
  _.remove(connections, function(connection) {
    return connection.id == id;
  });
};


module.exports = RemoodConnection;
