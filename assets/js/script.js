$(document).ready(function(e) {
	$("#content").load("/content.html", function() {
		
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

					var name = linespl[0].replace("[", "");
					var url = linespl[1].split(")")[0];

					html += '<div class="col mod"><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><div class="box"></div></div>';
					//html += '<div class="col mod"><a href="' + url + '">' + name + '</a><div class="box"></div></div>';
				}
				else if (line.includes("Discontinued")) {
					break;
				}
			}

			$("#content").html(html);
		}
	});
}