if (typeof DT == "undefined")
    DT = {};

DT.LayerOptions = {
    "parish": {
        unselectedStyle: {
            "fillOpacity": 0,
            "color": "#333",
            "weight": 2
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
            "weight": 2
        },
        selectedStyle: {
            "fillOpacity": 0,
            "color": "#ff0000",
            "weight": 10
        },
        highlightedStyle: {
            "fillOpacity": 0.2,
            "color": "#ff0000",
            "weight": 5
        },
        getLocation: function(feature) {
            return new DT.Location({
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
            "weight": 2
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
        color: "#0000ff"
    },
     "health-center": {
        name: "health-center",
        type: "points",
        color: "#ff0000"
    }
}
