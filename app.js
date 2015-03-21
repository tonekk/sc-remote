var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    MobileDetect = require('mobile-detect'),
    RemoodConnection = require('./remood.connection');

app.get('/', function(req, res) {
  if (new MobileDetect(req.headers['user-agent']).mobile()) {
    res.redirect('/remote');
  } else {
    res.redirect('/player');
  }
});

app.get('/player', function(req, res) {
  res.sendFile('html/player.html', { root: __dirname });
});

app.get('/remote', function(req, res) {
  res.sendFile('html/remote.html', { root: __dirname });
});

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));

io.on('connection', function(socket) {

  console.log('Incomming connection, shaking hands:');

  // Handshake
  socket.emit('remood-auth');
  socket.on('remood-auth', function(msg) {

    var createConnection = function() {
      var con = new RemoodConnection(socket, msg.type);
      console.log('+ Created new connection with id:', con.id);
      socket.emit('remood-auth', { id: con.id });
    };

    console.log('+ Socket is a ' + msg.type);

    if(msg.id) {
      con = RemoodConnection.find(msg.id)
      if (con) {
        con.setSocketForType(socket, msg.type);
        console.log('+ Successfully connected to connection with id: ', msg.id);
      } else {
        console.log('- No conection found for given id, creating new one');
        createConnection();
      }
    } else {
      createConnection();
    }
  });

  socket.on('remood', function(msg) {
    console.log('remood event triggered: ', msg);
    socket.broadcast.emit('remood', msg);
  });
});

server.listen(1337);
