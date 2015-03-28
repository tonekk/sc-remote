(function($, io) {

  $(function() {
    var r = new remood();

    r.on('player-ready', function(msg) {
      $('#play').click();
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
              if (i > 25) return;
              blade.Runtime.loadTemplate("search-item.blade", function(err, tmpl) {
                tmpl({"result": result}, function(err, html) {
                  $html = $($.parseHTML(html));

                  $html
                  .appendTo('#search-results > ul')
                  .connect('click', 'sc url', function() {
                    $('#search-results li').removeClass('playing');
                    $(this).add('#player').addClass('playing');
                  });
                });
              });
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
  });

})(window.jQuery, window.io);
