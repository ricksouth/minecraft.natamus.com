// https://minecraft.natamus.com/anvil-restoration/changelog/
document.addEventListener('DOMContentLoaded', function() {
	var url = document.URL + "";

	var newurl = "https://serilum.com/";
	if (url.includes("/changelog/")) {
		if (url.includes("/?p=/")) {
			newurl = "https://serilum.com/mods?changelog=" + url.split("/?p=/")[1].split("/changelog/")[0];
		}
		else {
			newurl = "https://serilum.com/mods?changelog=" + url.split("natamus.com/")[1].split("/changelog/")[0];
		}
	}

	window.location.replace(newurl);
}, false);