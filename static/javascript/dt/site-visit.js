DT.SiteVisit = function(properties) {
    this.title = properties['Title'];
    this.author = properties['Author'];
    this.date = properties['Date Visited'];
    this.subject = properties['Subject'];
    this.placetype = properties['Place Types'];
    this.siteReportType = properties['Site Report Type'];
    this.lat = properties['Latitude'];
    this.lng = properties['Longitude'];
    this.summary = properties['Public Summary'];
    this.district = properties['District'];
    this.images =  [
                {img: '/static/images/site-visit/site-visit_1.jpeg', caption: 'Mr. Isale Richard of Naweet P.S sending text to eduTrac to join.'},
                {img: '/static/images/site-visit/site-visit_2.jpeg', caption: 'Some of the solar charged lanterns with phone charging capability that were given by UNICEF in Nakapiripirit and Amudat.'},
                {img: '/static/images/site-visit/site-visit_3.jpeg', caption: 'Mr. Isale Richard of Naweet P.S stands at a vantage point in the school compound to continue receiving messages'}
        ]

    this.feature = { 
        type: 'Feature',
        properties: properties,
        "geometry":{"type":"Point","coordinates":[ parseFloat(this.lng), parseFloat(this.lat) ]},
        "geometry_name":"the_geom"
    }
};

