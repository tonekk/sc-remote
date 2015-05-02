(function(io) {

  $(function() {
    var widget,
        r;

    // Initialize SC Player
    widget = SC.Widget(document.getElementById('sc-widget'));
    widget.setVolume(50);

    // Initialize remood, register remood events
    r = new remood();

    widget.bind(SC.Widget.Events.FINISH, function() {
      r.send({
        id: 'player-finished'
      });
    });

    r.getConnectionId(function(id) {
      var remoteUrl;

      hash('id', id);
      remoteUrl = window.location.origin + '/remote' + window.location.hash;

      // Initilize QRCode
      $('#qr-code')
        .qrcode(remoteUrl)
        .wrap('<a href="' + remoteUrl + '" target="_blank"/>');

    });

    r.on('play', function(msg) {
      widget.play();
    });

    r.on('pause', function(msg) {
      widget.pause();
    });

    r.on('volume', function(msg) {
      widget.setVolume(msg.data / 100);
    });

    r.on({
      eventType: 'sc url',
      callback: function(msg) {
        widget.load(msg.data, { callback: function() {
          console.log('player ready');
          r.send({
            id: 'player-ready'
          });
        }});
      }
    });

  });
})(window.io);
