DT.Project = function(feature) {
    this.id = feature['PROJECT_ID'];
    this.name = feature['PROJ_NAME'];
    this.partner = feature['PARTNER'];
    this.implementingPartner = feature['IMPLEMENTE'];
    this.financialOrganization = feature['FINANCIAL'];
    this.startPlanned = feature['START_PLAN'];
    this.endPlanned = feature['END_PLANNE'];
    this.startActual = feature['START_ACTU'];
    this.endActual = feature['END_ACTUAL'];
    this.description = feature['PROJ_DESC'];
    this.sector = feature['SECTOR'];
    this.status = feature['STATUS'];
}