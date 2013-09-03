var cluster = {};

cluster.map = null;

cluster.init = function(){

	this.start = function(){
    $("#map").append("<p>Cluster map spikes starting</p>");		
	}
}


$(function(){
	var clusters = new cluster.init();
	clusters.start();
})


