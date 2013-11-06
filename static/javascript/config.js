if (typeof DT == "undefined") 
    DT = {};

DT.IndicatorConfig = function(config) { 
    this.config = config;
};

DT.NumberFormatter = function(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

DT.PercentageFormatter = function(value) {
    return (parseFloat(value) * 100).toFixed(0).toString() + "%"
};

DT.IndicatorConfig.district = [
    {key: "Pop_2011", label: "2011 Population", formatter: DT.NumberFormatter},
    {key: "DPT3_perc", label: "Children vaccinated against Diphtheria", formatter: DT.PercentageFormatter},
    {key: "Measles_Perc", label: "Children vaccinated against Measles", formatter: DT.PercentageFormatter},
    {key: "HF_Delivery_Perc", label: "Deliveries in Health Facilities", formatter: DT.PercentageFormatter},
    {key: "Pit_LatCov_Perc", label: "Pit latrine coverage percentage", formatter: DT.PercentageFormatter},
    {key: "Safe_Water_Cov_Perc", label: "Safe Water coverage percentage", formatter: DT.PercentageFormatter}
];

DT.IndicatorConfig.prototype.format = function(key, value) {

    var indicatorConfig = DT.first(this.config, function(config) { return config.key == key });
    if (indicatorConfig == null)
        return null;
    return [indicatorConfig.label, indicatorConfig.formatter(value)]
};

DT.AgregationConfig = {};

DT.AgregationConfig.labels = [
    { key: "health-center", label: "Health Centers", formatter: DT.NumberFormatter},
    { key: "school", label: "Schools", formatter: DT.NumberFormatter},
    { key: "water-point", label: "Water Points", formatter: DT.NumberFormatter},
    { key: "region", label: "Regions", formatter: DT.NumberFormatter},
    { key: "district", label: "Districts", formatter: DT.NumberFormatter},
    { key: "subcounty", label: "Subcounties", formatter: DT.NumberFormatter},
    { key: "parish", label: "Parishes", formatter: DT.NumberFormatter}
];

DT.piechart_colors = ["red", "blue", "yellow", "green", "lightblue", "orange", "salmon", "cyan", "magenta"];

DT.markerColors = [ 'red', 'blue', 'green', 'darkslateblue', 'darkslategray', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dodgerblue', 'firebrick', 'goldenrod', 'greenyellow', 'hotpink', 'indianred', 'indigo', 'khaki', 'lavender', 'lightblue', 'lightcoral', 'lightgoldenrodyellow', 'lightslategray', 'lightsteelblue', 'lightyellow', 'magenta', 'maroon', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise' ];
