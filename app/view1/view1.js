'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$http', function($scope, $http) {

	$scope.lowerValue = 0;
	$scope.upperValue = 19;
	$scope.hours = null; // saves a list of hours from the endpoint response 
						// -> one of the parameters for the future context?


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
	       stop: function() {updateAllGraphs();} // no need to use gridster events and its scope for resizing (yet)
	    },
	    draggable: {
	       enabled: true, // whether dragging items is supported
	    }
	};


	function requestHours() {
		$http.get('http://localhost:5000/hours')
			 .then(function(response) {
			 	$scope.hours = response.data;
 				updateAllGraphs();
			 });
	}


	$scope.$watch('[lowerValue, upperValue]', function () {
		if($scope.hours == null) {
			requestHours();
			//updateAllGraphs();
		} else {
			updateAllGraphs();
		}
	}, true); // If there was no true flag (false by default), the check would be for "reference" equality, 
				//which asks if the two objects refer to the same thing, instead of the value itself.
				//in this case they always refer the same, so we need to check the values.


	function updateAllGraphs() {
		createAreaGraph($scope.hours, $scope.lowerValue, $scope.upperValue, "box1");
		createAreaGraph($scope.hours, $scope.lowerValue, $scope.upperValue, "box2");
	}


	function createAreaGraph(list_of_hours, day_start, day_end, elementID) {

		$("#" + elementID + " > svg").remove();  // Remove the svg of the box element, in order to redraw and append the new svg

	    var margin = {top: 20, right: 20, bottom: 40, left: 50},
	        width = $("#" + elementID).width() - margin.left - margin.right,
	        height = $("#" + elementID).height() - margin.top - margin.bottom,
	        days = list_of_hours.initial_hours.length;

	    var x = d3.scale.linear()
	    .domain([day_start, day_end])
	    .range([0, width]);

	    var y = d3.scale.linear()
	    .domain([0, d3.max(list_of_hours.initial_hours)])
	    .range([height, 0]);

	    var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	    var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	    var area1 = d3.svg.area()
	    .x(function(d) { return x(d.day); })
	    .y0(height)
	    .y1(function(d) { return y(d.hour); });

	    var svg = d3.select("#" + elementID).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    var transformation = [];
	    list_of_hours.initial_hours.forEach(function(d,i){
	    	if(i>=day_start && i<=day_end) {
	        	transformation.push({day: i, hour: d})
	    	}
	    });

	    svg.append("path")
	    .datum(transformation)
	    .attr("class", "area1")
	    .attr("d", area1);

	    svg.append("g")
	    .attr("class", "x" + elementID + " axis")
	    //.attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

	    svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis);

	    $(".x" + elementID).attr("transform", "translate(0," + height + ")");

	    $(document).ready(function () {
	        $('svg path').tipsy({fallback: "Area chart representing the enter hours on a place during 19 days",
	                             gravity: 'w'});
	    });

	};

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