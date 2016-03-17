'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$http', function($scope, $http) {

	
	$scope.widgets = [];
	// $scope.widgets = [ {type: 'area', ...}, {type: 'area', ...}, {type: 'arc', ...} ];


	$scope.limits = {
		lowerValue : 0,
		upperValue : 18,
		resize: 0,
	}

	$scope.gridsterOpts = {
	    columns: 6, // the width of the grid, in columns
	    margins: [10, 10], // the pixel distance between each widget
	    swapping: true,
	    outerMargin: true, // whether margins apply to outer edges of the grid
	    minColumns: 1, // the minimum columns the grid must have
	    minRows: 3, // the minimum height of the grid, in rows
	    maxRows: 10,
	    maxSizeX: 6,
	    //maxSizeY: 5,
	    resizable: {
	       enabled: true,
	       resize: function() {$scope.limits.resize++},
	       stop: function() {$scope.limits.resize++; console.log('stop');} // no need to use gridster events and its scope for resizing (yet)
	    },
	    draggable: {
	       enabled: true, // whether dragging items is supported
	    }
	};


	$scope.addWidget = function() {
		$scope.widgets.push({sizeX: 2, sizeY: 2});
		//we can later use the row and column attributes
    	//to put the new Items where we desire
    	//we can also add a mechanism to help identify individual boxes
    	//in order for them to be easily accessible
	}

	$scope.clear = function() {
		$scope.widgets = [];
	};


	// $scope.$watch('[limits]', function () {
	// 	//console.log("lower: " + $scope.limits.lowerValue);
	// 	//console.log("upper: " + $scope.limits.upperValue);
	// }, true); // If there was no true flag (false by default), the check would be for "reference" equality, 
	// 			//which asks if the two objects refer to the same thing, instead of the value itself.
	// 			//in this case they always refer the same, so we need to check the values.



	/////////// RIGHT PANEL /////////////////

	var panelslider = null;
	$(document).ready(function () {

		$('#right-panel-link').panelslider({
		      bodyClass: 'ps-active-right',
		      clickClose: true,
		      onOpen: function() {
		        //console.log('right panel open');
		      }
		    });
	});

}]);