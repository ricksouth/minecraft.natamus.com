$(document).ready(function(e) {
	$("#content").load("/content.html", function() {
		loadContent();
	});
});

function loadContent() {
	$.ajax({
		url: "https://raw.githubusercontent.com/ricksouth/serilum-mc-mods/master/README.md",
		success: function(data){
			var html = "";

			var dataspl = data.split("\n");
			for (var i = 0; i < dataspl.length; i++) {
				var line = dataspl[i];
				if (line.includes("/mc-mods/")) {
					var linespl = line.split("](");
					if (linespl.length < 2) {
						continue;
					}

					var name = linespl[0];
					var url = linespl[1];

					html += '<div class="mod"><a href="' + url + '">' + name + "</a></div>";
				}
				else if (line.includes("Discontinued")) {
					break;
				}
			}

			$("#content").html(html);
		}
	});
}