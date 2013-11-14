angular.module("dashboard")
    .service("heatmapService", function() {
        var indicators = [{
            layer: "uganda_district_indicators_2",
            key: "CompletePS_Perc",
            name: "Percentage of children completing Primary School",
            wmsUrl: "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/wms",
            legendUrl: "request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=geonode:uganda_district_indicators_2&format=image%2Fpng&legend_options=fontAntiAliasing:true;fontSize:12;"
        }, {
            layer: "uganda_districts_2011_with_school_start",
            key: "School_Start_at6_Perc",
            name: "Percentage of children starting school at 6",
            wmsUrl: "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/wms",
            legendUrl: "request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=geonode:uganda_districts_2011_with_school_start&format=image%2Fpng&legend_options=fontAntiAliasing:true;fontSize:12;"
        }, {
            layer: "ureport_poll_165",
            name: "Barriers to farming",
            wmsUrl: "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/wms",
            legendUrl: "request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=geonode:ureport_poll_165&format=image%2Fpng&legend_options=fontAntiAliasing:true;fontSize:12;",
            ureport_poll: 165
        }, {
            layer: "ureport_poll_551",
            name: "Youth Day",
            wmsUrl: "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/wms",
            legendUrl: "request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=geonode:ureport_poll_551&format=image%2Fpng&legend_options=fontAntiAliasing:true;fontSize:12;",
            ureport_poll: 551
        }]

        this.ureport = function() {
            return $.grep(indicators, function(indicator) {
                return indicator.ureport_poll != null;
            });
        }

        this.datasets = function() {
            return $.grep(indicators, function(indicator) {
                return indicator.ureport_poll == null;
            });
        }
    });