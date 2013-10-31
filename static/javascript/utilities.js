if (typeof DT == "undefined") 
    DT = {};


DT.JSONPCallbacks = {};

DT.lpad = function(str, padString, length) {
    while (str.length < length)
        str = padString + str;
    return str;
}

DT.any = function(list, func) {
    return DT.first(list, func) != null;
};

DT.first = function(list, func) {
    for (var i = 0; i < list.length; i++) {
        if (func(list[i]))
            return list[i];
    };
    return null;
};

DT.unique = function (list) {
    var array = []
    for(var i in list) {

        var firstItem = DT.first(array, function (e) {
            return angular.equals(e, list[i]);
        });

        if (firstItem == null) {
            array.push(list[i]);
        }
    }
    return array;
}; 

DT.capitalize = function(string) {
    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

DT.encode = function(name) {
    return name.replace('/','_');
};

DT.decode = function(name) {
    return name.replace('_','/');
};

DT.timings = {}; 
DT.timings.printPeriod = function(date1_ms, date2_ms){
  var difference_ms = date2_ms - date1_ms;
  if (isNaN(difference_ms) || difference_ms < 0)
    return "  -  ";
  return DT.lpad(difference_ms.toString()," ", 5);
};

DT.timings.print = function() {
    var labels = [
        ["Zoom Start:", "zoomstart"],
        ["Zoom End:", "zoomend"],
        ["Move Start:", "movestart"],
        ["Move End:", "moveend"],
        ["Url:", "urlchange"],
        ["Unselect:", "unselectend"],

    ];
    var output = "";
    $.each(labels, function(index, element) {
        output += element[0] + DT.timings.printPeriod(DT.timings["click"], DT.timings[element[1]]) + " ";
    });
    console.log(output);
};

DT.feature_toggles = function(queryString) {
    return {
        is_on: function(toggle) {
            if (queryString.match("feature_" + toggle + "=true"))
                return true;
            else 
                return false;
        }
    }
} 