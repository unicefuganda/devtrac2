$(function(){
	$.getJSON("static/version.json", function(data, textStatus, jqXHR) {
		$("#environment").html(data.environment);
		$("#sha").html(data.sha);
		$("#time").html(data.time);
	});
});