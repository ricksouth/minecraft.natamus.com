var activetags = {};
var neverclicked = true;

var moddls = {};
var modtags = {};
var gifs = [];

$(document).ready(function(e) {
	console.log("96");
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
		//url: "/assets/static/static.json",
		type: "GET",
		dataType: 'json',
		headers: { "x-requested-with": "xhr" },
		success: function(data){
			var totaldownloads = 0;

			for (var i = 0; i < data.length; i++) {
				var slug = replaceAll(data[i]["name"].toLowerCase(), " ", "-");
				var downloads = data[i]["downloadCount"];

				moddls[slug] = downloads;
				if (data[i]["attachments"][0]["url"].includes(".gif")) {
					gifs.push(slug);
				}

				var thistags = [];
				var tags = data[i]["categories"];
				for (var j = 0; j < tags.length; j++) {
					var tagname = tags[j]["name"];
					var tagimg = tags[j]["avatarUrl"];
					if (!(tagname in activetags)) {
						activetags[tagname] = tagimg;
					}

					thistags.push(tagname);
				}

				modtags[slug] = thistags;

				totaldownloads += downloads;
			}
			
			$("#totaldownloads").html(numberWithCommas(totaldownloads));

			loadContent();
		},
		error: function(data) { }
	});
}

function loadContent() {
	$.ajax({
		url: "https://raw.githubusercontent.com/ricksouth/serilum-mc-mods/master/README.md",
		success: function(data){
			var totalmods = 0;

			// tags
			var html = '<div class="abovetagswrapper">'
				+ '<p><span class="title">Category tag selector and search:</span>'
				+ '<span class="buttons"><button id="allbutton">Select All</button>'
				+ '<button id="nonebutton">Select None</button>'
				+ '<input id="searchinput" type="text" placeholder="Search"></span></p>'
				+ '<div class="stwrapper"><p>Showing mods <span id="searchtext"></span>with tags: <span id="selectedtags" class="italic">All</span>.</p></div>'
				+ '</div>'
				+ '<div class="activetags">';

			var sortedkeys = sortedKeys(activetags);
			for (var i = 0; i < sortedkeys.length; i++) {
				var key = sortedkeys[i];
				var value = activetags[key];
				html += '<img alt="' + key + '" src="' + value + '">';
			}

			html += '</div>';

			// tiles
			var style = "<style>";
			html += '<div class="tiles">';
			var dataspl = data.split("\n");
			for (var i = 0; i < dataspl.length; i++) {
				var line = dataspl[i];
				if (line.includes("/mc-mods/")) {
					var linespl = line.split("](");
					if (linespl.length < 2) {
						continue;
					}

					var name = linespl[0].replace("[", "");
					var fullname = name;
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

					var value = 'value=""';
					if (slug in modtags) {
						value = 'value="' + modtags[slug].join(";") + '"';
					}
					else if (slug == "sam-library") { // temp until api updates
						value = 'value="API and Library"';
					}

					style += 'div#mod' + i + ':before { background: url("/assets/images/icons/' + slug + '.' + filetype + '"); background-position: center center; background-size: cover; } div#mod' + i + ':after { content: "' + dlcontent + formatNames(name, " ", " \\A ") + '"; }';
					html += '<div class="col mod"' + value + ' title="' + fullname + '"><a href="' + url + '"></a><a href="' + url + '"></a><a href="' + url + '"></a><a href="' + url + '"></a><div id="mod' + i + '" class="box"></div></div>';
					totalmods += 1;
				}
				else if (line.includes("Discontinued")) {
					break;
				}
			}

			style += '</style>';
			html += '<div class="spacer"></div></div>';

			$("#totalmods").html(numberWithCommas(totalmods));
			$("#inlinestyle").html(style);
			$("#content").html(html);


			afterContent();
		}
	});
}

$(document).on('click', '.activetags img', function(e) {
	var clickelem = $(this);
	var tag = clickelem.attr('alt');

	var actives = [];
	var inactives = [];
	if (neverclicked) {
		$(".activetags img").each(function() {
			var ttag = $(this).attr('alt');
			if ($(this).is(clickelem)) {
				actives.push(ttag);
				return true;
			}
			inactives.push(ttag);
			$(this).addClass("inactive");
		});
		neverclicked = false;
	}
	else {
		clickelem.toggleClass("inactive");
		$(".activetags img").each(function() {
			var ttag = $(this).attr('alt');
			if ($(this).hasClass("inactive")) {
				inactives.push(ttag);
			}
			else {
				actives.push(ttag);
			}
		});
	}

	processTags(actives, inactives);
});

function processTags(actives, inactives) {
	if (actives == null || inactives == null) {
		actives = [];
		inactives = [];
		$(".activetags img").each(function() {
			var ttag = $(this).attr('alt');
			if ($(this).hasClass("inactive")) {
				inactives.push(ttag);
			}
			else {
				actives.push(ttag);
			}
		});
	}

	var search = $("#searchinput").val().toLowerCase();
	console.log(search, actives, inactives);

	$(".col.mod").each(function() {
		var foundtag = false;

		var mtagspl = $(this).attr('value').split(";");
		for (var i = 0; i < mtagspl.length; i++) {
			var mtag = mtagspl[i];
			if (actives.includes(mtag)) {
				foundtag = true;
				break;
			}
		}

		if (foundtag) {
			if (search != "") {
				var title = $(this).attr('title');
				if (!title.toLowerCase().includes(search)) {
					$(this).hide();
					return true;
				}
			}

			$(this).show();
		}
		else {
			$(this).hide();
		}
	});

	var ststring = "All";
	if (actives.length == 0) {
		ststring = "None";
	}
	else if ($(".activetags img.inactive").length != 0) {
		ststring = actives.join(", ");
	}

	$("#selectedtags").html(ststring);
}

$(document).on('click', '.abovetagswrapper button', function(e) {
	if (neverclicked) {
		neverclicked = false;
	}

	var id = $(this).attr('id');

	var alltags = [];
	$(".activetags img").each(function() {
		var ttag = $(this).attr('alt');
		alltags.push(ttag);

		if (id.includes("all")) {
			$(this).removeClass("inactive");
		}
		else {
			$(this).addClass("inactive");
		}
	});

	if (id.includes("all")) {
		processTags(alltags, []);
	}
	else {
		processTags([], alltags);
	}
});

$(document).on({
	mouseenter: function () {
		var tag = $(this).attr('alt');
		var pos = $(this).offset();

		$("#tooltip").html(tag);
		$(".tooltipwrapper").css( { left: (pos.left + $(this).width() + 10), top: pos.top } ).show();
	},
	mouseleave: function () {
		$(".tooltipwrapper").hide();
	}
}, ".activetags img");

$(document).on('input', '#searchinput', function(e) {
	var val = $(this).val();
	if (val == "") {
		$("#searchtext").html("");
	}
	else {
		$("#searchtext").html('with search: <span class="italic">' + val + '</span> and ');
	}

	processTags(null, null);
});

// Util functions
function replaceAll(str, find, replace) { 
	return str.replace(new RegExp(find, 'g'), replace);
}

function formatNames(str, find, replace) {
	var returnstr = "";
	var strspl = str.split(find);
	for (var i = 0; i < strspl.length; i++) {
		if (i == 0) {
			returnstr += strspl[i];
		}
		else if (i % 2 && strspl[i-1].length < 8 && (strspl[i-1].length + strspl[i].length < 13)) { // isOdd
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

function sortedKeys(dct) {
	var keys = [];

	for(var key in dct) {
		if(dct.hasOwnProperty(key)) {
			keys.push(key);
		}
	}
	keys.sort();
	return keys;
}