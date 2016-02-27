'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {

	$scope.lowerValue = 0;
	$scope.upperValue = 19;

	$scope.$watch('[lowerValue, upperValue]', function () {
		updateAllGraphs();
	}, true);

	function updateAllGraphs() {
		createGraph("http://localhost:5000/hours", $scope.lowerValue, $scope.upperValue	, "box1");
		createGraph("http://localhost:5000/hours", $scope.lowerValue, $scope.upperValue	, "box2");
	}

	// var gridster = $(".gridster > ul").gridster({
 //        widget_base_dimensions: ['auto', 140],
 //        autogenerate_stylesheet: true,
 //        min_cols: 1,
 //        max_cols: 6,
 //        widget_margins: [5, 5],
 //        resize: {
 //            enabled: true,
 //            stop: function() {
 //            	updateAllGraphs();
 //            }
 //        }
 //    }).data('gridster');
	

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

    // $('.gridster  ul').css({'width': $(window).width()});


	function createGraph(url, day_start, day_end, elementID) {

		//$("#" + elementID).html('');
		$("#" + elementID + " > svg").remove();  // Remove the svg of the box element, in order to redraw and append the new svg

	  d3.json(url, function (data) {


	    var margin = {top: 20, right: 20, bottom: 40, left: 50},
	        width = $("#" + elementID).width() - margin.left - margin.right,
	        height = $("#" + elementID).height() - margin.top - margin.bottom,
	        days = data.initial_hours.length;

	    var x = d3.scale.linear()
	    .domain([day_start, day_end])
	    .range([0, width]);

	    var y = d3.scale.linear()
	    .domain([0, d3.max(data.initial_hours)])
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
	    data.initial_hours.forEach(function(d,i){
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

	  }

	)};

// 	$scope.addWidget = function() {
// 		console.log("add1");
// //		var gridster = $(".gridster ul").gridster().data('gridster');
// 				console.log(gridster);

// 		gridster.add_widget.apply(gridster, ['<li>new</li>', 2, 1]);
//     	console.log("add");

// 	}

	var panelslider = null;
	$(document).ready(function () {

		$('#right-panel-link').panelslider({
		      bodyClass: 'ps-active-right',
		      clickClose: true,
		      onOpen: function() {
		        console.log('right panel open');
		      }
		    });
	});


	



}]);