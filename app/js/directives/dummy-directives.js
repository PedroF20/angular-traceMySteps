
app.directive('areaGraph', ['DataManagerService', '$rootScope', function (DataManagerService, $rootScope) {

	var delay=350;

	var list_of_hours=null;


	function sortNumber(a,b) {
    	return a - b;
	}


	return {
        restrict: 'E',
        scope: true,
        link: function($scope, $elem, $attr) {
            
            
			DataManagerService.get('/hours', []).then(function(d) {
				list_of_hours=d;
				//console.log(list_of_hours);
				createAreaGraph();
			});


            list_of_hours = $scope.$eval($attr.listOfHours);
            

            var day_start = $scope.$eval($attr.dayStart),
                day_end = $scope.$eval($attr.dayEnd),
                hour_start = $scope.$eval($attr.hourStart),
            	hour_end = $scope.$eval($attr.hourEnd);


            //createAreaGraph();

			$attr.$observe('dayStart', function(newVal) {
				//console.log('lowerValue changed to: ' + newVal);
				if(newVal === day_start) return;
                day_start = newVal;
                createAreaGraph();
			});

			$attr.$observe('dayEnd', function(newVal) {
				//console.log('upperValue changed to: ' + newVal);
				if(newVal === day_end) return;
                day_end = newVal;
                createAreaGraph();
			});

			// ALTHOUGH THIS IS NOT AN "INDIVIDUAL" FILTER (IF WE HAVE MORE THAN ONE COPY OF THE GRAPH
			//	THE FILTER OF EACH ITEM CHANGES ALL OF THE AREA GRAPHS), THE USER WILL NEVER HAVE MORE
			//	THAN ONE COPY OF EACH GRAPH IN THE DASHBOARD, MAKING IT AN IRRELEVANT BUG

			$attr.$observe('hourStart', function(newVal) {
				//console.log('hourStart changed to: ' + newVal);
				if(newVal === hour_start) return;
                hour_start = newVal;
                createAreaGraph();
			});

			$attr.$observe('hourEnd', function(newVal) {
				//console.log('hourEnd changed to: ' + newVal);
				if(newVal === hour_end) return;
                hour_end = newVal;
                createAreaGraph();
			});

			$attr.$observe('resize', function(newVal) {
				//console.log('resize');
                createAreaGraph();
			});


			$rootScope.$on('rootScope:broadcast', function (event, data) {
			 		console.log("Area broadcast: " + JSON.stringify(data)); // 'Broadcast!'
			 		createHighlightAreaGraph(data.start,data.end);
			});

			$rootScope.$on('rootScope:broadcast-leave', function (event, data) {
			 		console.log("Area broadcast leave: " + data); // 'Broadcast!'
			 		createAreaGraph();
			});


            function createAreaGraph () {
            	
            	//console.log($elem);
                //d3.selectAll($elem.toArray());

				//$("#" + elementID + " > svg").remove();  // Remove the svg of the box element, in order to redraw and append the new svg
				//d3.select("svg").remove();

				setTimeout(function() { 

					$elem[0].svg = null;


				    var margin = {top: 20, right: 20, bottom: 80, left: 50},
				        width = $elem[0].parentNode.clientWidth - margin.left - margin.right,
				        height = $elem[0].parentNode.clientHeight - margin.top - margin.bottom,
				        days = list_of_hours.initial_hours.length;

					// console.log($elem[0].parentNode.clientWidth);
					// console.log($elem[0].parentNode.clientHeight);

				    var x = d3.scale.linear()
				    .domain([day_start, day_end])
				    .range([0, width]);

				    var y = d3.scale.linear()
				    .domain([hour_start, hour_end])
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
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

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
				    .attr("d", area1)
				    // .on("mouseover", function(){
				    // 	//console.log(d3.mouse(this));
				    // 	console.log($rootScope.selectedItem);
				    // });

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


            function createHighlightAreaGraph (min, max) {
            	
            	//console.log($elem);
                //d3.selectAll($elem.toArray());

				//$("#" + elementID + " > svg").remove();  // Remove the svg of the box element, in order to redraw and append the new svg
				//d3.select("svg").remove();


					$elem[0].svg = null;


				    var margin = {top: 20, right: 20, bottom: 80, left: 50},
				        width = $elem[0].parentNode.clientWidth - margin.left - margin.right,
				        height = $elem[0].parentNode.clientHeight - margin.top - margin.bottom,
				        days = list_of_hours.initial_hours.length;

					// console.log($elem[0].parentNode.clientWidth);
					// console.log($elem[0].parentNode.clientHeight);

				    var x = d3.scale.linear()
				    .domain([day_start, day_end])
				    .range([0, width]);

				    var y = d3.scale.linear()
				    .domain([hour_start, hour_end])
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
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

				  	//svg.selectAll('*').remove();

				    var transformation = [];
				    var selectedTransformation = [];
				    list_of_hours.initial_hours.forEach(function(d,i){
				    	if(i>=day_start && i<=day_end) {
				    		if(i<min || i > max) {
					        	transformation.push({day: i, hour: d});
					        } else {
					        	transformation.push({day: i, hour: 0});
					        	selectedTransformation.push({day: i, hour: d});
					        }
				    	}
				    });

				    svg.append("path")
				    .datum(transformation)
				    .attr("class", "area1")
				    .attr("d", area1)
				    // .on("mouseover", function(){
				    // 	//console.log(d3.mouse(this));
				    // 	//console.log($rootScope.selectedItem);
				    // })
				    .datum(selectedTransformation)
				    .attr("d", area1)
				    .classed("selectedArea", true);

				    svg.append("g")
				    .attr("class", "x axis")
				    .attr("transform", "translate(0," + height + ")") 
				    .call(xAxis);

				    svg.append("g")
				    .attr("class", "y axis")
				    .call(yAxis);

				    $elem[0].svg = svg;
            }
        }
    };
}]);

app.directive('chordGraph', function ($http, $rootScope) {

	var delay=350;

	var matrix = [
	  [11975,  5871, 8916, 2868],
	  [ 1951, 10048, 2060, 6171],
	  [ 8010, 16145, 8090, 8045],
	  [ 1013,   990,  940, 6907]
	];

	return {
        restrict: 'E',
        scope: true,
        link: function($scope, $elem, $attr) {

        	$attr.$observe('resize', function(newVal) {
				console.log('resize');
                createChordGraph();
			});

        	function createChordGraph () {

        		setTimeout(function() { 

        			$elem[0].svg = null;

	        		var chord = d3.layout.chord()
				    .padding(.05)
				    .sortSubgroups(d3.descending)
				    .matrix(matrix);

				    var margin = {top: 20, right: 10, bottom: 20, left: 10},
				        width = $elem[0].parentNode.clientWidth - margin.left - margin.right,
				        height = $elem[0].parentNode.clientHeight - margin.top - margin.bottom,
					    innerRadius = Math.min(width, height) * .41,
					    outerRadius = innerRadius * 1.1;

					var fill = d3.scale.ordinal()
					    .domain(d3.range(4))
					    .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

					d3.select($elem[0]).selectAll("svg").remove()
					var svg = d3.select($elem[0]).append("svg")
					    .attr("width", width + margin.left + margin.right)
					    .attr("height", height + margin.top + margin.bottom)
					  	.append("g")
					    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

					svg.append("g").selectAll("path")
					    .data(chord.groups)
					  .enter().append("path")
					    .style("fill", function(d) { return fill(d.index); })
					    .style("stroke", function(d) { return fill(d.index); })
					    .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
					    .on("mouseover", fade(.1))
					    .on("mouseout", fade1(1));

					var ticks = svg.append("g").selectAll("g")
					    .data(chord.groups)
					  .enter().append("g").selectAll("g")
					    .data(groupTicks)
					  .enter().append("g")
					    .attr("transform", function(d) {
					      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
					          + "translate(" + outerRadius + ",0)";
					    });

					ticks.append("line")
					    .attr("x1", 1)
					    .attr("y1", 0)
					    .attr("x2", 5)
					    .attr("y2", 0)
					    .style("stroke", "#000");

					ticks.append("text")
					    .attr("x", 8)
					    .attr("dy", ".35em")
					    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
					    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
					    .text(function(d) { return d.label; });

					svg.append("g")
					    .attr("class", "chord")
					  .selectAll("path")
					    .data(chord.chords)
					  .enter().append("path")
					    .attr("d", d3.svg.chord().radius(innerRadius))
					    .style("fill", function(d) { return fill(d.target.index); })
					    .style("opacity", 1);

					$elem[0].svg = svg;


					// Returns an array of tick angles and labels, given a group.
					function groupTicks(d) {
					  var k = (d.endAngle - d.startAngle) / d.value;
					  return d3.range(0, d.value, 1000).map(function(v, i) {
					    return {
					      angle: v * k + d.startAngle,
					      label: i % 5 ? null : v / 1000 + "k"
					    };
					  });
					}

					// Returns an event handler for fading a given chord group.
					function fade(opacity) {
					  return function(g, i) {
					    svg.selectAll(".chord path")
					        .filter(function(d) { return d.source.index != i && d.target.index != i; })
					      .transition()
					        .style("opacity", opacity);
					        $rootScope.selectedItem=true;

					        $rootScope.$broadcast('rootScope:broadcast', { start : 4, end : 8});

					  };
					}

					function fade1(opacity) {
					  return function(g, i) {
					    svg.selectAll(".chord path")
					        .filter(function(d) { return d.source.index != i && d.target.index != i; })
					      .transition()
					        .style("opacity", opacity);
					        $rootScope.selectedItem=false;
					        $rootScope.$broadcast('rootScope:broadcast-leave', 'json vazio');
					  };
					}

				}, delay);

        	}

   		}

   	};

});
