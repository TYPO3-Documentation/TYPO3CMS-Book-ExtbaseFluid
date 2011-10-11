jQuery(document).ready(function($) {
	$(document).keydown(function(e) {
		var href = null;
		if (e.keyCode == 37) {
				// left key
			href = $('div.rel a[accesskey="P"]').attr('href');
		} else if (e.keyCode == 39) {
				// right key
			href = $('div.rel a[accesskey="N"]').attr('href');
		}
		if (href) {
			window.location.href = href;
			return false;
		}
	});

	// The following code makes the sidebar fixed when scrolling.
	// However, as our sidebar contains very much content, it is too long for effective use.
	// that's why the following lines are commented out.

	/*var sidebar = $('div.sidebar');
	var sidebarCurrentlyFixed = false;
	$(window).scroll(function(e) {
		if (!sidebarCurrentlyFixed && $(window).scrollTop() > 107) {
			sidebar.addClass('sidebarFixed');
			sidebarCurrentlyFixed = true;
		} else if (sidebarCurrentlyFixed && $(window).scrollTop() < 107) {
			sidebar.removeClass('sidebarFixed');
			sidebarCurrentlyFixed = false;
		}
	});*/
});