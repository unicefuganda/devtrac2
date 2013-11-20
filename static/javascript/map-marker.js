if (typeof DT == "undefined")
    DT = {};

DT.markerIcon = function(feature, data, layer_info){

    var projectId = feature.properties['PROJECT_ID'];
    var projectName= feature.properties['PROJ_NAME'];
    var legendIndex = data.legendPartners.partners.indexOf(feature.properties[data.legendPartners.type]);
        
    var circleIcon = new L.DivIcon({
        iconSize: new L.Point([10, 10]),
        className: layer_info.name + "-icon marker-icon ",
        html: "<div class='icon-inner' data-project-name='" + projectName + "' data-project-id = '" + projectId +  "' data-lat='"+feature.geometry.coordinates[1].toFixed(4) +"' data-lng='" + feature.geometry.coordinates[0].toFixed(4) + "'>"
            + "<i class='pin' ><span style='background-color:"+ DT.markerColors[legendIndex] + "'></span></i>" + 
        "</div>",
        popupAnchor: [5, -10]
    });

    return circleIcon;
}

DT.markerPopupMessage = function(summaryInformation) {
    var message = '<h4>' + summaryInformation.title + '</h4>';
    $.each(summaryInformation.lines, function(index, line) {
        message += '<label>' + line[0] + ':</label> ' + line[1] + '</br>';    
    })
    return message;
}

DT.markerPopup = function(feature,layer_info){
    return  L.popup({
                className: "marker-popup" ,
                closeButton: false
            }).setContent(DT.markerPopupMessage(layer_info.summaryInformation(feature.properties)));
}

DT.projectMarker = function(map, feature, data, layer_info){
    var coordinates = feature.geometry.coordinates;

        var  circleIcon = DT.markerIcon(feature, data, layer_info);

        var markerOptions = {
            zIndexOffset: 1000,
            icon: circleIcon
        };

        var projectSelectTimeout;
      
        var marker = new L.Marker(new L.LatLng(coordinates[1], coordinates[0]), markerOptions);

        var popup = DT.markerPopup(feature, layer_info);
        marker.bindPopup(popup);

        marker.on('mouseover', function() {
                     projectSelectTimeout =  setTimeout(function(){
                        marker.openPopup();
                        map.selectProject(feature.properties['PROJECT_ID'])
                    }, 500);
        })            
                .on('mouseout', function() {
                    marker.closePopup();
                    clearTimeout(projectSelectTimeout);
                    map.unselectProject();
                })
                .on('click', function() { 
                    if ($(".icon-inner").hasClass("selected-icon")) {
                        map.unselectIconHandler(feature, layer_info.name);
                    } else {
                        map.selectIconHandler(feature, layer_info.name);
                    }
                });
        return marker;
}