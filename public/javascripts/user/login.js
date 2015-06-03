$(document).ready(function() {
  $('#login').on('submit', function(e) {
    $.ajax({
      url: '/login',
      method: 'POST',
      data: $('#login').serialize(),
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