$(document).ready(function(e) {
	$("#content").load("/content.html", function() {
		loadContent();
	});
});

function loadContent() {
	$.ajax({
		url: "https://raw.githubusercontent.com/ricksouth/serilum-mc-mods/master/README.md",
		success: function(data){
			var i = 0;
			data.split("\n").each(function(line) {
				console.log(i + ": " + line);
				i+=1;
			});
		}
	});
}