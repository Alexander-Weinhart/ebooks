document.addEventListener("navbarLoaded", function() {
	console.log("Navbar loaded, generating dynamic navigation");

	// Check if navDropdowns object exists
	if (typeof navDropdowns === 'undefined') {
		console.error('navDropdowns object not found. Make sure nav-data.js is loaded before nav.js');
		return;
	}

	$.ajax({
		url: "dropdown.html",
		async: true,
		success: function(data) {
			$(".core-nav").html(data);
			var template = $(".core-nav").children();
			var originalTemplate = template.clone();

			// Clear the container to remove the template
			$(".core-nav").empty();

			// Build the nav from navDropdowns object
			var dropdownKeys = Object.keys(navDropdowns);
			for (var i = 0; i < dropdownKeys.length; i++) {
				var key = dropdownKeys[i];
				var dropdown = navDropdowns[key];

				var newCat = originalTemplate.clone();
				newCat.addClass("id" + i);
				$(".core-nav").append(newCat);
				newCat.find('.dd-text').html('<h3>' + dropdown["dd-text"] + '</h3>');

				var subMenu = newCat.find('#dd-menu')[0];
				var menuItems = dropdown["dd-menu"];
				for (var itemName in menuItems) {
					if (menuItems.hasOwnProperty(itemName)) {
						var itemUrl = menuItems[itemName];
						subMenu.innerHTML += '<a href="' + itemUrl + '" rel="noopener noreferrer"><h3>' + itemName + '</h3></a>';
					}
				}
			}

			// Now that nav is built, add event listeners
			var catLinks = [];
			for (var i = 0; i < dropdownKeys.length; i++) {
				var element = document.querySelector(".dropdown.id" + i);
				if (element) {
					catLinks.push(element);
				}
			}

			function click(clickedLink) {
				var wasSelected = clickedLink.classList.contains('dd-selected');
				catLinks.forEach(function(link) {
					link.classList.remove('dd-selected');
				});
				if (!wasSelected) {
					clickedLink.classList.add('dd-selected');
				}
			}

			catLinks.forEach(function(link) {
				link.addEventListener('click', function(e) {
					e.stopPropagation();
					click(link);
				});
			});

			// Dispatch event to indicate navigation is ready
			document.dispatchEvent(new Event("dynamicNavLoaded"));
			console.log("Dynamic navigation loaded successfully");
		}
	});
});
