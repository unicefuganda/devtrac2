DT.Location = function(location_hash) {
    this.district = location_hash.district;
    this.subcounty = location_hash.subcounty;
    this.parish = location_hash.parish;

};

DT.Location.prototype.equals = function(otherLocation) {
    return this.district == otherLocation.district &&
        this.subcounty == otherLocation.subcounty &&
        this.parish == otherLocation.parish;

};

DT.Location.prototype.layersToShow = function() {
    var layers = []
    if (this.district != null)
    {
        layers.push(["subcounty", this.district])
        layers.push(["water_point", this.district])

    }

    if (this.subcounty != null)
    {
        layers.push(["parish", this.subcounty])
    }
    return layers;

}