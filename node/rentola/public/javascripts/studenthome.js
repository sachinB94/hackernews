$(document).ready(function() {
	$('.favourite-link').on('click', function (event) {
		event.preventDefault();
		var that = this;
		var listId = $(that).parents('.thumbnail:eq(0)').attr('id');
		$.post('/removefavourite', {'listId': listId}, function (data) {
			if (!data.err) {
				$('#' + listId).parent().parent().hide("slow", function() {
					$(this).remove();
				});
			} else {
				alert(data.err);
			}
		});
	});
});