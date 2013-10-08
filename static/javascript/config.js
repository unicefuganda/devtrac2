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

