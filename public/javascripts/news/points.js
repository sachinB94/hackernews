$(document).ready(function() {
  $('.upvote').on('click', function(e) {
    e.preventDefault();
    $.ajax({
      url: '/upvote',
      method: 'POST',
      data: { news: $(this).attr('href') }
    })
      .done(function(data) {
        success(data);
      })
      .fail(function() {
        fail();
      })
  });

  $('.downvote').on('click', function(e) {
    e.preventDefault();
    $.ajax({
      url: '/downvote',
      method: 'POST',
      data: { news: $(this).attr('href') }
    })
      .done(function(data) {
        success(data);
      })
      .fail(function() {
        fail();
      })
  });

  var success = function(data) {
    if (data.err) {
      alert(data.err);
    } else {
      location.reload();
    }
  }

  var fail = function() {
    alert('An error occured. Please try after some time.');
  }
});