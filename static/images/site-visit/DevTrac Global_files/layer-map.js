if (typeof DT == "undefined")
    DT = {};

DT.LayerMap = function(layerOptions) {
    this.layers = {};
}
DT.LayerMap.prototype.addLayer = function(key, location, layer, type) {
    if (!this.layers[key])
        this.layers[key] = {}

    this.layers[key].location = location;
    this.layers[key].layer = layer;
    this.layers[key].type = type;
};
DT.LayerMap.prototype.removeLayer = function(key) {
    var element = this.layers[key];
    delete this.layers[key];
    return element.layer;
};
DT.LayerMap.prototype.findLayerByKey = function(key, location) {
    var element = this.layers[key];
    if (element != undefined)
        return element.layer;
    else
        return null;
};
DT.LayerMap.prototype.findLayer = function(key, location) {
    var element = this.layers[key];
    if (element.location.equals(location))
        return element.layer;
    return null;
};
DT.LayerMap.prototype.displayedLayerKeys = function() {
    return $.map(this.layers, function(layer, key) {
        return [[key, layer.location, layer.type]];
    });
};
DT.LayerMap.prototype.displayedLayers = function() {
    return $.map(this.layers, function(layer, key) {
        return layer.layer;
    });
};
DT.LayerMap.prototype.findChildLayer = function(location) {
    
    var layers = this.layers[location.level()];
    if (layers.childLayers[location.getName()] != undefined)
        return layers.childLayers[location.getName()]; 
    return null;
};
DT.LayerMap.prototype.findChildLayers = function(key, location) {
    return $.map(this.layers[key].childLayers, function(key, value) {
        return key;
    });
};
DT.LayerMap.prototype.addChildLayer = function(key, parentLocation, childLocation, layer) {
    if (!this.layers[key])
        this.layers[key] = {}

    if (!this.layers[key].childLayers)
        this.layers[key].childLayers = {};
    this.layers[key].childLayers[childLocation.getName()] = layer;
};
DT.LayerMap.prototype.allChildLayers = function() {
    var allChildLayers = $.map(this.layers, function(value, key) {
        if (value.childLayers == undefined)
            return [];
        return $.map(value.childLayers, function(childLayer, key) { return childLayer; });
    });
    return [].concat.apply([], allChildLayers);
};