var activetags = {};
var activemods = [];
var neverclicked = true;

var moddata = {};
var moddls = {};
var modtags = {};
var gifs = [];

$(document).ready(function(e) {
	responsiveResize();
	loadJsonData();
});

$(window).on('resize', function(){
	responsiveResize();
});

function responsiveResize() {
	var width = $(window).width();
	var len = $(".navigation .left").html().length;

	if (width < 810-15) {
		if (len > 10) {
			$(".navigation .left").html("←←");
			$(".navigation .middle").html("↑↑");
			$(".navigation .right").html("→→");
		}
	}
	else {
		if (len < 10) {
			$(".navigation .left").html("← Previous mod");
			$(".navigation .middle").html("↑ Back to overview ↑");
			$(".navigation .right").html("Next mod →");
		}
	}
}

function afterContent() {
	$("#content").waitForImages(function(e) {
		$("#loadingwrapper").hide();
		
		var pathname = window.location.pathname;
		var pathslug = replaceAll(pathname, "/", "");
		if (activemods.includes(pathslug)) {
			loadSingular(pathslug);
		}
		else {
			$(".belowtw").fadeIn(200);
			$("#content").fadeIn(200);

			changeUrl("", "Serilum's CurseForge Mods");
		}
	});
}

function loadJsonData() {
	$.ajax({
		url: corsprefix + "https://addons-ecs.forgesvc.net/api/v2/addon/search?searchFilter=serilum&gameId=432",
		type: "GET",
		dataType: 'json',
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

				moddata[slug] = data[i];
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
				+ '<p><span class="title">Category tag selector and search:</span><br>'
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
					html += '<div class="col mod"' + value + ' title="' + fullname + '"><a href="/' + slug + '/" value="' + url + '"></a><a href="/' + slug + '/" value="' + url + '"></a><a href="/' + slug + '/" value="' + url + '"></a><a href="/' + slug + '/" value="' + url + '"></a><div id="mod' + i + '" class="box"></div></div>';
					
					totalmods += 1;
					activemods.push(slug);
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

$(document).on('click', '.tiles .col.mod', function(e) {
	var url = $(this).children("a").attr('value');
	var slug = url.split("/mc-mods/")[1];

	loadSingular(slug);
});

$(document).on('click', '.tiles a', function(e) {
	e.preventDefault();
});

$(document).on('click', '#singular a', function(e) {
	var url = $(this).attr('href');
	var target = $(this).attr('target');

	if (target == "_blank" && !url.includes("https")) {
		$(this).removeAttr('target');
	}
});

/* SINGULAR */
var skipversions = ["1.11", "1.13"];
var otherfilehtml = '<div class="version" value="other"><p>Other Files</p><p>On CurseForge</p><img class="dlicon" src="/assets/images/external.png"></div>';
function loadSingular(slug) {
	$("#content").hide();
	$(".belowtw").hide();
	$("#loadingwrapper").fadeIn(200);

	$("#sngldescription").html("");

	var data = moddata[slug];

	var name = data["name"];
	changeUrl(slug + "/", "Minecraft Mod | " + name);

	var categories = modtags[slug];
	var datecreated = data["dateCreated"];
	var datemodified = data["dateModified"];

	$("#sngltitle").html(name);
	$("#sngltitle").attr('value', slug);
	$("#snglimage").attr('src', '/assets/images/icons/' + slug + getImageType(slug));

	$("#sngltags .val").html(categories.join(", "));
	$("#snglcreated .val").html(formatDate(datecreated));
	$("#snglmodified .val").html(formatDate(datemodified));

	var doneversions = [];
	var filehtml = "";
	var latestfiles = data["gameVersionLatestFiles"];
	for (var key in latestfiles) {
		var filedata = latestfiles[key];

		var gameversion = filedata["gameVersion"].slice(0, -2);
		if (doneversions.includes(gameversion) || skipversions.includes(gameversion)) {
			continue;
		}
		doneversions.push(gameversion);

		var fileid = filedata["projectFileId"];
		var filename = filedata["projectFileName"];
		
		filehtml += '<div class="version" value="' + fileid + '">';
		filehtml += '<p>Minecraft ' + gameversion + '</p>';
		filehtml += '<p class="filename">' + filename + '</p>';
		filehtml += '<img class="dlicon" src="/assets/images/download.png"></div>';
	}
	filehtml += otherfilehtml;
	$("#versionwrapper").html(filehtml);
	$("#dlcount").html(numberWithCommas(data["downloadCount"]));

	var modid = data["id"];
	setDescription(modid);
}

var randomized = 0;
function setDescription(id) {
	var num = Math.floor((Math.random() * 100000) + 1);
	randomized = num;

	$.ajax({
		type: "GET",
		url: corsprefix + "https://addons-ecs.forgesvc.net/api/v2/addon/" + id + "/description",
		success: function(data) {
			clearTimeout(window.setd);

			if (num != randomized) {
				return;
			}

			// Adds a newline after the external links image
			var description = data.replace('"40">', '"40"><br>');
			// replaces curseforge links with local page urls.
			description = replaceAll(description, "https://www.curseforge.com/minecraft/mc-mods/", "/");
			description = replaceAll(description, "https://curseforge.com/minecraft/mc-mods/", "/");
			// remove linkout? prefix
			description = replaceAll(description, "/linkout\\?remoteUrl=https%253a%252f%252fnatam.us%252fsupport", "https://natam.us/support");
			description = replaceAll(description, 'rel="nofollow"', "target=_blank");

			$("#sngldescription").html(description);

			$("#loadingwrapper").hide();
			$("#singular").fadeIn(200);
		},
		error: function(data) {}
	});

	// forces re-load when connection takes too long.
	window.setd = setTimeout(function(){ 
		setDescription(id);
	}, 500);
}

$(document).on('click', '#singular .version', function(e) {
	var fileid = $(this).attr('value');
	var filename = $(this).children(".filename").html();

	var slug = $("#sngltitle").attr('value');

	var url;
	if (fileid != "other") {
		url = 'https://curseforge.com/minecraft/mc-mods/' + slug + '/download/' + fileid;
		downloadFile(url, filename, "application/java-archive");
	}
	else {
		url = 'https://curseforge.com/minecraft/mc-mods/' + slug + '/files';
		openInNewTab(url);
	}
});

$(document).on('click', '#singular .navigation p', function(e) {
	var side = $(this).attr('class');
	if (side == "middle") {
		$("#singular").hide();

		$("#content").fadeIn(200);
		$(".belowtw").fadeIn(200);

		changeUrl("", "Serilum's CurseForge Mods");
	}
	else {
		var slug = $("#sngltitle").attr('value');
		for (var i = 0; i < activemods.length; i++) {
			if (activemods[i] == slug) {
				break;
			}
		}

		var slugi = i;
		if (side == "left") {
			slugi -= 1;
			if (slugi < 0) {
				slugi = activemods.length-1;
			}
		}
		else {
			slugi += 1;
			if (slugi >= activemods.length) {
				slugi = 0;
			}
		}

		loadSingular(activemods[slugi]);
	}

	$(document).scrollTop(0);
});

var ak = { "left" : 37, "right" : 39};
$(document).keydown(function(e) { 
	var which = e.which;

	if ($("#singular").is(":visible")) {
		if (which == ak["left"]) {
			$(".navigation .left").click();
		}
		else if (which == ak["right"]) {
			$(".navigation .right").click();
		}
	}
});

// Util functions
var corsprefix = "https://cors.ntmsdata.com:8080/";

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

function getImageType(slug) {
	if (gifs.includes(slug)) {
		return ".gif";
	}
	return ".png";
}

// 2019-09-21T10:48:44.38Z
function formatDate(date) {
	var datespl = date.split("T")
	return replaceAll(datespl[0], "-", "/") + ", " + datespl[1].split(".")[0];
}

function changeUrl(url, title) {
	var new_url = '/' + url;
	window.history.pushState('data', 'Title', new_url);
	document.title = title;
}

function openInNewTab(url) {
	var win = window.open(url, '_blank');
	win.focus();
}

function downloadFile(data, fileName, mime) {
	const a = document.createElement("a");
	a.style.display = "none";
	document.body.appendChild(a);

	a.href = window.URL.createObjectURL(new Blob([data], { mime }));
	a.setAttribute("download", fileName);
	a.click();

	window.URL.revokeObjectURL(a.href);
	document.body.removeChild(a);
}
