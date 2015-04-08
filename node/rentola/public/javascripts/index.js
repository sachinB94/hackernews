$(document).ready(function() {
	if (student === false) {
		$('.favourite-link').on('click', function (event) {
			event.preventDefault();
			alert('Please login first.');
			return false;
		});
	} else {
		$('.favourite-link').on('click', function (event) {
			event.preventDefault();
			var that = this;
			var listId = $(that).parents('.thumbnail:eq(0)').attr('id');
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
	}
});