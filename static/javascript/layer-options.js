if (typeof DT == "undefined")
    DT = {};

DT.Layers = {
    boundaryLayers: function(location) {
         var layers = [
            ["region", new DT.Location({})],
            ["district_outline", new DT.Location({})]
        ];

        if (location.region != null) {
            var regionLocation = new DT.Location({
                region: location.region
            });
            layers.push(["district", regionLocation]);
        }

        if (location.district != null) {
            var districtLocation = new DT.Location({
                region: location.region,
                district: location.district
            });
            layers.push(["subcounty", districtLocation]);
        }

        if (location.subcounty != null) {
            var subcountyLocation = new DT.Location({
                region: location.region,
                district: location.district,
                subcounty: location.subcounty
            });
            layers.push(["parish", subcountyLocation]);
        }
        return layers;
        
    },
    filterLayers: function (location, filteredKeys) {
        var layers = [];
        if (location.level() != "parish") {
            layers.push(["health-center", location]);
            layers.push(["school", location]);
            layers.push(["water-point", location]);
        } else {
            layers.push(["water-point-point", location]);
            layers.push(["school-point", location]);
            layers.push(["health-center-point", location]);
        }

        if (location.level() == "district" || location.level() == "subcounty" || location.level() == "parish") {
            layers.push(["project-point", location]);
        } else {

        }

        return $.grep(layers, function(locationKey) {
            return $.inArray(locationKey[0], filteredKeys) == -1;
        });
    },

    compareLayerKeys: function(layerKeys, otherlayerKeys) {
        var keyExists = function(key, keys) {
            return DT.first(keys, function(k) {
                return k[0] == key[0] && k[1].equals(key[1])
            }) != null;
        };

        var keysToRemove = $.grep(layerKeys, function(key, index) {
            return !keyExists(key, otherlayerKeys);
        });
        var keysToAdd = $.grep(otherlayerKeys, function(key, index) {
            return !keyExists(key, layerKeys);
        });

        return {
            toAdd: keysToAdd,
            toRemove: keysToRemove
        }
    },

    getChanges: function (layers, location, filteredKeys) {
        newLayers = DT.Layers.boundaryLayers(location).concat(DT.Layers.filterLayers(location, filteredKeys));

        //TODO: refactor to use keys instead of indexes
        var boundaryLayers = $.grep(layers, function(layer) { return layer[2] == 'boundary'; });
        var nonBoundaryLayers = $.grep(layers, function(layer) { return layer[2] != 'boundary'; });


        var comparison = DT.Layers.compareLayerKeys(boundaryLayers, newLayers);
        comparison.toRemove = comparison.toRemove.concat(nonBoundaryLayers);
        return comparison
    }

};



DT.LayerOptions = {
    "region": {
        selectable: true,
        unselectedStyle: {
            "fillOpacity": 0,
            "color": "#333",
            "weight": 1
        },
        selectedStyle: {
            "fillOpacity": 0,
            "color": "#FFFF00",
            "weight": 8
        },
        highlightedStyle: {
            "fillOpacity": 0.2,
            "color": "#FFFF00",
            "weight": 2
        },
        getLocation: function(feature) {
            return new DT.Location({
                region: feature.properties["Reg_2011"].toLowerCase()
            });
        },
        selectable: true,
        key: "region",
        type: "boundary"
    },
    "parish": {
        selectable: true,
        unselectedStyle: {
            "fillOpacity": 0,
            "color": "#333",
            "weight": 1
        },
        selectedStyle: {
            "fillOpacity": 0,
            "color": "#00ff00",
            "weight": 8
        },
        highlightedStyle: {
            "fillOpacity": 0.2,
            "color": "#00ff00",
            "weight": 2
        },
        getLocation: function(feature) {
            return new DT.Location({
                region: feature.properties["Reg_2011"].toLowerCase(),
                district: feature.properties["DNAME_2010"].toLowerCase(),
                subcounty: feature.properties["SNAME_2010"].toLowerCase(),
                parish: feature.properties["PNAME_2006"].toLowerCase()
            });
        },
        selectable: true,
        key: "parish",
        type: "boundary"
    },
    "district": {
        selectable: true,
        unselectedStyle: {
            "fillOpacity": 0,
            "color": "#333",
            "weight": 0.5
        },
        selectedStyle: {
            "fillOpacity": 0,
            "color": "#ff0000",
            "weight": 5
        },
        highlightedStyle: {
            "fillOpacity": 0.2,
            "color": "#ff0000",
            "weight": 1
        },
        getLocation: function(feature) {
            return new DT.Location({
                region: feature.properties["Reg_2011"].toLowerCase(),
                district: feature.properties["DNAME_2010"].toLowerCase(),
            });
        },
        selectable: true,
        key: "district",
        type: "boundary"

    },
    "district_outline": {
        selectable: false,
        unselectedStyle: {
            "fillOpacity": 0,
            "color": "#333",
            "weight": 0.5
        },

        getLocation: function(feature) {
            return new DT.Location({
                region: feature.properties["Reg_2011"].toLowerCase(),
                district: feature.properties["DNAME_2010"].toLowerCase(),
            });
        },
        selectable: false,
        key: "district",
        type: "boundary"

    },
    "subcounty": {
        selectable: true,
        unselectedStyle: {
            "fillOpacity": 0,
            "color": "#777",
            "weight": 1
        },
        selectedStyle: {
            "fillOpacity": 0,
            "color": "#0000ff",
            "weight": 8
        },
        highlightedStyle: {
            "fillOpacity": 0.2,
            "color": "#0000ff",
            "weight": 2
        },
        getLocation: function(feature) {
            return new DT.Location({
                region: feature.properties["Reg_2011"].toLowerCase(),
                district: feature.properties["DNAME_2010"].toLowerCase(),
                subcounty: feature.properties["SNAME_2010"].toLowerCase()
            });
        },
        selectable: true,
        name: "subcounty",
        type: "boundary"
    },
    "water-point": {
        name: "water-point",
        type: "aggregate",
        getValue: function(stats, childLocation) { 
            return "<div data-locator='" + childLocation.getName() + "'>" 
                    + stats.info['water-point']
                    + '</div>';
        }
    },
    "health-center": {
        name: "health-center",
        type: "aggregate",
        getValue: function(stats, childLocation) { 
            return "<div data-locator='" + childLocation.getName() + "'>" 
                    + stats.info['health-center']
                    + '</div>';
        }
    },
    "school": {
        name: "school",
        type: "aggregate",
        getValue: function(stats, childLocation) { 
            return "<div data-locator='" + childLocation.getName() + "'>" 
                    + stats.info.school
                    + '</div>';
        }
        
    },
    "water-point-point": {
        name: "water-point-point",
        type: "point",
        getValue: function(properties) { 
            return "" 
        },
        summaryInformation: function(properties) {
            return {
                title: properties.SourceType + " Water Point",
                lines: [
                    ["Functional", properties.Functional],
                    ["Management", properties.Management],
                ]
            }
        } 
    },
    "school-point": {
        name: "school-point",
        type: "point",    
        getValue: function(properties) { 
            return "" 
        },   
        summaryInformation: function(properties) { 
            return {
                title: properties.SCHOOLNAME + " School",
                lines: [
                    ["Owner", properties.MAPSCHLOWN],
                    ["Type", properties.SCHOOLTYPE],
                ]
            }
        }
    },
    "health-center-point": {
        name: "health-center-point",
        type: "point",
        getValue: function(properties) { 
            return "" 
        },
        summaryInformation: function(properties) { 
            if (!properties.Name)
                return { title: "Health Center", lines: []};

            return {
                title: properties.Name.toLowerCase() + " Health Center",
                lines: [
                    ["Unit Type", "HC " + properties.UnitType]
                ]
            }
        }
    },
    "ureport": {
        name: "ureport",
        type: "aggregate",
        getValue: function(stats) { 
            return "<div class= 'glyphicon glyphicon-th category_" + stats.top.category_id + "' ></div>" 
        }
    },
    "project-point": {
        name: "project-point",
        type: "point",
        getValue: function(properties) { 
            return "<img src='\\static\\images\\" + properties.PARTNER.toLowerCase() + ".png'> " 
        },
        summaryInformation: function(properties) { 
           return {
                title: properties.PROJ_NAME.toLowerCase() + " Project",
                lines: [
                    ["Partner", properties.PARTNER],
                    ["Description", properties.PROJ_DESC]
                ]
            }
        }
    },
}