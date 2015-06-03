$(document).ready(function() {
  $('#submit-comment').on('submit', function(e) {
    $.ajax({
      url: '/submit-comment',
      method: 'POST',
      data: { news: news, comment: $('textarea[name=comment]').val() },
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