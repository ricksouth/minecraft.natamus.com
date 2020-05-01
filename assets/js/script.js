$(document).ready(function(e) {
	$("#content").load("/content.html", function() {
		loadContent();
	});
});

function loadContent() {
	$.ajax({
		url: "https://raw.githubusercontent.com/ricksouth/serilum-mc-mods/master/README.md",
		success: function(data){
			var dataspl = data.split("\n");
			for (var i = 0; i < dataspl.length; i++) {
				console.log(i + ": " + dataspl[i]);
			}
		}
	});
}