(function(io) {

  $(function() {
    var widget,
        r;

    // Initialize SC Player
    widget = SC.Widget(document.getElementById('sc-widget'));

    // Initialize remood, register remood events
    r = new remood();

    widget.bind(SC.Widget.Events.FINISH, function() {
      r.send({
        id: 'player-finished'
      });
    });

    r.getConnectionId(function(id) {
      hash('id', id);
      var remoteUrl = window.location.host + '/remote#!&id=' + id;

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
