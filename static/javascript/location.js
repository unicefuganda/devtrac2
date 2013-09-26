DT.Location = function(location_hash) {
    this.district = location_hash.district ? location_hash.district.toLowerCase() : null;
    this.subcounty = location_hash.subcounty ? location_hash.subcounty.toLowerCase() : null;
    this.parish = location_hash.parish ? location_hash.parish.toLowerCase() : null;

};
DT.Location.prototype.equals = function(otherLocation) {
    return this.district == otherLocation.district &&
        this.subcounty == otherLocation.subcounty &&
        this.parish == otherLocation.parish;

};
DT.Location.prototype.toString = function(){
    return this.getName();
};
DT.Location.prototype.layersToShow = function(filteredKeys) {
    var layers = [["district", new DT.Location({})]];

    if (this.district != null) {
        var districtLocation = new DT.Location({
            district: this.district
        });
        layers.push(["subcounty", districtLocation]);
        layers.push(["water-point", districtLocation]);
        layers.push(["health-center", districtLocation]);
        layers.push(["school", districtLocation]);
    }

    if (this.subcounty != null) {
        var subcountyLocation = new DT.Location({
            district: this.district,
            subcounty: this.subcounty
        });
        layers.push(["parish", subcountyLocation]);
    }

    return $.grep(layers, function(locationKey) { 
        return $.inArray(locationKey[0], filteredKeys) == -1;
    });
};
DT.Location.prototype.isNational = function () {
    return this.district == null && this.subcounty == null && this.parish == null;
};
DT.Location.prototype.getName = function(location) {
    if (this.parish)
        return this.district + ", " + this.subcounty + ", " + this.parish;
    if (this.subcounty)
        return this.district + ", " + this.subcounty;
    if (this.district)
        return this.district;
    return "";
};
DT.Location.compareLayerKeys = function(layerKeys, otherlayerKeys) {

    var keyExists = function(key, keys) {
        return DT.first(keys, function(k) {
            return k[0] == key[0] && k[1].equals(key[1])
        }) != null;
    };

    // var filteredKeys = $.grep(filter, function(toggle, filter) { return toggle; }


    var keysToRemove = $.grep(layerKeys, function(key, index){ 
        return !keyExists(key, otherlayerKeys) 
    });
    var keysToAdd = $.grep(otherlayerKeys, function(key, index){ 
        // if (key[0])
        //     return false;
        return !keyExists(key, layerKeys) 
    });
    



    return {
        toAdd: keysToAdd,
        toRemove: keysToRemove
    }
};
DT.Location.prototype.toUrl = function() {
    if (this.parish != null) {
        return "/district/" + DT.encode(this.district) + "/" + DT.encode(this.subcounty) + "/" + DT.encode(this.parish);
    } else if (this.subcounty != null) {
        return "/district/" + DT.encode(this.district) + "/" + DT.encode(this.subcounty);
    } else if (this.district != null) {
        return "/district/" + DT.encode(this.district);
    } else {
        return "/";
    }
};

DT.Filter = function(toggles) { 
    $.extend(this, toggles);
};

DT.Filter.prototype.dataToggledOff = function() {
    var keysToggledOff = [];
    $.each(this, function(key, toggle) {
        if (toggle == false)
            keysToggledOff.push(key)
    });
    return $.map(keysToggledOff, function(key) { return key.replace("_", "-") });
};