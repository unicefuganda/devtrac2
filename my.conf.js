// Karma configuration
// Generated on Mon Oct 07 2013 13:37:27 GMT+0300 (EAT)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'static/javascript/lib/angular.min.js',
      'static/javascript/lib/angular-mocks.js',
      'static/javascript/lib/angular-route.min.js',
      // 'static/javascript/lib/angular-scenario.js',
      'static/javascript/lib/jquery-2.0.3.min.js',
      // 'static/javascript/lib/**/*.js',
      // 'static/javascript/layer-options.js',
      // 'static/javascript/layer-map.js',
      // 'static/javascript/location.js',
      'static/javascript/dashboard.js',
      'static/javascript/services.js',
      'static/javascript/utilities.js',
      'static/javascript/location.js',
      'static/javascript/layer-map.js',


      'static/javascript/spec/servicesSpec.js',
      'static/javascript/spec/locationSpec.js',
      'static/javascript/spec/filterSpec.js',
      'static/javascript/spec/layerMapSpec.js',
      'static/javascript/spec/utilitiesSpec.js',
    ],


    // list of files to exclude
    exclude: [
      'static/javascript/application.js',
      'static/javascript/version.json',
      'static/javascript/map.js',
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
