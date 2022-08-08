// https://minecraft.natamus.com/anvil-restoration/changelog/
document.addEventListener('DOMContentLoaded', function() {
	var url = document.URL;

	if (url.includes("/changelog/")) {
		var newurl = "https://serilum.com/mods?changelog=" + url.split("natamus.com/")[1].replace("/changelog/", "");

		window.location.replace(newurl);
		return;
	}

	window.location.replace("https://serilum.com/");
}, false);