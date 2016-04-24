'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {

	$scope.checked = false; // This will be binded using the ps-open attribute

    $scope.toggle = function(){
        $scope.checked = !$scope.checked;
    }

	
	$scope.widgets = [{type: 'area-g', name: "Time (mins) Spent On Foot", draggable: true, sizeX: 3, sizeY: 3, minSizeX: 2, minSizeY: 2}];
	// $scope.widgets = [ {type: 'area', ...}, {type: 'area', ...}, {type: 'arc', ...} ];

	// MEGA DIRECTIVE CAN BE COUNTER PRODUCTIVE, AS IT TAKES A BIG OPTIONS VARIABLE (CONTEXT)
	// AND EACH GRAPH MUST CONTROL WHAT THEY NEED
	// WE CAN END WITH AN OPTIONS CONTEXT CONTAINING DOZENS OF VARIABLES, WHICH CAN BE CONFUSING

	// MAYBE ADOPT A TYPED-PROGRAMMING APPROACH (EASIEST), WITH ONE DIRECTIVE PER GRAPH, AND THEN IN THE VIEW
	// LET THE TYPE ATTRIBUTE DECIDE WHICH GRAPH IS GOING TO BE DRAWN. THEN EACH GRAPH ONLY CONTROLS
	// ITS CONTEXT (AND THUS LESS VARIABLES, BECAUSE THEY ONLY OBSERVE WHAT IS IMPORTANT TO THEM)

	$scope.context = {
		lowerValue: 0,  //at the moment, the initial day and final day are hardcoded
		upperValue: 18, //this context has general data that every vis can fetch if they need
		resize: 0,		//the specific data for each vis is in the directive: "widget.xxxxxx"
		hourStart: 0,	//the interval of hours here is common sense. they can be hardcoded
		hourEnd: 2400,
	}

	$rootScope.selectedItem = false;

	$scope.gridsterOpts = {
	    columns: 6, // the width of the grid, in columns
	    margins: [10, 10], // the pixel distance between each widget
	    swapping: true,
	    rowHeight: 'match', // 180 if we want to adjust to the window
	    outerMargin: true, // whether margins apply to outer edges of the grid
	    minColumns: 1, // the minimum columns the grid must have
	    minRows: 3, // the minimum height of the grid, in rows
	    maxRows: 10,
	    maxSizeX: 5,
	    maxSizeY: 5,
	    resizable: {
	       enabled: true,
	       resize: function() {$scope.context.resize++},
	       stop: function() {$scope.context.resize++; console.log('stop');} // no need to use gridster events and its scope for resizing (yet)
	    },
	    draggable: {
	       enabled: true,
	       handle: '.box-header',  // means the boxes can only be dragged when clicking the box header
	    }
	};


	$scope.addAreaWidget = function() {
		$scope.widgets.push({type: 'area', name: "Area Chart", draggable: true, sizeX: 2, sizeY: 2});
		//we can later use the row and column attributes
    	//to put the new Items where we desire
    	//we can also add a mechanism to help identify individual boxes
    	//in order for them to be easily accessible
	}

	$scope.addHexbinWidget = function() {
		$scope.widgets.push({type: 'hexbin', name: "Hexbin Chart", draggable: true, sizeX: 2, sizeY: 2});
	};

	$scope.addGradientWidget = function() {
		$scope.widgets.push({type: 'area-g', name: "Time (mins) Spent On Foot", draggable: true, sizeX: 3, sizeY: 3, minSizeX: 2, minSizeY: 2});
	};

	$scope.addChordWidget = function() {
		$scope.widgets.push({type: 'chord', name: "Chord Chart", draggable: true, sizeX: 2, sizeY: 2});
	};

	$scope.addCalendarWidget = function() {
		$scope.widgets.push({type: 'calendar', name: "Calendar View: places bla bla", draggable: true, sizeX: 2, sizeY: 2});
	};

	$scope.clear = function() {
		$scope.widgets = [];
	};


	// $scope.$watch('[limits]', function () {
	// }, true); // If there was no true flag (false by default), the check would be for "reference" equality, 
	// 			//which asks if the two objects refer to the same thing, instead of the value itself.
	// 			//in this case they always refer the same, so we need to check the values.


}]);