var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);


app.get('/', function(req, res) {
  res.sendFile('html/index.html', { root: __dirname });
});

app.get('/remote', function(req, res) {
  res.sendFile('html/remote.html', { root: __dirname });
});

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));

io.on('connection', function(socket) {
  console.log('Connection successful');

  socket.on('remood', function(msg) {
    console.log('remood event triggered: ', msg);
    socket.broadcast.emit('remood', msg);
  });
});

server.listen(1337);
