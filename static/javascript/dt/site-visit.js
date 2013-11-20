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
    this.images =  [
                {img: '/static/images/site-visit/site-visit_1.jpeg', caption: 'Mr. Isale Richard of Naweet P.S sending text to eduTrac to join.'},
                {img: '/static/images/site-visit/site-visit_2.jpeg', caption: 'Some of the solar charged lanterns with phone charging capability that were given by UNICEF in Nakapiripirit and Amudat.'},
                {img: '/static/images/site-visit/site-visit_3.jpeg', caption: 'Mr. Isale Richard of Naweet P.S stands at a vantage point in the school compound to continue receiving messages'}
        ]

    this.feature = { 
        type: 'Feature',
        properties: properties,
        "geometry":{"type":"Point","coordinates":[ parseFloat(this.lat), parseFloat(this.lng) ]},
        "geometry_name":"the_geom"
    }
};

