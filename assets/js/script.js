$(document).ready(function(e) {
	$("#content").load("/content.html", function() {
		loadContent();
	});
});

function loadContent() {
	$.ajax({
		url: "https://raw.githubusercontent.com/ricksouth/serilum-mc-mods/master/README.md",
		success: function(data){
			var style = "<style>";
			var html = "";

			var dataspl = data.split("\n");
			for (var i = 0; i < dataspl.length; i++) {
				var line = dataspl[i];
				if (line.includes("/mc-mods/")) {
					var linespl = line.split("](");
					if (linespl.length < 2) {
						continue;
					}

					var name = linespl[0].replace("[", "");
					var url = linespl[1].split(")")[0];

					style += '#mod' + i + ':after { content: "' + name + '"; }';
					html += '<div class="col mod"><a href="' + url + '"></a><a href="' + url + '"></a><a href="' + url + '"></a><a href="' + url + '"></a><div id="mod' + i + '" class="box"></div></div>';
					//html += '<div class="col mod"><a href="' + url + '">' + name + '</a><div class="box"></div></div>';
				}
				else if (line.includes("Discontinued")) {
					break;
				}
			}

			style += '</style>';
			$("#inlinestyle").html(style);
			$("#content").html(html);
		}
	});
}