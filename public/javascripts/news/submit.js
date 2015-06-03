$(document).ready(function() {
  $('#submit-news').on('submit', function(e) {
    $.ajax({
      url: '/submit-news',
      method: 'POST',
      data: $('#submit-news').serialize(),
    })
      .done(function(data) {
        success(data);
      })
      .fail(function() {
        fail();
      })
    return false;
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