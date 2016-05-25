app.directive('hexbinGraph', ['DataManagerService', '$rootScope', function (DataManagerService, $rootScope) {

	var maps = [];

	var map = undefined;
	var center = [38.7, -9.1];
	var latFn = d3.random.normal(center[0], 0.5);
	var longFn = d3.random.normal(center[1], 0.5);
	var data = [];
	var mapCount=0;

	function generateData(){
	    for(i=0; i<1000; i++){
	        data.push([longFn(),  latFn()]);
	    }
	};

	generateData();

	return {
        restrict: 'E',
        scope: true,
        link: function($scope, $elem, $attr) {


				var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			    osm = L.tileLayer(osmUrl, {maxZoom: 18, attributionControl: false});

				angular.element($elem[0]).append(angular.element('<div id="map'+ mapCount +'" style="width: 100%; height: calc(100% - 25px); border: 1px solid #ccc"></div>'));
				console.log('map'+ mapCount +'');
				maps[mapCount] = new L.Map('map'+ mapCount +'', {center: new L.LatLng(center[0], center[1]), zoom: 10});
				var layer1 = osm.addTo(maps[mapCount]);
				

        $scope.$watch(function () {
          return $elem[0].parentNode.clientWidth;
        }, function ( w ) {
          if ( !w ) { return; }
          for(var i = 0; i < mapCount; i++) {
            maps[i].invalidateSize();
          }
        });

        $scope.$watch(function () {
          return $elem[0].parentNode.clientHeight;
        }, function ( h ) {
          if ( !h ) { return; }
          for(var i = 0; i < mapCount; i++) {
            maps[i].invalidateSize();
          }
        });

        var rootScopeBroadcast = $rootScope.$on('rootScope:broadcast', function (event, data) {
              console.log("Hexbin broadcast: " + JSON.stringify(data.hexbin_info)); // 'Broadcast!'
              var zoom = 15;
              for(var i = 0; i < mapCount; i++) {
                maps[i].setView([38.73659, -9.14090], zoom);
              }
        });

        var rootScopeBroadcastLeave = $rootScope.$on('rootScope:broadcast-leave', function (event, data) {
          console.log("Hexbin broadcast leave"); // 'Broadcast!'
          var zoom = 10;
          for(var i = 0; i < mapCount; i++) {
            maps[i].setView([center[0], center[1]], zoom);
          }
        });

        $scope.$on('$destroy', function() {
            rootScopeBroadcast();
            rootScopeBroadcastLeave();
        })
	        	
        function createHexbinGraph () {

  					var options = {
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
  					    valueCeil: undefined,
                onmouseover: function(d, node, layer) {
                  //console.log(d);
                }
  					};

  					var hexLayer = L.hexbinLayer(options).addTo(maps[mapCount])
  					hexLayer.colorScale().range(['white', 'blue']);

  					hexLayer.data(data);
  					maps[mapCount].invalidateSize();

	       }
	        	createHexbinGraph();
	        	mapCount++;


    		}
    	}
}]);


app.directive('areaGradient', ['DataManagerService', '$rootScope', function (DataManagerService, $rootScope) {

	var delay=350;

	var jsonRes=null;


	return {
        restrict: 'E',
        scope: true,
        link: function($scope, $elem, $attr) {

      DataManagerService.get('/areagradient', []).then(function(d) {
				jsonRes=d;
				createAreaGradientGraph();
			});

      $scope.$watch(function () {
          return $elem[0].parentNode.clientWidth;
        }, function ( w ) {
          if ( !w ) { return; }
          createAreaGradientGraph();
        });

      $scope.$watch(function () {
          return $elem[0].parentNode.clientHeight;
        }, function ( h ) {
          if ( !h ) { return; }
          createAreaGradientGraph();
        });

      var rootScopeBroadcast = $rootScope.$on('rootScope:broadcast', function (event, data) {
        console.log("Area gradient broadcast: " + JSON.stringify(data.area_gradient)); // 'Broadcast!'
        createAreaGradientHighlightGraph();
      });

      var rootScopeBroadcastLeave = $rootScope.$on('rootScope:broadcast-leave', function (event, data) {
        console.log("Area gradient broadcast leave"); // 'Broadcast!'
        createAreaGradientGraph();
      });

      $scope.$on('$destroy', function() {
          rootScopeBroadcast();
          rootScopeBroadcastLeave();
      })

			function createAreaGradientGraph () {

				setTimeout(function() {

					$elem[0].svg = null;
					
					var parentHeigtht = angular.element($elem[0])[0].parentNode.clientHeight;
					
				    var margin = {top: 20, right: 10, bottom: 220, left: 40},
	    				  margin2 = {top: parentHeigtht-150, right: 10, bottom: 60, left: 40},
				        width = ($elem[0].parentNode.clientWidth) - margin.left - margin.right,
				        height = ($elem[0].parentNode.clientHeight) - (margin.top) - (margin.bottom),
				        height2 = ($elem[0].parentNode.clientHeight) - (margin2.top) - (margin2.bottom);

				    var parseDate = d3.time.format("%b %Y").parse;

				    var x = d3.time.scale().range([0, width]),
					    x2 = d3.time.scale().range([0, width]), // tamanho da escala mantem, qualquer q seja a qtd de info
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
					    .attr("height", height + margin.top + margin.bottom)

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

				    // create brush to also zoom in with + detail on the main graph

					$elem[0].svg = svg;

					function brushed() {
					  x.domain(brush.empty() ? x2.domain() : brush.extent());
					  focus.select(".area").attr("d", area);
					  focus.select(".x.axis").call(xAxis);
					}

			    }, delay);
			}


      function createAreaGradientHighlightGraph () {

          $elem[0].svg = null;
          
          var parentHeigtht = angular.element($elem[0])[0].parentNode.clientHeight;
          
            var margin = {top: 20, right: 10, bottom: 220, left: 40},
                margin2 = {top: parentHeigtht-150, right: 10, bottom: 60, left: 40},
                width = ($elem[0].parentNode.clientWidth) - margin.left - margin.right,
                height = ($elem[0].parentNode.clientHeight) - (margin.top) - (margin.bottom),
                height2 = ($elem[0].parentNode.clientHeight) - (margin2.top) - (margin2.bottom);

            var parseDate = d3.time.format("%b %Y").parse;

            var x = d3.time.scale().range([0, width]),
              x2 = d3.time.scale().range([0, width]), // tamanho da escala mantem, qualquer q seja a qtd de info
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
              .attr("height", height + margin.top + margin.bottom)

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

          var selectedTransformation = [];

          var selectedTransformation = jsonRes.date_price.map(el => (
            { date: el.date, price: el.price }
          ));

          selectedTransformation = selectedTransformation.slice(120,122); /* hardcoded to slice the data 
          and focus to a certain day supposedly associated with the track selected */
          
          selectedTransformation.forEach(function(d) {
            d.date = parseDate(d.date);
            d.price = +d.price;
            return d;
          });

            x.domain(d3.extent(selectedTransformation.map(function(d) { return d.date; })));
            y.domain([0, d3.max(selectedTransformation.map(function(d) { return d.price; }))]);
            x2.domain(x.domain());
            y2.domain(y.domain());

          focus.append("path")
              .datum(selectedTransformation)
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
              .datum(selectedTransformation)
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

            // create brush to also zoom in with + detail on the main graph

          $elem[0].svg = svg;

          function brushed() {
            x.domain(brush.empty() ? x2.domain() : brush.extent());
            focus.select(".area").attr("d", area);
            focus.select(".x.axis").call(xAxis);
          }
      }

		}
		
	};

}]);




app.directive('gpsTracks', ['DataManagerService', '$rootScope', '$http',  function (DataManagerService, $rootScope, $http) {

  // temporarily we will use gpx tracks as means to get the points in geojson to draw the tracks.
  // in the future, using the real backend and database, we will collect the parsed points/geojson?
  // from the backend and draw them. the gpx tracks will be already dealt with in the backend

  // function clear_geolayer() {
  //   map.removeLayer(geolayer);
  //   can addLayer() too
  // }

  function isOdd(num) { 
    return (num % 2) == 1;
  }

  var trackmaps = [];
  var trackmapCount=0;
  var geo = [];
  var geolayer = null;
  var center = [38.7, -9.1];
  var latFn = d3.random.normal(center[0], 0.5);
  var longFn = d3.random.normal(center[1], 0.5);

  return {

        restrict: 'E',
        scope: true,
        link: function($scope, $elem, $attr, $http) {


        $scope.$watch(function () {
          return $elem[0].parentNode.clientWidth;
        }, function ( w ) {
          if ( !w ) { return; }
          for(var i = 0; i < trackmapCount; i++) {
            trackmaps[i].invalidateSize();
          }
        });

        $scope.$watch(function () {
          return $elem[0].parentNode.clientHeight;
        }, function ( h ) {
          if ( !h ) { return; }
          for(var i = 0; i < trackmapCount; i++) {
            trackmaps[i].invalidateSize();
          }
        });

        $.ajax('2016-05-04 13-13-36.gpx').done(function(response) {
            
            var counter = 0;

            geo[0] = toGeoJSON.gpx(response);

            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                osm = L.tileLayer(osmUrl, {maxZoom: 18, attributionControl: false});
            var ggl = new L.Google();

            angular.element($elem[0]).append(angular.element('<div id="trackmap'+ trackmapCount +'" style="width: 100%; height: calc(100% - 25px); border: 1px solid #ccc"></div>'));
            trackmaps[trackmapCount] = new L.Map('trackmap'+ trackmapCount +'', {center: new L.LatLng(center[0], center[1]), zoom: 10});
            trackmaps[trackmapCount].addControl(new L.Control.Layers( {'Google':ggl,'OSM':osm}, {}));
            
            //trackmaps[trackmapCount].addLayer(ggl);
            // if both were active, the two layers would be active with one layed over the other,
            // depending on the order of call. this way the map initializes on the layer1 (leaflet)
            // layer, and then we can choose to change to the google layer
            var layer1 = osm.addTo(trackmaps[trackmapCount]);

            var myStyle = {
                "color": "red",
                "weight": 5,
                "opacity": 0.65,
                "clickable": true
            };

            for (var i = 0; i < geo.length; i++) {
                geolayer = L.geoJson(geo[i], {
                    style: myStyle,
                })
                .on('click', function(e) {
                    //console.log(e);
                    /* EXEMPLO PARA QUARTA: AO CLICAR AQUI NA TRACK, FAZER BROADCAST PARA O CALENDARIO DESENHAR
                    A SUPOSTA DAY VIEW ASSOCIADA AO SUPOSTO DIA DESTA TRACK. FAZER BROADCAST TB PARA O AREA GRADIENT
                    PARA REDESENHAR PARA QUALQUER ZOOM TEMPORAL. EM RELACAO AO HEXBIN MANDAR O BROADCAST PARA ESTE
                    FAZER ZOOM PARA A ZONA DO MAPA CORRESPONDENTE A TRACK */
                    if (!isOdd(counter)) {
                      $rootScope.$broadcast('rootScope:broadcast', {hexbin_info: 'hexbin', calendar: 'draw track day', area_gradient: 'draw that day'});
                      counter++;
                    } else {
                      $rootScope.$broadcast('rootScope:broadcast-leave');
                      counter++;
                    }
                });
                geolayer.addTo(trackmaps[trackmapCount]);
                geolayer.showExtremities('arrowM');
                trackmaps[trackmapCount].invalidateSize();
                trackmapCount++;

            };
        });
    
          for(var i = 0; i < trackmapCount; i++) {
            trackmaps[i].fireEvent('click', function(e) {
              alert("out of tracks");          
            });
          }
          
      }
    };

}]);

