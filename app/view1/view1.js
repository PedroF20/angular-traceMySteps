'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {

	/******* RIGHT PANEL FUNCTIONS *******/

	$scope.checked = false; // This will be binded using the ps-open attribute

    $scope.toggle = function(){
        $scope.checked = !$scope.checked;  
    }

    /*********************************************************************/



    /******* GRIDSTER AND CONTEXT OPTIONS/VARIABLES *******/

	$scope.context = {
		lowerValue: 0,  //at the moment, the initial day and final day are hardcoded
		upperValue: 18, //this context has general data that every vis can fetch if they need
		hourStart: 0,	//the specific data for each vis is in the directive: "widget.xxxxxx"
		hourEnd: 2400,	//the interval of hours here is common sense. they can be hardcoded
	}

	$scope.gridsterOpts = {
	    columns: 6, // the width of the grid, in columns 
	    // 7 columns if we want to adjust grid placeholder to the window and thus
	    // remove initial page scrolling
	    // may need to adjust graphs widths, heights and margins, though
	    margins: [10, 10], // the pixel distance between each widget
	    swapping: true,
	    rowHeight: 'match', // 120 if we want to adjust to the window
	    outerMargin: true, // whether margins apply to outer edges of the grid
	    minColumns: 1, // the minimum columns the grid must have
	    minRows: 3, // the minimum height of the grid, in rows
	    maxRows: 100,
	    maxSizeX: 6,
	    maxSizeY: 5,
	    resizable: {
	       enabled: true,
	       resize: function() {},
	       stop: function() {console.log('stop');} // no need to use gridster events and its scope for resizing (yet)
	    },
	    draggable: {
	       enabled: true,
	       handle: '.box-header',  // means the boxes can only be dragged when clicking the box header
	    }
	};

	/*********************************************************************/



	/******* WIDGET INITIALIZATION AND FUNCTIONS *******/

	$scope.widgets = [];

	// MEGA DIRECTIVE CAN BE COUNTER PRODUCTIVE, AS IT TAKES A BIG OPTIONS VARIABLE (CONTEXT)
	// AND EACH GRAPH MUST CONTROL WHAT THEY NEED
	// WE CAN END WITH AN OPTIONS CONTEXT CONTAINING DOZENS OF VARIABLES, WHICH CAN BE CONFUSING

	// MAYBE ADOPT A TYPED-PROGRAMMING APPROACH (EASIEST), WITH ONE DIRECTIVE PER GRAPH, AND THEN IN THE VIEW
	// LET THE TYPE ATTRIBUTE DECIDE WHICH GRAPH IS GOING TO BE DRAWN. THEN EACH GRAPH ONLY CONTROLS
	// ITS CONTEXT (AND THUS LESS VARIABLES, BECAUSE THEY ONLY OBSERVE WHAT IS IMPORTANT TO THEM)
	

	$scope.addHexbinWidget = function() {
		$scope.widgets.push({type: 'hexbin', name: "Hexbin Places Chart", draggable: true, sizeX: 2, sizeY: 2});
	};

	$scope.addHexbinTracksWidget = function() {
		$scope.widgets.push({type: 'hexbintracks', name: "Hexbin Tracks Chart", draggable: true, sizeX: 2, sizeY: 2});
	};

	$scope.addGradientWidget = function() {
		$scope.widgets.push({type: 'areagradient', name: "Time (mins) Spent Moving", draggable: true, sizeX: 3, sizeY: 3, minSizeX: 2, minSizeY: 2});
	};

	$scope.addChordWidget = function() {
		$scope.widgets.push({type: 'chord', name: "Travels to or from a place", draggable: true, sizeX: 2, sizeY: 2});
	};

	$scope.addCalendarWidget = function() {
		$scope.widgets.push({type: 'calendar', name: "Calendar: Frequency of places visited", draggable: true, sizeX: 5, sizeY: 1, minSizeX:5,
	 	maxSizeY:2, maxSizeX:5});
	};

	$scope.addTracksWidget = function() {
		$scope.widgets.push({type: 'tracks', name: "My Tracks", draggable: true, sizeX: 2, sizeY: 2});
	};

	$scope.addBarChartWidget = function() {
		$scope.widgets.push({type: 'bar', name: "My Places", draggable: true, sizeX: 1, sizeY: 3, maxSizeY:3, maxSizeX:1});
	};

	$scope.addStaysGraphWidget = function() {
		$scope.widgets.push({type: 'stays', name: "My Stays", draggable: true, sizeX: 4, sizeY: 2, maxSizeY:2, maxSizeX:5, minSizeY:2, minSizeX:4});
	};

	$scope.addArcDiagramWidget = function() {
		$scope.widgets.push({type: 'arc', name: "My Trips", draggable: true, sizeX: 5, sizeY: 2, maxSizeY:2, maxSizeX:6, minSizeY:2, minSizeX:3});
	};

	$scope.clear = function() {
		$scope.widgets = [];
	};

	/*********************************************************************/



	/******* ROOTSCOPE VARIABLES AND TRIGGERS FOR DIRECTIVES *******/

	//$rootScope.selectedItem = false;
	$scope.frequency = true;
	$scope.timespent = false;

	$scope.frequencyDataset = function() {
		if($scope.frequency==true) {return;}
		if($scope.frequency==false && $scope.timespent==true) {
			$scope.frequency=true;
			$scope.timespent=false;
		}
	}

	$scope.timespentDataset = function() {
		if($scope.timespent==true) {return;}
		if($scope.timespent==false && $scope.frequency==true) {
			$scope.timespent=true;
			$scope.frequency=false;
		}
    }


	/*********************************************************************/


	// $scope.$watch('[limits]', function () {
	// }, true); // If there was no true flag (false by default), the check would be for "reference" equality, 
	// which asks if the two objects refer to the same thing, instead of the value itself. in this case they
	// always refer the same, so we need to check the values.

}]);