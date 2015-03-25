(function(io) {

  $(function() {
    var widget,
        r;

    // Initialize SC Player
    widget = SC.Widget(document.getElementById('sc-widget'));

    // Initilize QRCode
    $('#qr-code').qrcode(window.location.host + '/remote' + window.location.hash);

    // Initialize remood, register remood events
    r = new remood();
    window.r = r;
    r.getConnectionId(function(id) {
      hash('id', id);
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
        widget.load(msg.data);
      }
    });

  });
})(window.io);
