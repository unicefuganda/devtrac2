angular.module("dashboard").filter('percent', function() {
  return function(value) {
    return (parseFloat(value) * 100).toFixed(0).toString() + "%"
  };
});