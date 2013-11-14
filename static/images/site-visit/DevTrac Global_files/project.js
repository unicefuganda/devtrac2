DT.Project = function(properties) {
    this.id = properties['PROJECT_ID'];
    this.name = properties['PROJ_NAME'];
    this.partner = properties['PARTNER'];
    this.implementingPartner = properties['IMPLEMENTE'];
    this.financialOrganization = properties['FINANCIAL'];
    this.startPlanned = properties['START_PLAN'];
    this.endPlanned = properties['END_PLANNE'];
    this.startActual = properties['START_ACTU'];
    this.endActual = properties['END_ACTUAL'];
    this.description = properties['PROJ_DESC'];
    this.sector = properties['SECTOR'];
    this.status = properties['STATUS'];
    this.locations = [];
}

DT.Project.prototype.addLocation = function(properties) {
    this.locations.push(DT.Location.fromFeatureProperties(properties));
};