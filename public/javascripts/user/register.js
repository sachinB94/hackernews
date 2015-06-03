$(document).ready(function() {
  $('#register').on('submit', function(e) {
    $.ajax({
      url: '/register',
      method: 'POST',
      data: $('#register').serialize(),
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