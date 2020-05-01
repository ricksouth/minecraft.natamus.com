var moddls = {};
var gifs = [ ];

$(document).ready(function(e) {
	console.log("75");
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
		//url: "https://cors-anywhere.herokuapp.com/https://addons-ecs.forgesvc.net/api/v2/addon/search?searchFilter=serilum&gameId=432",
		url: "https://minecraft.natamus.com/assets/static/static.json",
		type: "GET",
		dataType: 'json',
		headers: { "x-requested-with": "xhr" },
		success: function(data){
			var totalmods = 0;
			var totaldownloads = 0;

			for (var i = 0; i < data.length; i++) {
				var slug = replaceAll(data[i]["name"].toLowerCase(), " ", "-");
				var downloads = data[i]["downloadCount"];

				moddls[slug] = downloads;
				if (data[i]["attachments"][0]["url"].includes(".gif")) {
					gifs.push(slug);
				}

				totalmods += 1;
				totaldownloads += downloads;
			}
			
			$("#totalmods").html(numberWithCommas(totalmods));
			$("#totaldownloads").html(numberWithCommas(totaldownloads));

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
					if (name.includes("(")) {
						name = name.replace(/ *\([^)]*\) */g, " ");
					}
					var url = linespl[1].split(")")[0];
					var slug = url.split("/mc-mods/")[1];

					var filetype = "png";
					if (gifs.includes(slug)) {
						filetype = "gif";
					}

					dlcontent = '\\A \\f019   ';
					if (slug in moddls) {
						dlcontent += numberWithCommas(moddls[slug]);
					}
					else {
						dlcontent += '1';
					}
					dlcontent += " \\A \\A ";

					style += 'div#mod' + i + ':before { background: url("/assets/images/icons/' + slug + '.' + filetype + '"); background-position: center center; background-size: cover; } div#mod' + i + ':after { content: "' + dlcontent + replaceSecond(name, " ", " \\A ") + '"; }';
					
					html += '<div class="col mod"><a href="' + url + '"></a><a href="' + url + '"></a><a href="' + url + '"></a><a href="' + url + '"></a><div id="mod' + i + '" class="box"></div></div>';
					//html += '<div class="col mod"><a href="' + url + '"></a><a href="' + url + '"></a><a href="' + url + '"></a><a href="' + url + '"></a><div id="mod' + i + '" class="box"></div><img class="dlshield" src="https://cf.way2muchnoise.eu/' + slug + '.svg" alt="' + name + '"></div>';
					//html += '<div class="col mod"><a href="' + url + '">' + name + '</a><div class="box"></div></div>';
				}
				else if (line.includes("Discontinued")) {
					break;
				}
			}

			style += '</style>';
			html += '<div class="spacer"></div></div>';

			$("#inlinestyle").html(style);
			$("#content").html(html);
			afterContent();
		}
	});
}

// Util functions
function replaceAll(str, find, replace) { 
	return str.replace(new RegExp(find, 'g'), replace);
}

function replaceSecond(str, find, replace) {
	var returnstr = "";
	var strspl = str.split(find);
	for (var i = 0; i < strspl.length; i++) {
		if (i == 0) {
			returnstr += strspl[i];
		}
		else if (i % 2 && strspl[i-1].length < 8 && (strspl[i-1].length + strspl[i].length < 14)) { // isOdd
			returnstr += find + strspl[i];
		}
		else {
			returnstr += replace + strspl[i];
		}
	}

	return returnstr;
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}