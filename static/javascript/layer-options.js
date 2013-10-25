if (typeof DT == "undefined")
    DT = {};

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