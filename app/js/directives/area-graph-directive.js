angular.module('myApp',['ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'angularRangeSlider',
  'gridster'])
.directive('areaGraph', function ($http) {

	var delay=350;

	var list_of_hours=null;

	function requestHours() {
		return $http.get('http://localhost:5000/hours');
		
		// $http.get('http://localhost:5000/hours')
		// 	 .then(function(response) {
		// 	 	list_of_hours = response.data;
		// 	 	console.log(list_of_hours);
 	// 			//createAreaGraph();
		// 	 });
		
		// FICHEIRO A PARTE COM DATA BROKER QUE FICA APENAS RESPONSAVEL PELOS 
		// PEDIDOS (GET, VERIFICAR SE JA TEM, CACHE, ETC.)

	}


	return {
        restrict: 'E',
        scope: true,
        link: function($scope, $elem, $attr) {
            
            if($scope.list_of_hours == null) {
            	requestHours().then(function(response) {
				 	list_of_hours = response.data;
				 	console.log("get response");
				 	console.log(list_of_hours);
	 				createAreaGraph();
				 });
            } 

            list_of_hours = $scope.$eval($attr.listOfHours);

            var day_start = $scope.$eval($attr.dayStart),
                day_end = $scope.$eval($attr.dayEnd);

            //createAreaGraph();
            /*
            console.log($attr);
            $scope.$watch($attr.listOfHours, function (newval, oldval) {
                if(newval === oldval) return;
                list_of_hours = newval;
                createAreaGraph();
            });
            $scope.$watch($attr.dayStart, function (newval, oldval) {
            	console.log("day start updated");
                if(newval === oldval) return;
                day_start = newval;
                createAreaGraph();
            });
            $scope.$watch('dayStart', function (newval, oldval) {
            	console.log("day start updated");
                if(newval === oldval) return;
                day_start = newval;
                createAreaGraph();
            });

            $scope.$watch($attr.dayEnd, function (newval, oldval) {
                if(newval === oldval) return;
                day_end = newval;
                createAreaGraph();
            });
			*/

			$attr.$observe('dayStart', function(newVal) {
				console.log('lowerValue changed to: ' + newVal);
				if(newVal === day_start) return;
                day_start = newVal;
                createAreaGraph();
			});

			$attr.$observe('dayEnd', function(newVal) {
				console.log('upperValue changed to: ' + newVal);
				if(newVal === day_end) return;
                day_end = newVal;
                createAreaGraph();
			});

			$attr.$observe('resize', function(newVal) {
				console.log('resize');
                createAreaGraph();
			});

            function createAreaGraph () {
            	
            	console.log($elem);
                //d3.selectAll($elem.toArray());

				//$("#" + elementID + " > svg").remove();  // Remove the svg of the box element, in order to redraw and append the new svg
				//d3.select("svg").remove();

				setTimeout(function() { 

					$elem[0].svg = null;

				    var margin = {top: 20, right: 20, bottom: 50, left: 50},
				        width = $elem[0].parentNode.clientWidth - margin.left - margin.right,
				        height = $elem[0].parentNode.clientHeight - margin.top - margin.bottom,
				        days = list_of_hours.initial_hours.length;

					console.log($elem[0].parentNode.clientWidth);
					console.log($elem[0].parentNode.clientHeight);

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

					d3.select($elem[0]).selectAll("svg").remove()
				    var svg = d3.select($elem[0]).append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				    .append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				  	//svg.selectAll('*').remove();

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
				    .attr("class", "x axis")
				    .attr("transform", "translate(0," + height + ")") 
				    .call(xAxis);

				    svg.append("g")
				    .attr("class", "y axis")
				    .call(yAxis);

				    $elem[0].svg = svg;

			    }, delay);
            }
        }
    };
});