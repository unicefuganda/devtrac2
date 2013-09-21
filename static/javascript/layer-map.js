DT.LayerMap = function(layerOptions) {
    this.layers = {};
}

DT.LayerMap.prototype.addLayer = function(key, location, layer) {

    if (!this.layers[key])
        this.layers[key] = {}

    this.layers[key].location = location;
    this.layers[key].layer = layer;
};

DT.LayerMap.prototype.removeLayer = function(key) {
    var element = this.layers[key];
    delete this.layers[key];
    return element.layer;
};

DT.LayerMap.prototype.displayedLayerKeys = function() {
    return $.map(this.layers, function(layer, key) {
        return [[key, layer.location]];
    });
};

DT.LayerMap.prototype.displayedLayers = function() {
    return $.map(this.layers, function(layer, key) {
        return layer.layer;
    });
};

DT.LayerMap.prototype.addChildLayer = function(key, location, layer) {
     if (!this.layers[key]) 
        this.layers[key] = {}

    if (!this.layers[key].childLayers) 
        this.layers[key].childLayers = [];
    this.layers[key].childLayers.push(layer);
};