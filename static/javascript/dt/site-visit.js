DT.SiteVisit = function(properties) {
    this.id = properties['Id'];
    this.title = properties['Title'];
    this.author = properties['Author'];
    this.date = properties['Date Visited'];
    this.organisation = "UNICEF";
    this.subject = properties['Subject'];
    this.sitevisit_url = properties['Link'];
    this.placetype = properties['Placetype'];
    this.siteReportType = properties['Site Report Type'];
    this.lat = properties['x'];
    this.lng = properties['y'];
    this.summary = properties['Summary'];
    this.location = properties['Location'];
    this.district = properties['District'];
    this.image_large = properties['Image Large'];
    this.image_small = properties['Image Small'];

    this.feature = { 
        type: 'Feature',
        properties: properties,
        "geometry":{"type":"Point","coordinates":[ parseFloat(this.lat), parseFloat(this.lng) ]},
        "geometry_name":"the_geom"
    }
};

