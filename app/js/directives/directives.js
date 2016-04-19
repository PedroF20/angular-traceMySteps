app.directive('hexbinGraph', function ($http, $rootScope) {

	var map = undefined;
	var center = [38.7, -9.1];


	return {
        restrict: 'E',
        scope: true,
        link: function($scope, $elem, $attr) {

	        	

				if (map != undefined) { map.remove(); }

				var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			    osm = L.tileLayer(osmUrl, {maxZoom: 18, attributionControl: false});

				angular.element($elem[0]).append(angular.element('<div id="map" style="width: 100%; height: calc(100% - 25px); border: 1px solid #ccc"></div>'));
				map = new L.Map('map', {layers: [osm], center: new L.LatLng(center[0], center[1]), zoom: 10});


				$attr.$observe('resize', function(newVal) {
					console.log('resize hexbin');
	                createHexbinGraph();
	                map.invalidateSize();
	                console.log($elem[0].parentNode.offsetHeight);
				});

	        	function createHexbinGraph () {

	        		// $elem[0] = null;
	        		//var map = undefined;

	    //     		if (map != undefined) { map.remove(); }

	    //     		var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
				 //    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				 //    osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});

					// map = new L.Map($elem[0], {layers: [osm], center: new L.LatLng(center[0], center[1]), zoom: 7});

					var options = {
						attributionControl: false,
					    radius : 12,
					    opacity: 0.5,
					    duration: 500,
					    lng: function(d){
					        return d[0];
					    },
					    lat: function(d){
					        return d[1];
					    },
					    value: function(d){
					        return d.length;
					    },
					    valueFloor: 0,
					    valueCeil: undefined
					};

					var hexLayer = L.hexbinLayer(options).addTo(map)
					hexLayer.colorScale().range(['white', 'blue']);

					var latFn = d3.random.normal(center[0], 1);
					var longFn = d3.random.normal(center[1], 1);

					var generateData = function(){
					    var data = [];
					    for(i=0; i<1000; i++){
					        data.push([longFn(),  latFn()]);
					    }
					    hexLayer.data(data);
					};
					map.invalidateSize();
					// $elem[0] = map;
					//map.remove();

					//if (map != undefined) { map.remove(); }
	        	}
    		}
    	}
});


app.directive('areaGradient', ['DataManagerService', function (DataManagerService, $rootScope) {

	var delay=350;

	var jsonRes=null;


	return {
        restrict: 'E',
        scope: true,
        link: function($scope, $elem, $attr) {

        	DataManagerService.get('/areagradient', []).then(function(d) {
				jsonRes=d;
				//console.log(list_of_hours);
				createAreaGradientGraph();
			});


			$attr.$observe('resize', function(newVal) {
						//console.log('resize');
		                createAreaGradientGraph();
			});

			function createAreaGradientGraph () {

				setTimeout(function() {

					$elem[0].svg = null;


				    var margin = {top: 20, right: 10, bottom: 220, left: 40},
	    				margin2 = {top: 500, right: 10, bottom: 60, left: 40},
				        width = ($elem[0].parentNode.clientWidth) - margin.left - margin.right,
				        height = ($elem[0].parentNode.clientHeight) - (margin.top) - (margin.bottom),
				        height2 = ($elem[0].parentNode.clientHeight) - (margin2.top) - (margin2.bottom);

				    // var margin = {top: 10, right: 10, bottom: 100, left: 40},
					   //  margin2 = {top: 430, right: 10, bottom: 20, left: 40},
					   //  width = 960 - margin.left - margin.right,
					   //  height = 500 - margin.top - margin.bottom,
					   //  height2 = 500 - margin2.top - margin2.bottom;

				    var parseDate = d3.time.format("%b %Y").parse;

				    var x = d3.time.scale().range([0, width]),
					    x2 = d3.time.scale().range([0, width]),
					    y = d3.scale.linear().range([height, 0]),
					    y2 = d3.scale.linear().range([height2, 0]);

					var xAxis = d3.svg.axis().scale(x).orient("bottom"),
					    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
					    yAxis = d3.svg.axis().scale(y).orient("left");

					var brush = d3.svg.brush()
					    .x(x2)
					    .on("brush", brushed);

					var area = d3.svg.area()
					    .interpolate("monotone")
					    .x(function(d) { return x(d.date); })
					    .y0(height)
					    .y1(function(d) { return y(d.price); });

					var area2 = d3.svg.area()
					    .interpolate("monotone")
					    .x(function(d) { return x2(d.date); })
					    .y0(height2)
					    .y1(function(d) { return y2(d.price); });

					d3.select($elem[0]).selectAll("svg").remove()

					var svg = d3.select($elem[0]).append("svg")
					    .attr("width", width + margin.left + margin.right)
					    .attr("height", height + margin.top + margin.bottom);

						svg.append("defs").append("clipPath")
						    .attr("id", "clip")
						  	.append("rect")
						    .attr("width", width)
						    .attr("height", height);

					var focus = svg.append("g")
					    .attr("class", "focus")
					    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")");

					var context = svg.append("g")
					    .attr("class", "context")
					    .attr("transform", "translate(" + margin2.left + "," + (margin2.top) + ")");

					var transformation = [];


					var transformation = jsonRes.date_price.map(el => (
					  { date: el.date, price: el.price }
					));


					transformation.forEach(function(d) {
					  d.date = parseDate(d.date);
					  d.price = +d.price;
					  return d;
					});

				
						  x.domain(d3.extent(transformation.map(function(d) { return d.date; })));
						  y.domain([0, d3.max(transformation.map(function(d) { return d.price; }))]);
						  x2.domain(x.domain());
						  y2.domain(y.domain());

						focus.append("path")
					      .datum(transformation)
					      .attr("class", "area")
					      .attr("d", area);

						  focus.append("g")
						      .attr("class", "x axis")
						      .attr("transform", "translate(0," + height + ")")
						      .call(xAxis);

						  focus.append("g")
						      .attr("class", "y axis")
						      .call(yAxis);

						  context.append("path")
						      .datum(transformation)
						      .attr("class", "area")
						      .attr("d", area2);

						  context.append("g")
						      .attr("class", "x axis")
						      .attr("transform", "translate(0," + height2 + ")")
						      .call(xAxis2);

						  context.append("g")
						      .attr("class", "x brush")
						      .call(brush)
						    .selectAll("rect")
						      .attr("y", -6)
						      .attr("height", height2 + 7);

					$elem[0].svg = svg;

					function brushed() {
					  x.domain(brush.empty() ? x2.domain() : brush.extent());
					  focus.select(".area").attr("d", area);
					  focus.select(".x.axis").call(xAxis);
					}


			    }, delay);

			}

		}
		
	};

}]);