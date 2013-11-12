DT.SiteVisit = function(properties) {
    this.title = properties['Title'];
    this.author = properties['Author'];
    this.date = properties['Date Visited'];
    this.organisation = "UNICEF";
    this.subject = properties['Subject'];
    this.sitevisit_url = properties['Link'];
    this.placetype = properties['PlaceType'];
    this.lat = properties['x'];
    this.lng = properties['y'];

    this.feature = { 
        type: 'Feature',
        properties: this,
        "geometry":{"type":"Point","coordinates":[ parseFloat(this.lat), parseFloat(this.lng) ]},
        "geometry_name":"the_geom"
    }

    console.log(this.feature);
};

