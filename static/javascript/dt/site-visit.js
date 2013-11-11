DT.SiteVisit = function(properties) {
    this.title = properties['Title'];
    this.author = properties['Author'];
    this.date = properties['Date Visited'];
    this.organisation = "UNICEF";
    this.subject = properties['Subject'];
    this.sitevisit_url = properties['Link'];
    this.placetype = properties['PlaceType'];
};