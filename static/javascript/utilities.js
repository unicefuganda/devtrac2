if (typeof DT == "undefined") 
    DT = {};

DT.test = "test";

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

DT.values = function (obj) {
    var vals = [];
    for( var key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
            vals.push(obj[key]);
        }
    }
    return vals;
}

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
    return name.replace(/\//g,'_');
};

DT.decode = function(name) {
    return name.replace(/_/g,'/');
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
        ["Url:", "urlchange"],
        ["Map Location Change:", "maplocationchange"],
        ["Got Data:", "getdata"],
        ["Rendered Data:", "rendereddata"],
        ["Zoom end:", "zoomend"],

    ];
    var output = "";
    $.each(labels, function(index, element) {

        output += element[0] + DT.timings.printPeriod(DT.timings["urlchange"], DT.timings[element[1]]) + " ";
    });
    console.log(output);
};

DT.feature_toggles = function(queryString) {
    return {
        is_on: function(toggle) {
            return queryString.match("feature_" + toggle + "=true")
        }
    }
}

DT.splitIntoChuncks = function(array, chunckLength){
    
    if(array.length <= chunckLength)
        return [array];

    return  spliceIntoChunks(array, chunckLength);   
}

var spliceIntoChunks = function(array,chunckLength){
    var newArray = [];
    for(var i = 0; i < array.length; i+=chunckLength){
        newArray.push(array.slice(i,i+chunckLength))
    }
    return newArray;
};