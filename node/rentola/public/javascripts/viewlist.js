$(document).ready(function() {
	$('.favourite-link').on('click', function (event) {
		event.preventDefault();
		var that = this;
		if ($(that).children().hasClass('fa-star-o')) {
			var href = '/addfavourite';
		} else {
			var href = '/removefavourite';
		}
		$.post(href, {'listId': listId}, function (data) {
			if (!data.err) {
				$(that).children().toggleClass('fa-star fa-star-o');					
			} else {
				alert(data.err);
			}
		});
	});

	$('.rent' + $('.type').val()).toggleClass('display-inline display-none');

	$('.type').on('change', function() {
		$('.rent').removeClass('display-inline').addClass('display-none');
		$('.rent' + $('.type').val()).toggleClass('display-inline display-none');
	});

	$('.ac' + $('.type').val()).toggleClass('display-inline display-none');

	$('.type').on('change', function() {
		$('.ac').removeClass('display-inline').addClass('display-none');
		$('.ac' + $('.type').val()).toggleClass('display-inline display-none');
	});
});