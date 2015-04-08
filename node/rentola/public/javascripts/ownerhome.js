$(document).ready(function() {
	$("#updateProfileForm").submit(function (event) {
		event.preventDefault();
		var postData = $(this).serialize();
		var formURL = $(this).attr("action");
		$.ajax({
			url : formURL,
			type: "POST",
			data : postData,
			success: function(data, textStatus, jqXHR)  {
				alert('Profile updated');
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert(errorThrown);
			}
		});
	});

	$("#changePasswordForm").submit(function (event) {
		event.preventDefault();
		var postData = $(this).serialize();
		var formURL = $(this).attr("action");
		$.ajax({
			url : formURL,
			type: "POST",
			data : postData,
			success: function(data, textStatus, jqXHR)  {
				alert('Password changed');
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert(errorThrown);
			}
		});
	});

	$(".deleteListButton").each(function() {
		$(this).click(function (event) {
			if (!confirm("Are you sure?")) {
				event.preventDefault();
				return false;
			}
		});
	});

	$(".iCheck-helper").on('click', function() {
		if ($(this).parent().hasClass('checked')) {
			$("." + $(this).siblings().attr('value')).show();
		} else {
			$("." + $(this).siblings().attr('value')).hide();
		}
	});
});