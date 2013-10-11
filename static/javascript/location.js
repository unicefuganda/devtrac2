if (typeof DT == "undefined")
    DT = {};

DT.Location = function(location_hash) {
    this.region = location_hash.region ? location_hash.region.toLowerCase() : null;
    this.district = location_hash.district ? location_hash.district.toLowerCase() : null;
    this.subcounty = location_hash.subcounty ? location_hash.subcounty.toLowerCase() : null;
    this.parish = location_hash.parish ? location_hash.parish.toLowerCase() : null;

};
DT.Location.prototype.equals = function(otherLocation) {
    return this.region == otherLocation.region &&
        this.district == otherLocation.district &&
        this.subcounty == otherLocation.subcounty &&
        this.parish == otherLocation.parish;
};
DT.Location.prototype.toString = function() {
    return this.getName();
};
DT.Location.prototype.layersToShow = function(filteredKeys) {
    var layers = [
        ["region", new DT.Location({})],
        ["district_outline", new DT.Location({})]
    ];

    if (this.region != null) {
        var regionLocation = new DT.Location({
            region: this.region
        });
        layers.push(["district", regionLocation]);
    }

    if (this.district != null) {
        var districtLocation = new DT.Location({
            region: this.region,
            district: this.district
        });
        layers.push(["subcounty", districtLocation]);
    }

    if (this.subcounty != null) {
        var subcountyLocation = new DT.Location({
            region: this.region,
            district: this.district,
            subcounty: this.subcounty
        });
        layers.push(["parish", subcountyLocation]);
    }

    if (this.level() != "parish") {
        layers.push(["health-center", this]);
        layers.push(["school", this]);
        layers.push(["water-point", this]);
    } else {
        layers.push(["water-point-point", this]);
        layers.push(["school-point", this]);
        layers.push(["health-center-point", this]);
    }

    return $.grep(layers, function(locationKey) {
        return $.inArray(locationKey[0], filteredKeys) == -1;
    });
};

DT.Location.prototype.layerOrder = function() {
    if (this.level() == "national") {
        return ["district", "region", "subcounty", "parish"]
    } else {
        return ["region", "district", "subcounty", "parish"]
    }
}
DT.Location.prototype.getName = function(location) {

    if (this.parish)
        return this.region + ", " + this.district + ", " + this.subcounty + ", " + this.parish;
    if (this.subcounty)
        return this.region + ", " + this.district + ", " + this.subcounty;
    if (this.district)
        return this.region + ", " + this.district;
    if (this.region)
        return this.region;
    return "";
};

DT.Location.fromName = function(name) {
    var name = name.toUpperCase();
    name = name.replace(/^UGANDA(, )?/g, '');
    area_names = name.split(", ")
    location_options = {}

    $.each(DT.Location.levels, function(index, level) {
        location_options[level] = area_names[index];
    });

    return new DT.Location(location_options);
}
DT.Location.compareLayerKeys = function(layerKeys, otherlayerKeys) {

    var keyExists = function(key, keys) {
        return DT.first(keys, function(k) {
            return k[0] == key[0] && k[1].equals(key[1])
        }) != null;
    };

    var keysToRemove = $.grep(layerKeys, function(key, index) {
        return !keyExists(key, otherlayerKeys)
    });
    var keysToAdd = $.grep(otherlayerKeys, function(key, index) {
        return !keyExists(key, layerKeys)
    });

    return {
        toAdd: keysToAdd,
        toRemove: keysToRemove
    }
};
DT.Location.prototype.toUrl = function() {
    if (this.parish != null) {
        return "/dashboard/" + DT.encode(this.region) + "/" + DT.encode(this.district) + "/" + DT.encode(this.subcounty) + "/" + DT.encode(this.parish);
    } else if (this.subcounty != null) {
        return "/dashboard/" + DT.encode(this.region) + "/" + DT.encode(this.district) + "/" + DT.encode(this.subcounty);
    } else if (this.district != null) {
        return "/dashboard/" + DT.encode(this.region) + "/" + DT.encode(this.district);
    } else if (this.region != null) {
        return "/dashboard/" + DT.encode(this.region);
    } else {
        return "/";
    }
};

DT.Location.prototype.urlForLevel = function(level) {
    if (level == "parish") {
        return "/dashboard/" + DT.encode(this.region) + "/" + DT.encode(this.district) + "/" + DT.encode(this.subcounty) + "/" + DT.encode(this.parish);
    } else if (level == "subcounty") {
        return "/dashboard/" + DT.encode(this.region) + "/" + DT.encode(this.district) + "/" + DT.encode(this.subcounty);
    } else if (level == "district") {
        return "/dashboard/" + DT.encode(this.region) + "/" + DT.encode(this.district);
    } else if (level == "region") {
        return "/dashboard/" + DT.encode(this.region);
    } else {
        return "/";
    }
};

DT.Location.levels = ["region", "district", "subcounty", "parish"]
DT.Location.prototype.level = function() {
    currentLevel = "national";

    for (var i = 0; i < DT.Location.levels.length; i++) {
        if (this[DT.Location.levels[i]] == null) {
            break;
        }
        currentLevel = DT.Location.levels[i];

    };
    return currentLevel;
};
DT.Location.prototype.full_name = function() {
    if (this.level() == "national")
        return "Uganda";

    return this[this.level()] + " " + this.level();
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
    return $.map(keysToggledOff, function(key) {
        return key.replace("_", "-")
    });
};