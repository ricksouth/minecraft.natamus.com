var gifs = [ "bamboo-spreads", "better-beacon-placement", "configurable-despawn-timer", "cycle-paintings", "hide-hands", "kelp-fertilizer", "replanting-crops" ];

$(document).ready(function(e) {
	console.log("27");
	loadJsonData();
});

function afterContent() {
	$("#content .box").waitForImages(function(e) {
		$("#loadingwrapper").hide();
		$("#content").fadeIn(200);
	});
}

function loadJsonData() {
	$.ajax({
		url: "https://cors-anywhere.herokuapp.com/https://addons-ecs.forgesvc.net/api/v2/addon/search?searchFilter=serilum&gameId=432",
		headers: {
			'Origin':'https://minecraft.natamus.com/'
		},
		type: "GET",
		dataType: 'jsonp',
		success: function(data){
			console.log(data);
			loadContent();
		},
		error: function(data) {
			console.log("NOPE!");
		}
	});
}

function loadContent() {
	$.ajax({
		url: "https://raw.githubusercontent.com/ricksouth/serilum-mc-mods/master/README.md",
		success: function(data){
			var style = "<style>";
			var html = '<div class="tiles">';

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
					var slug = url.split("/mc-mods/")[1];

					var filetype = "png";
					if (gifs.includes(slug)) {
						filetype = "gif";
					}

					style += 'div#mod' + i + ':before { background: url("/assets/images/icons/' + slug + '.' + filetype + '"); background-position: center center; background-size: cover; } div#mod' + i + ':after { content: "' + name + '"; }';
					
					html += '<div class="col mod"><a href="' + url + '"></a><a href="' + url + '"></a><a href="' + url + '"></a><a href="' + url + '"></a><div id="mod' + i + '" class="box"></div></div>';
					//html += '<div class="col mod"><a href="' + url + '"></a><a href="' + url + '"></a><a href="' + url + '"></a><a href="' + url + '"></a><div id="mod' + i + '" class="box"></div><img class="dlshield" src="https://cf.way2muchnoise.eu/' + slug + '.svg" alt="' + name + '"></div>';
					//html += '<div class="col mod"><a href="' + url + '">' + name + '</a><div class="box"></div></div>';
				}
				else if (line.includes("Discontinued")) {
					break;
				}
			}

			style += '</style>';
			html += '</div>';

			$("#inlinestyle").html(style);
			$("#content").html(html);
			afterContent();
		}
	});
}