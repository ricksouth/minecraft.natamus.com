$(document).ready(function(e) {
	$("#content").load("/content.html", function() {
		loadContent();
	});
});

function loadContent() {
	$.ajax({
		url: "https://raw.githubusercontent.com/natamus/jmh-web/master/data/_directory",
		success: function(data){
			html = $("#availablelist").html();
			data.split("\n").forEach(function(e) { 
				name = "";
				e.split("_").forEach(function(f) {
					if (name != "") {
						name += " ";
					}
					if (f == "and") {
						name += f
					}
					else {
						name += f.charAt(0).toUpperCase() + f.slice(1).toLowerCase();
					}
				});
				html += '<a href="#" class="list-group-item" id="' + e + '"><input type="checkbox" class="pull-left"> ' + name + '</a>';
			});

			$("#availablelist").html(html);
			contentevents();
		}
	});
}

var downloadamount = 0;
var jsondata = {};
function loadJson(packname, url) {
	$.ajax({
		type: "GET",
		url: url,
		dataType: 'json',
		success: function(data) {
			jsondata[packname] = data;
			downloadamount--;
			if (downloadamount == 0) {
				downloadPacks(jsondata);
			}
		},
		error: function(data) {}
	});
}

function downloadPacks(dldata) {
	var ymdhis = new Date().toLocaleDateString("en-ZA", {"year":"numeric","month":"2-digit","day":"2-digit","hour":"numeric","minute":"numeric","second":"numeric"}).replace(/\D+/g, '');;
	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dldata));//, null, "\t"));
	var dle = document.getElementById('downloadAnchorElem');
	dle.setAttribute("href", dataStr);
	dle.setAttribute("download", "jmh-textures-" + ymdhis + ".json");
	dle.click();
}

function contentevents() {
	$("#sb").on('input', function(e) {
		var search = $("#sb").val().replace(" ", "_").toLowerCase();
		$("#availablelist a:not(.active)").each(function(e) {
			var id = $(this).attr('id');
			if (!id.includes(search)) {
				$(this).hide();
			}
			else {
				$(this).show();
			}
		});
	});

	$("#dlb").on('click', function(e) {
		var todownload = $("#todownloadlist a:not(.active)");
		if (todownload.length == 0) {
			alert("Please select one or more textures to download.");
			return;
		}

		downloadamount = todownload.length;
		var urlprefix = "https://raw.githubusercontent.com/natamus/jmh-web/master/data/";
		todownload.each(function(e) { 
			var packname = $(this).attr('id');
			var json = loadJson(packname, urlprefix + packname + ".json");
		});
		return false;
	});

	$('.add').click(function(){
		$('.all').prop("checked",false);
		var items = $("#availablelist input:checked:not('.all')");
		var n = items.length;
		if (n > 0) {
			items.each(function(idx,item){
				var choice = $(item);
				choice.prop("checked",false);
				choice.parent().appendTo("#todownloadlist");
			});
		}
		sortList("todownloadlist");
		checkDownloadButton();
		return false;
	});

	$('.remove').click(function(){
		$('.all').prop("checked",false);
		var items = $("#todownloadlist input:checked:not('.all')");
		items.each(function(idx,item){
			var choice = $(item);
			choice.prop("checked",false);
			choice.parent().appendTo("#availablelist");
		});
		sortList("availablelist");
		checkDownloadButton();
		return false;
	});

	$('.all').click(function(e){
		e.stopPropagation();
		var $this = $(this);
		if($this.is(":checked")) {
			$this.parents('.list-group').find("[type=checkbox]").prop("checked",true);
		}
		else {
			$this.parents('.list-group').find("[type=checkbox]").prop("checked",false);
			$this.prop("checked",false);
		}
		return false;
	});

	$('[type=checkbox]').click(function(e){
		e.stopPropagation();
		return false;
	});

	$('.list-group a').click(function(e){
		e.stopPropagation();

		var $this = $(this).find("[type=checkbox]");
		if($this.is(":checked")) {
			$this.prop("checked",false);
		}
		else {
			$this.prop("checked",true);
		}

		if ($this.hasClass("all")) {
			$this.trigger('click');
		}
		return false;
	});

	$('#avh').click(function(e){
		$("#avc").click();
		return false;
	});
	$('#tdh').click(function(e){
		$("#tdc").click();
		return false;
	});
}

function sortList(listid) {
	$("#" + listid + " a:not('.active')").sort(sort_li).appendTo("#" + listid);
}

function sort_li(a, b){
	return ($(b).attr('id')) < ($(a).attr('id')) ? 1 : -1;    
}

function checkDownloadButton() {
	if ($("#todownloadlist .list-group-item:not(.active)").length > 0) {
		$("#dlb").addClass("active");
	}
	else {
		$("#dlb").removeClass("active");
	}
}