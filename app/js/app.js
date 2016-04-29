'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'angularRangeSlider',
  'gridster',
  'pageslide-directive'
]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

app.run(function ($rootScope) {
    $rootScope.$watches = function( watches, callback ) {
      var scope = this,
          isChanged = false;

      var scheduleCallback = function( newVal, oldVal ) {
        if( !isChanged ) {
          isChanged = true;
          scope.$evalAsync( doCallback );
        }
      };

      var doCallback = function( scope ) {
        var watchValues = _.map( watches, function( watch ) {
          return scope.$eval( watch );
        } );
        callback.apply( scope, watchValues );
        isChanged = false;
      };

      // setup all watches
      angular.forEach( watches, function( watch ) {
        scope.$watch( watch, scheduleCallback );
      });
    };
});