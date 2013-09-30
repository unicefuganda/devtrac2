if (typeof DT == "undefined")
    DT = {};

DT.LayerOptions = {
    "region": {
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
        key: "region",
        type: "boundary"
    },



    "parish": {
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

                region: feature.properties["SUBREGION"].toLowerCase(),
                district: feature.properties["DNAME_2010"].toLowerCase(),
                subcounty: feature.properties["SNAME_2010"].toLowerCase(),
                parish: feature.properties["PNAME_2006"].toLowerCase()
            });
        },
        key: "parish",
        type: "boundary"
    },
    "district": {
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
        key: "district",
        type: "boundary"

    },
    "subcounty": {
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
                region: feature.properties["SUBREGION"].toLowerCase(),
                district: feature.properties["DNAME_2010"].toLowerCase(),
                subcounty: feature.properties["SNAME_2010"].toLowerCase()
            });
        },
        name: "subcounty",
        type: "boundary"
    },
    "water-point": {
        name: "water-point",
        type: "points",
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
    "health-center": {
        name: "health-center",
        type: "points",
        summaryInformation: function(properties) { 
            if (!properties.Name)
                return { title: "Heath Center", lines: []};

            return {
                title: properties.Name.toLowerCase() + " Heath Center",
                lines: [
                    ["Unit Type", "HC " + properties.UnitType]
                ]
            }
        }
    },
    "school": {
        name: "school",
        type: "points",
        summaryInformation: function(properties) { 
            return {
                title: properties.SCHOOLNAME + " School",
                lines: [
                    ["Owner", properties.MAPSCHLOWN],
                    ["Type", properties.SCHOOLTYPE],
                ]
            }
        }
    }
}