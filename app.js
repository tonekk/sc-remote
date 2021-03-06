var express = require('express'),
    app = express(),
    remood = require('remood'),
    server = remood(app),
    blade = require('blade'),
    MobileDetect = require('mobile-detect');

app.get('/', function(req, res) {
  if (new MobileDetect(req.headers['user-agent']).mobile()) {
    res.redirect('/remote');
  } else {
    res.redirect('/player');
  }
});

app.get('/player', function(req, res) {
  blade.renderFile('assets/blade/player.blade', {}, function(err, html) {
    res.send(html);
  });
});

app.get('/remote', function(req, res) {
  blade.renderFile('assets/blade/remote.blade', {}, function(err, html) {
    res.send(html);
  });
});

app.use(express.static(__dirname + '/assets'));

// Blade middleware
app.use(blade.middleware(__dirname + '/assets/blade') );

server.listen(process.env.PORT || 1337);
console.log('Listening on port ' + (process.env.PORT || 1337) + '...');
