(function($, io) {

  var socket = io(),
      remood;

  // Adds remood remote code
  remood = function(value, type, id) {
    socket.emit('remood', { type: 'direct', data: value, id: id });
  };

  // Adds remood connect method
  $.fn.extend({
    connect: function(eventType, callback) {

      var self = this,
          eventName = arguments.length == 3 ? callback : eventType,
          cb = arguments.length == 3 ? arguments[2] : callback;

      self.on(eventType, function() {
        socket.emit('remood', JSON.stringify({
          id: self.attr('data-remood-id') || self.attr('id'),
          type: eventName,
          data: self.val() || self.attr('data-remood-value')
        }));

        if (cb && typeof(cb) === 'function') {
          cb.apply(this);
        }
      });
    }
  });

  // Bind remood events
  $('#play').connect('click', function() {
    $('#play, #pause').toggleClass('hidden');
  });
  $('#pause').connect('click', function() {
    $('#play, #pause').toggleClass('hidden');
  });

  SC.initialize({
    client_id: "cab916b4c90374ba818ddd060c356f36",
  });

  var $search = $('#search'),
      $searchTerm = $('#search-term'),
      $searchResults = $('#search-results');

  $search.click(function() {

    hash('term', $searchTerm.val());

    SC.get('/tracks?q=' + $searchTerm.val(), function(results) {

      if ($.isArray(results) && results.length) {

        $searchResults.fadeOut('slow', function() {

          $('#search-results > ul').html('');

          $.each(results, function(i, result) {
            if (i > 15) return;
            $('#search-results > ul').append(
              '<li data-remood-value="' + result.uri + '">' + result.title + '</li>');
          });

          $('#search-results li').connect('click', 'sc url', function() {
            $('#search-results li').removeClass('playing');
            $('span.play').remove();
            $(this).addClass('playing');
            $(this).append('<span class="glyphicon glyphicon-play play"></span>');

            //$('#play').trigger('click');
            $('#player').fadeIn('slow');
          });
          $searchResults.fadeIn('slow');
        });
      }
    })
  });

  $searchTerm.keydown(function(e) {
    if (e.keyCode === 13) {
      $('#search').trigger('click');
    }
  });

  $searchTerm.focus();

  var term = hash('term');
  if (term) {
    $searchTerm.val(term);
    $('#search').trigger('click');
  }

})(window.jQuery, window.io);
