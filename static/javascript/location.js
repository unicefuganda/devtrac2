DT.Location = function(location_hash) {
    this.district = location_hash.district ? location_hash.district : null  ;
    this.subcounty = location_hash.subcounty ? location_hash.subcounty : null;
    this.parish = location_hash.parish ? location_hash.parish : null;

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
        var districtLocation = new DT.Location({district: this.district});
        layers.push(["subcounty", districtLocation])
        layers.push(["water_point", districtLocation])

    }

    if (this.subcounty != null)
    {
        var subcountyLocation = new DT.Location({district: this.district, subcounty: this.subcounty});
        layers.push(["parish", subcountyLocation])
    }
    return layers;

}