var activetags = {};
var activemods = [];

var neverclicked = true;
var showtiledescriptions = true;
var lastscrolltop = 0;
var activetooltipslug = "";
var tooltipelem = null;

var moddata = {};
var moddls = {};
var modtags = {};
var moddescriptions = {};
var gifs = [ "campfire-spawn-and-tweaks", "hidden-recipe-book" ];

$(document).ready(function(e) {
	var subpath = window.location.pathname;
	console.log("Loading minecraft.natamus.com.");
	console.log("Subpath: " + subpath);

	responsiveResize();
	loadJsonData();
});

$(window).on('resize', function(e) {
	responsiveResize();
});

$(document).on('scroll', function(e) {
	if ($(".tooltipwrapper").is(":visible") && tooltipelem != null) {
		$(".tooltipwrapper").css( { top: tooltipelem.offset().top - $(document).scrollTop() } );
	}
});

var kbkeys = { "left" : 37, "right" : 39, "escape" : 27};
$(document).keydown(function(e) { 
	var which = e.which;

	if ($("#singular").is(":visible")) {
		if (which == kbkeys["left"]) {
			$(".navigation .left").click();
		}
		else if (which == kbkeys["right"]) {
			$(".navigation .right").click();
		}
	}
	if ($(".dlscreenwrapper").is(":visible")) {
		if (which == kbkeys["escape"]) {
			hideDownloadScreen();
		}
	}
});

function responsiveResize() {
	var width = $("#singular").width();
	var len = $(".navigation .left").html().length;

	if (width < 700) {
		if (len > 10) {
			$(".navigation #leftarrow").html("←←");
			$(".navigation .middle").html("↑↑");
			$(".navigation #rightarrow").html("→→");
		}
	}
	else {
		if (len < 10) {
			$(".navigation #leftarrow").html("← Previous mod");
			$(".navigation .middle").html("↑ Back to overview ↑");
			$(".navigation #rightarrow").html("Next mod →");
		}
	}

	if (width < 548) {
		var imageheight = $(".snglimagewrapper img").height();
		if (imageheight > 0) {
			$(".changelog").css({ "height": imageheight, "margin-top": (-505 + (500-imageheight)) });
		}
	}
	else {
		$(".changelog").css({ "height": 500, "margin-top": -505 });
	}
}

function afterContent() {
	$("#content").waitForImages(function(e) {
		$("#loadingwrapper").hide();
		
		var pathname = window.location.pathname;
		var pathsearch = window.location.search;
		if (pathsearch.includes("?path=")) {
			pathname = pathsearch.split("?path=")[1];
		}

		var pathslug = replaceAll(pathname, "/", "");
		var clpathslug = pathslug.replace("changelog", "");

		if (activemods.includes(pathslug)) {
			loadSingular(pathslug, false);
		}
		else if (activemods.includes(clpathslug)) {
			loadSingular(clpathslug, true);
		}
		else {
			$("#singular").hide();
			$(".belowtw").fadeIn(200);
			$(".bhsection").fadeIn(200);
			$("#content").fadeIn(200);

			changeUrl("", "Serilum's CurseForge Mods");

			//console.log("Push: Header");
			(adsbygoogle = window.adsbygoogle || []).push({});
		}
	});
}

function loadJsonData() {
	$.ajax({
		url: "/data/mod_data.json",
		type: "GET",
		dataType: 'json',
		success: function(data){
			var totaldownloads = 0;

			for (var datakey in data) {
				var dataline = data[datakey];

				dataline["name"] = dataline["name"].replace(/[\[\]]/g,'');
				var slug = replaceAll(dataline["name"].toLowerCase(), " ", "-");
				var downloads = dataline["downloadCount"];

				moddls[slug] = downloads;
				if (dataline["attachments"][0]["url"].includes(".gif")) {
					gifs.push(slug);
				}

				var thistags = [];
				var tags = dataline["categories"];
				for (var j = 0; j < tags.length; j++) {
					var tagname = tags[j]["name"].trim();
					var tagimg = tags[j]["avatarUrl"];
					if (!(tagname in activetags)) {
						activetags[tagname] = tagimg;
					}

					if (!thistags.includes(tagname)){
						thistags.push(tagname);
					}
				}

				moddata[slug] = dataline;
				modtags[slug] = thistags;

				totaldownloads += downloads;
			}
			
			$("#totaldownloads").html(numberWithCommas(totaldownloads));

			// Process cookies
			var cartisopen = Cookies.get('cartisopen');
			if (cartisopen == "true") {
				$(".shoppingwrapper .insidecart").fadeIn(200);
				$(".shoppingcart .collapse").html("⇑");
				$(".toasterwrapper").addClass("offset");
			}

			var cartitems = Cookies.get('cartitems');
			if (cartitems != undefined && cartitems.length > 5) {
				addToCart("", "", cartitems.split(";"));
			}

			updateCart(false);
			loadDescriptionsFromJson();
		},
		error: function(data) { }
	});
}

function loadDescriptionsFromJson() {
	$.ajax({
		url: "/data/description_data.json",
		type: "GET",
		dataType: 'json',
		success: function(data){
			moddescriptions = data;

			loadContent();
		},
		error: function(data) { }
	});
}

function loadContent() {
	$.ajax({
		url: "/data/README.md",
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

					style += 'div#mod' + i + ':before { background: url("/assets/images/icons/' + slug + '.' + filetype + '"); background-position: center center; background-size: cover; } div#mod' + i + ':after { content: "' + dlcontent + formatTileNames(name, " ", " \\A ") + '"; }';
					html += '<div class="col mod"' + value + ' name="' + fullname + '"><a href="/' + slug + '/" value="' + url + '"></a><a href="/' + slug + '/" value="' + url + '"></a><a href="/' + slug + '/" value="' + url + '"></a><a href="/' + slug + '/" value="' + url + '"></a><div id="mod' + i + '" class="box"></div><div class="addcart modcart hidden"><img class="modcart" src="/assets/images/add-to-cart-white.png"></div></div>';
					
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
			setIncompatibles();
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
				var name = $(this).attr('name');
				if (!name.toLowerCase().includes(search)) {
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
		var tag = "";
		if ($(this).hasClass("emptyimage")) {
			tag = "Empty cart";
		}
		else if ($(this).hasClass("addcart")) {
			tag = "Add to cart"
		}
		else {
			tag = $(this).attr('alt');
		}

		var pos = $(this).offset();
		tooltipelem = $(this);

		$("#tooltip").html(tag);
		$(".tooltipwrapper").css( { left: (pos.left + $(this).width() + 10), right: "initial", top: pos.top - $(document).scrollTop() } ).show();
	},
	mouseleave: function () {
		$(".tooltipwrapper").hide();
	}
}, ".activetags img, .emptywrapper img, .tiles .addcart");

$(document).on({
	mouseenter: function () {
		var tile = $(this).parents(".col.mod");
		var slug = replaceAll($(this).attr('href'), "/", "");
		
		try {
			setDescription(moddata[slug]["id"], slug, "tooltip");
		}
		catch(e) {
			console.log("Error caught on 'mouseenter: function'.");
			return;
		}
		activetooltipslug = slug;

		var pos = $(this).offset();
		tooltipelem = $(this);

		var spaceleft = $(window).width() - pos.left;
		if (spaceleft < 750) {
			$(".tooltipwrapper").css( { left: "initial", right : spaceleft+10, top: pos.top - $(document).scrollTop() } );
		}
		else {
			$(".tooltipwrapper").css( { left: (pos.left + $(this).width() + 10), right : "initial", top: pos.top - $(document).scrollTop() } );
		}

		if (showtiledescriptions) {
			$(".tooltipwrapper").show();
		}
	},
	mouseleave: function () {
		$(".tooltipwrapper").hide();
	}
}, ".tiles .col.mod a");

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
	if ($(e.target).hasClass('modcart')) {
		return;
	}

	var url = $(this).children("a").attr('value');
	var slug = url.split("/mc-mods/")[1];

	loadSingular(slug, false);

	lastscrolltop = $(document).scrollTop();
	$(document).scrollTop(0);
});

$(document).on('contextmenu', '.tiles .col.mod', function(e) {
	showtiledescriptions = !showtiledescriptions;

	if (showtiledescriptions) {
		$(".tooltipwrapper").fadeIn(100);
		showToast("<p>Now showing tile descriptions on hover.</p>");
	}
	else {
		$(".tooltipwrapper").fadeOut(100);
		showToast("<p>Now hiding tile descriptions on hover.</p>");
	}

	e.preventDefault();
});

$(document).on('click', '.tiles a', function(e) {
	e.preventDefault();
});

$(document).on({
	mouseenter: function () {
		$(this).children(".addcart").delay(200).queue(function(next){
			$(this).removeClass("hidden");
			next();
		});
	},
	mouseleave: function () {
		$(this).children(".addcart").stop().addClass("hidden");
	}
}, ".tiles .col.mod");

$(document).on('click', '.tiles .col.mod .addcart', function(e) {
	var tile = $(this).parents('.col.mod');
	var name = tile.attr('name');
	var slug = replaceAll($(tile.children("a")[0]).attr('href'), "/", "");

	addToCart(name, slug, []);
});

/* SINGULAR */
var skipversions = ["1.7.", "1.11", "1.13"];
var otherfilehtml = '<div class="version" value="other"><p>Other Files</p><p>On CurseForge</p><img class="dlicon" src="/assets/images/external.png"></div>';
var addtocarthtml = '<div class="version" value="cart"><p>Add to cart</p><p>For bulk download</p><img class="dlicon" src="/assets/images/add-to-cart.png"></div>';
function loadSingular(slug, forcechangelog) {
	console.log("Loading singular mod: " + slug + ".");

	try {
		var data = moddata[slug];
	}
	catch(e) {
		console.log("Error caught on 'loadSingular(slug, forcechangelog)'.", slug, forcechangelog);
		return;
	}

	if (!forcechangelog) {
		$(".changelognav").removeClass("showing");
		$(".changelognav img").attr('src', '/assets/images/changelog-right.png')
		$(".changelognav span").html('Show version changelog ->');

		$(".changelog").hide();
	}

	$(".tooltipwrapper").hide();
	$("#content").hide();
	$(".belowtw").hide();
	$(".bhsection").hide();
	$("#loadingwrapper").fadeIn(200);

	$("#sngldescription").html("");

	var name = data["name"];

	changeUrl(slug + "/", "Minecraft Mod | " + name);

	var categories = modtags[slug];
	var datecreated = data["dateCreated"];
	var datemodified = data["dateModified"];

	setNextAndPrevious(slug);

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
	filehtml += otherfilehtml + addtocarthtml;
	$("#versionwrapper").html(filehtml);
	$("#dlcount").html(numberWithCommas(data["downloadCount"]));

	var modid = data["id"];
	setDescription(modid, slug, "singular");

	if (forcechangelog) {
		processChangelog(true, false);
	}
}

function setDescription(id, slug, type) {
	if (slug in moddescriptions) {
		var data = moddescriptions[slug];
		if (type == "singular") {
			console.log("Setting description for " + slug + ".");
			processSingularDescription(slug, data);
		}
		else if (type == "tooltip") {
			$("#tooltip").html(formatTooltipDescription(slug, data));
		}

		responsiveResize();
		return;
	}
}
function formatTooltipDescription(slug, data) {
	var description = data.split('<br><br><img src="https://github.com/ricksouth/serilum-mc-mods/raw/master/description/b1.jpg')[0] + '</p>';
	
	if (description.includes('height="400"></a><br><br>')) {
		description = '<p>' + description.split('height="400"></a><br><br>')[1];
	}
	
	description = '<img class="icon" src="/assets/images/icons/' + slug + getImageType(slug) + '">' + description;
	description = '<div class="clickex"><p class="left"><img src="/assets/images/mouse-left.png">Left-click to go to the project page</p><p class="right"><img src="/assets/images/mouse-right.png">Right-click to hide this description</p></div>' + description;
	description = replaceAll(description, "minimalistic ", "");

	return '<div class="description">' + description + '</div>';
}
function processSingularDescription(slug, data) {
	if ($("#sngltitle").attr('value') != slug) {
		return;
	}
	
	clearTimeout(window.setd);

	// Adds a newline after the external links image
	var description = data.replace('"40">', '"40"><br>');

	// hide top image
	if (description.includes('height="400"></a><br><br>')) {
		description = '<p>' + description.split('height="400"></a><br><br>')[1];
	}

	// replaces curseforge links with local page urls.
	description = replaceAll(description, "curseforge.com/minecraft/mc-mods/" + slug + "/files/all?", "TEMP/" + slug + "/files/all?")
	description = replaceAll(description, "https://www.curseforge.com/minecraft/mc-mods/", "/");
	description = replaceAll(description, "https://curseforge.com/minecraft/mc-mods/", "/");
	description = replaceAll(description, "TEMP/" + slug + "/files/all?", "curseforge.com/minecraft/mc-mods/" + slug + "/files/all?")

	// remove linkout? prefix
	description = replaceAll(description, "/linkout\\?remoteUrl=https%253a%252f%252fnatam.us%252fsupport", "https://natam.us/support");
	description = replaceAll(description, 'rel="nofollow"', "target=_blank");
	description = replaceAll(description, "/linkout\\?remoteUrl=", "");
	//description = replaceAll(description, "???", "?");

	var htmlelems = {"%253a" : ":", "%252f" : "/"};
	for (var key in htmlelems) {
		description = replaceAll(description, key, htmlelems[key]);
	}

	var modpageadtop = '<p align="center"><!-- MC Singular Top --><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-7103228011189262" data-ad-slot="8392417459" data-ad-format="auto" data-full-width-responsive="true"></ins></p><br>';
	var modpageadbottom = '<br><p align="center"><!-- MC Singular Bottom --><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-7103228011189262" data-ad-slot="4020899935" data-ad-format="auto" data-full-width-responsive="true"></ins></p>'

	$("#sngldescription").html(modpageadtop + description + modpageadbottom);

	$("#loadingwrapper").hide();
	$("#singular").show();

	try {
		$('#singular ins').each(function() {
			//console.log("Push: ", $(this));
			(adsbygoogle = window.adsbygoogle || []).push({});
		});
	}
	catch(e1) {
		try {
			$('#singular ins').each(function() {
				// console.log("Push: ", $(this));
				(adsbygoogle = window.adsbygoogle || []).push({});
			});
		}
		catch(e2) {
			console.log("Unable to push.");
			return;
		}
	}
}

$(document).on('click', '#singular a, .dlcontent a', function(e) {
	var url = $(this).attr('href');
	var target = $(this).attr('target');

	if (url.startsWith('/')) {
		e.preventDefault();
		loadSingular(replaceAll(url, '/', ''), false);
	}

	if ($(".dlscreenwrapper").is(":visible")) {
		hideDownloadScreen();
	}
});

$(document).on('click', '#singular .version', function(e) {
	var fileid = $(this).attr('value');
	var filename = $(this).children(".filename").html();

	var slug = $("#sngltitle").attr('value');

	var url;
	if (fileid == "other") {
		url = 'https://curseforge.com/minecraft/mc-mods/' + slug + '/files';
		openInNewTab(url, true);
	}
	else if (fileid == "cart") {
		var name = $("#sngltitle").html();
		addToCart(name, slug, []);
	}
	else {
		url = 'https://curseforge.com/minecraft/mc-mods/' + slug + '/download/' + fileid + "/file";
		downloadFile(url, filename, "application/java-archive");	
	}
});

$(document).on('click', '#singular .navigation div', function(e) {
	var side = $(this).attr('class');
	if (side == "middle") {
		$("#singular").hide();

		$("#content").fadeIn(200);
		$(".belowtw").fadeIn(200);
		$(".bhsection").fadeIn(200);

		changeUrl("", "Serilum's CurseForge Mods");
		$(document).scrollTop(lastscrolltop);
	}
	else {
		var slug = $("#sngltitle").attr('value');
		var newslug = getNextOrPrevious(slug, side);

		loadSingular(newslug, false);
	}
});

$(document).on('click', '.changelognav', function(e) {
	$(this).toggleClass("showing");

	processChangelog(false, true);
});
function processChangelog(forceshow, changeurl) {
	var slug = $("#sngltitle").attr('value');
	var name = $("#sngltitle").html();

	if ($(".changelognav").hasClass("showing") || forceshow) {
		if (forceshow) {
			$(".changelognav").addClass("showing");
		}
		setChangelog(slug, name);
	}
	else {
		$(".changelognav img").attr('src', '/assets/images/changelog-right.png')
		$(".changelognav span").html('Show version changelog ->');

		$(".changelog").hide();

		if (changeurl) {
			changeUrl(slug + "/", "Minecraft Mod | " + name);
		}
	}
}
function setChangelog(slug, name) {
	var url = 'https://raw.githubusercontent.com/ricksouth/serilum-mc-mods/master/changelog/' + slug + '.txt';

	$.ajax({
		type: "GET",
		url: url,
		success: function(data) {
			var html = replaceAll(data, "\n", "<br>");
			if (html.includes("#")) {
				html = replaceAll(html, "#", 'https://github.com/ricksouth/serilum-mc-mods/issues/');
			}

			html = createLinks(html);
			
			$(".changelognav img").attr('src', '/assets/images/changelog-left.png')
			$(".changelognav span").html('Hide version changelog <-');

			$(".changelog").html('<p>' + html + '</p>');
			$(".changelog").fadeIn(200);

			changeUrl(slug + "/changelog/", "Changelog | " + name);
		},
		error: function(data) {}
	});
}

function setNextAndPrevious(slug) {
	$("#singular #previousmod").html(getNextOrPrevious(slug, "left"));
	$("#singular #nextmod").html(getNextOrPrevious(slug, "right"));
}
function getNextOrPrevious(slug, side) {
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

	return activemods[slugi];
}

// Shopping cart
var explanationhtml = '<p class="explanation">You can add mods to your cart by clicking the quick add button when hovering over the tile, or when on the mod project page.<button id="cartselectall" class="addallcartbutton">Add all mods</button></p>';
var itemoverlaphtml = '<section class="itemoverlap"><p id="tomodpage">Mod page</p><p id="removemod">Remove</p></section>';
function setHover() {
	$(".shoppingwrapper .insidecart .inventory div").hover(
		function () {
			$(this).children("span").html(itemoverlaphtml);
		},
		function () {
			$(this).children("span").html($(this).attr('name'));
		}
	);
}

$(".shoppingwrapper .shoppingcart").on('click', function(e) {
	toggleCart(false);
});
function toggleCart(forceopen) {
	var isopen;
	var collapseicon = "";
	if($(".insidecart").is(":visible") && !forceopen) {
		$(".insidecart").fadeOut(200);
		$(".toasterwrapper").removeClass("offset");

		collapseicon = "⇓";
		isopen = false;
	}
	else {
		$(".insidecart").fadeIn(200);
		$(".toasterwrapper").addClass("offset");

		collapseicon = "⇑";
		isopen = true;
	}

	$(".shoppingcart .collapse").html(collapseicon);
	Cookies.set('cartisopen', isopen.toString(), { expires: 365 });
}

$(".shoppingwrapper").on('click', '#tomodpage', function(e) {
	var slug = $(this).parents("div.item").attr('value');
	loadSingular(slug, false);
});
$(".shoppingwrapper").on('click', '#removemod', function(e) {
	var parent = $(this).parents("div.item");
	showToast('<p>Removed <span class="slug">' + parent.attr('name') + '</span> from the download cart.</p>');
	
	parent.remove();
	updateCart(true);
});

$(".shoppingwrapper .arrowwrapper .clickdiv").on('click', function(e) {
	$(".shoppingwrapper .arrowwrapper").fadeOut(1000);
});

$(".shoppingwrapper .emptywrapper img").on('click', function(e) {
	$(".shoppingwrapper .inventory").html("");
	showToast('<p>The cart has been emptied.</p>');
	updateCart(true);
});

function updateCart(setcookie) {
	if (setcookie) {
		var cartitems = [];
		$(".shoppingwrapper .insidecart .inventory .item").each(function(e) {
			cartitems.push($(this).attr('value'));
		});
		Cookies.set('cartitems', cartitems.join(";"), { expires: 365 });
	}

	var selectamount = $(".shoppingwrapper .insidecart .inventory .item").length;
	if (selectamount == 1) {
		$(".modcount").html("mod");
		$(".areis").html("is");
	}
	else {
		$(".modcount").html("mods");
		$(".areis").html("are");

		if (selectamount == 0) {
			$(".shoppingwrapper .inventory").html(explanationhtml);
		}
	}

	$(".selectamount").html(selectamount);
	setHover();
}

function addToCart(name, slug, multiple) {
	if ($(".shoppingwrapper .inventory .explanation").is(":visible")) {
		$(".shoppingwrapper .inventory .explanation").hide();
	}

	var html = "";
	if (multiple.length == 0) {
		var cartcontent = {};
		var found = false;
		$(".shoppingwrapper .inventory .item").each(function(e) {
			var loopslug = $(this).attr('value');
			if (loopslug == slug) {
				found = true;
				return false;
			}

			cartcontent[loopslug] = $(this)[0].outerHTML;
		});

		if (found) {
			return;
		}

		var newhtml = '<div class="item" name="' + name + '" value="' + slug + '">';
		newhtml += '<img src="/assets/images/icons/' + slug + getImageType(slug) + '">';
		newhtml += '<span>' + name + '</span></div>';
		cartcontent[slug] = newhtml;

		var sorted = sortedKeys(cartcontent);
		for (var i = 0; i < sorted.length; i++) {
			html += cartcontent[sorted[i]];
		}
	}
	else {
		multiple.sort();
		for (var i = 0; i < multiple.length; i++) {
			var slug = multiple[i];
			try {
				var name = moddata[slug]["name"];
			}
			catch(e) {
				console.log("Error adding mod " + slug + ".")
				continue;
			}

			html += '<div class="item" name="' + name + '" value="' + slug + '">';
			html += '<img src="/assets/images/icons/' + slug + getImageType(slug) + '">';
			html += '<span>' + name + '</span></div>';
		}
	}

	$(".shoppingwrapper .inventory").html(html);
	if (multiple.length == 0) {
		showToast('<p class="carttoast">Added <span class="slug">' + name + '</span> to the download cart.</p>');
	}

	updateCart(true);
}

var previous
function showDownloadScreen() {
	$("body").addClass("faded");
	$(".dlscreenwrapper").show();

	var pathname = window.location.pathname;
	var title = document.title;
	changeUrl("download/?path=" + pathname, title);

	if (!$(".dlscreenwrapper #dlad").hasClass("processed")) {
		$(".dlscreenwrapper #dlad").addClass("processed");
		(adsbygoogle = window.adsbygoogle || []).push({});
	}
}
function hideDownloadScreen() {
	$("body").removeClass("faded");
	$(".dlscreenwrapper").hide();

	var pathname = window.location.pathname + window.location.search;
	if (pathname.includes("?path=")) {
		pathname = pathname.split("?path=")[1];
	}
	else {
		pathname = pathname.replace('/download/', '');
	}

	changeUrl(pathname, document.title);
}

var toastnumber = 0;
function showToast(message) {
	var toastid = 'toast_' + toastnumber;
	var toasthtml = '<div id="' + toastid + '" class="toast">' + message + '</div>';
	$(".toasterwrapper").append(toasthtml);

	window[toastid + "_0"] = setTimeout(function(){ 
		$("#" + toastid).fadeOut(1000);
		window[toastid + "_1"] = setTimeout(function(){ 
			$("#" + toastid).remove();
		}, 1000);
	}, 2500);
	toastnumber+=1;
}

$(".toasterwrapper").on('click', '.toast .carttoast', function(e) {
	toggleCart(true);
});

$("#downloadcart").on('click', function(e) {
	showDownloadScreen();
	setIncompatibles();
});

$("#selectversion").on('change', function(e) { 
	var version = $(this).val();

	$(".dlcontent .minecraftversion").html(version);
	setIncompatibles();
});

function setIncompatibles() {
	var incompatibles = {};
	var activeversion = $("#selectversion").val();
	$(".insidecart .inventory .item").each(function() {
		var slug = $(this).attr('value');

		var versiondata;
		var latestversions = moddata[slug]["gameVersionLatestFiles"];
		for (var i = 0; i < latestversions.length; i++) {
			versiondata = latestversions[i];
			if (versiondata["gameVersion"].includes(activeversion)) {
				break;
			}
			versiondata = null;
		}

		if (versiondata == null) {
			incompatibles[slug] = '<a href="/' + slug + '/">' + moddata[slug]["name"] + '</a>';
		}
	});

	var incompatiblelength = Object.keys(incompatibles).length;
	if (incompatiblelength > 0) {
		var joinhtml = Object.values(incompatibles).join(", ");
		var inchtml = '<p><span class="prefix">The incompatible ';

		if (incompatiblelength > 1) {
			inchtml += 'mods are: ';
			joinhtml = joinhtml.replaceLast(", ", " and ")
		}
		else {
			inchtml += 'mod is: ';
		}

		inchtml += '</span><span class="suffix">' + joinhtml + "</span>.</p>";
		$("#incompatibles").html(inchtml);
	}
	else {
		$("#incompatibles").html("");
	}

	var compatibleamount = parseInt($(".dlcontent .sub .selectamount").html()) - incompatiblelength;
	$(".dlcontent .compatibleamount").html(compatibleamount);
}

$(".dlscreen .closewrapper p").on('click', function(e) {
	if ($(".dlscreenwrapper").is(":visible")) {
		hideDownloadScreen();
	}
});

$("#singular .jumpwrapper input").on('focusin', function(e) {
	updateJumpWrapperResult();
	$(".jumpwrapper .resultwrapper").stop().fadeIn(200);
});

$("#singular .jumpwrapper input").on('focusout', function(e) {
	$(".jumpwrapper .resultwrapper").stop().fadeOut(200);
});

$("#singular .jumpwrapper input").on('input', function(e) {
	updateJumpWrapperResult();
});

$("#singular .jumpwrapper .resultwrapper").on('click', 'p', function(e) {
	var slug = $(this).attr('value');

	$("#singular .jumpwrapper input").val("");
	loadSingular(slug, false);
});

function updateJumpWrapperResult() {
	var val = replaceAll($('#singular .jumpwrapper input').val().toLowerCase(), " ", "-");

	var showmods = [];
	for (var i = 0; i < activemods.length; i++) {
		var slug = activemods[i];
		if (slug.includes(val)) {
			showmods.push(slug);
			if (showmods.length >= 3) {
				break;
			}
		}
	}

	var resulthtml = "";
	for (var i = 0; i < showmods.length; i++) {
		var slug = showmods[i];
		var name = moddata[slug]["name"];
		resulthtml += '<p value="' + slug + '"><img src="/assets/images/icons/' + slug + getImageType(slug) + '">' + name + '</p>';
	}
	
	$(".jumpwrapper .resultwrapper").html(resulthtml);
}

$(".shoppingwrapper").on('click', '#cartselectall', function(e) {
	addToCart("", "", activemods)
});

// Send data to php server which returns a file which you can zip and download..
var subversions = { '1.17' : '1.17.1', '1.16' : '1.16.5', '1.15' : '1.15.2', '1.14' : '1.14.4', '1.12' : '1.12.2' };
var forgeversions = { '1.17' : '37.0.25', '1.16' : '36.2.2', '1.15' : '31.2.31', '1.14' : '28.2.23', '1.12' : '14.23.5.2854' };
$(".dlscreen").on('click', '#startdownload', function(e) {
	var activeversion = $("#selectversion").val();

	var manifest = {};

	var minecraft = {};
	minecraft["version"] = subversions[activeversion];
	var modloaders = {};
	modloaders["id"] = forgeversions[activeversion];
	modloaders["primary"] = true;
	minecraft["modLoaders"] = [modloaders];
	manifest["minecraft"] = minecraft;

	manifest["manifestType"] = "minecraftModpack";
	manifest["manifestVersion"] = 1;
	manifest["name"] = "Mod Collection from https://minecraft.natamus.com/";
	manifest["version"] = "1.0";
	manifest["author"] = "Serilum";

	var files = [];
	$(".insidecart .inventory .item").each(function() {
		var slug = $(this).attr('value');

		var versiondata;
		var latestversions = moddata[slug]["gameVersionLatestFiles"];
		for (var i = 0; i < latestversions.length; i++) {
			versiondata = latestversions[i];
			if (versiondata["gameVersion"].includes(activeversion)) {
				break;
			}
			versiondata = null;
		}

		if (versiondata == null) {
			return true;
		}

		var fileid = versiondata["projectFileId"];
		var projectid = moddata[slug]["id"];
		
		var fileline = {};
		fileline["projectID"] = projectid;
		fileline["fileID"] = fileid;
		fileline["required"] = true;

		files.push(fileline);
	});

	manifest["files"] = files;
	manifest["overrides"] = "overrides";

	var filename = $(".dlcontent .compatibleamount").html() + "_serilum_mods_manifest_" + activeversion;
	$.ajax({
		type: "POST",
		url: "https://ntmsdata.com/a/p/i/post/curseforge/pack.php",
		data: { 
			name : filename,
			version : activeversion,
			manifest : JSON.stringify(manifest)
		},
		success: function(response) {
			downloadFile(response, filename + ".zip", "application/zip");
		},
		error: function(data) {}
	});
});

// Util functions
function replaceAll(str, find, replace) { 
	return str.replace(new RegExp(find, 'g'), replace);
}

function formatTileNames(str, find, replace) {
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
	var newurl = url;
	if (newurl.length == 0) {
		newurl = "/";
	}
	else if (newurl[0] != "/") {
		newurl = "/" + url;
	}

	window.history.pushState('data', 'Title', newurl);
	document.title = title;

	setAlPath(url);
}

function openInNewTab(url, focus) {
	var win = window.open(url, '_blank');
	if (focus) {
		win.focus();
	}
	else {
		win.blur();
		window.focus();
	}
}

function downloadFile(data, fileName, mime) {
	var csvData = new Blob([data], { type: mime });
	if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
		window.navigator.msSaveOrOpenBlob(csvData, fileName);
	}
	else { // for Non-IE (chrome, firefox etc.)

		if (mime.includes("zip")) {
			var a = document.createElement("a");
			document.body.appendChild(a);
			a.style = "display: none";
			a.href = data;

			a.download = fileName;
			a.click();
			URL.revokeObjectURL(a.href)
			a.remove();
		}
		else {
			openInNewTab(data, false);
		}
	}
};

function createLinks(inputText) {
	var replacedText, replacePattern1;

	replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
	replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
	return replacedText;
}

// for IE
String.prototype.includes = function (str) {
	return this.indexOf(str) !== -1;
}
Array.prototype.includes = function (elt) { 
	return this.indexOf(elt) !== -1;
}

String.prototype.replaceLast = function (what, replacement) {
	var pcs = this.split(what);
	var lastPc = pcs.pop();
	return pcs.join(what) + replacement + lastPc;
};

// Analytics
function setAlPath(path) {
	try {
		gtag('config', 'UA-91709614-3', {'page_path': path});
	} catch (e) {}
}