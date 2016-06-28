app.directive('hexbinGraph', ['DataManagerService', '$rootScope', function (DataManagerService, $rootScope) {

	var maps = [];

	var map = undefined;
	var center = [38.7, -9.1];
	var latFn = d3.random.normal(center[0], 0.5);
	var longFn = d3.random.normal(center[1], 0.5);
	var data = [];
  var jsonRes=null;
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

        // DataManagerService.get('/hexbinPlaces', []).then(function(d) {
        //   jsonRes=d;
        //   createHexbinGraph();
        // });


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



app.directive('hexbintracksGraph', ['DataManagerService', '$rootScope', function (DataManagerService, $rootScope) {

  var hextrackmaps = [];

  var hextrackmap = undefined;
  var center = [38.7, -9.1];
  var latFn = d3.random.normal(center[0], 0.5);
  var longFn = d3.random.normal(center[1], 0.5);
  var trackdata = [];
  var jsonRes=null;
  var hexmapCount=0;

  function generateData(){
      for(i=0; i<10000; i++){
          trackdata.push([longFn(),  latFn()]);
      }
  };

  generateData();

  return {
        restrict: 'E',
        scope: true,
        link: function($scope, $elem, $attr) {

        // DataManagerService.get('/hexbinTracks', []).then(function(d) {
        //   jsonRes=d;
        //   createHexbinTracksGraph();
        // });

        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          osm = L.tileLayer(osmUrl, {maxZoom: 18, attributionControl: false});

        angular.element($elem[0]).append(angular.element('<div id="hextrackmap'+ hexmapCount +'" style="width: 100%; height: calc(100% - 25px); border: 1px solid #ccc"></div>'));
        console.log('hextrackmap'+ hexmapCount +'');
        hextrackmaps[hexmapCount] = new L.Map('hextrackmap'+ hexmapCount +'', {center: new L.LatLng(center[0], center[1]), zoom: 10});
        var layer1 = osm.addTo(hextrackmaps[hexmapCount]);
        

        $scope.$watch(function () {
          return $elem[0].parentNode.clientWidth;
        }, function ( w ) {
          if ( !w ) { return; }
          for(var i = 0; i < hexmapCount; i++) {
            hextrackmaps[i].invalidateSize();
          }
        });

        $scope.$watch(function () {
          return $elem[0].parentNode.clientHeight;
        }, function ( h ) {
          if ( !h ) { return; }
          for(var i = 0; i < hexmapCount; i++) {
            hextrackmaps[i].invalidateSize();
          }
        });

        var rootScopeBroadcast = $rootScope.$on('rootScope:broadcast', function (event, data) {
              console.log("Hexbin broadcast: " + JSON.stringify(data.hexbin_info)); // 'Broadcast!'
              var zoom = 15;
              for(var i = 0; i < mapCount; i++) {
                hextrackmaps[i].setView([38.73659, -9.14090], zoom);
              }
        });

        var rootScopeBroadcastLeave = $rootScope.$on('rootScope:broadcast-leave', function (event, data) {
          console.log("Hexbin broadcast leave"); // 'Broadcast!'
          var zoom = 10;
          for(var i = 0; i < mapCount; i++) {
            hextrackmaps[i].setView([center[0], center[1]], zoom);
          }
        });

        $scope.$on('$destroy', function() {
            rootScopeBroadcast();
            rootScopeBroadcastLeave();
        })
            
        function createHexbinTracksGraph () {

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

            var hexLayer = L.hexbinLayer(options).addTo(hextrackmaps[hexmapCount])
            hexLayer.colorScale().range(['white', 'blue']);
            console.log(trackdata);
            hexLayer.data(trackdata);
            hextrackmaps[hexmapCount].invalidateSize();

         }
            createHexbinTracksGraph();
            hexmapCount++;
        }
      }

}]);



app.directive('areaGradient', ['DataManagerService', '$rootScope', function (DataManagerService, $rootScope) {

	var delay=350;

  // CHANGE TO "TIME SPENT ON MOVEMENT". IT IS THE SAME AS "TIME SPENT ON TRIPS"
  // WHICH IS EASY TO CALCULATE: FOR EACH DATE WE PASS THE AMOUNT OF TIME SPENT ON TRIPS

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

  var jsonRes=null;

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

        // DataManagerService.get('/gpstracks', []).then(function(d) {
        //   jsonRes=d;
        //   createAreaGradientGraph();
        // });


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
      }
    };

}]);


app.directive('barChart', ['DataManagerService', '$rootScope', function (DataManagerService, $rootScope) {

  var delay=350;

  var jsonRes1=null;
  var jsonRes2=null;

  var resizeFlag=1; // flag for the resize $watch in order to draw the correct graph when resing
                    // 1->draw frequency 2->draw timespent


/******* HARDCODED DATA - WILL BE CHANGED TO THE SERVICE PROVIDED DATA ********/

          FrequencyData = [{
                            label: "Rialva",
                            value: 22
                          }, {
                            label: "INESC",
                            value: 33
                          }, {
                            label: "IST",
                            value: 4
                          }, {
                            label: "Casa",
                            value: 15
                          }, {
                            label: "Atrium Saldanha",
                            value: 36
                          }, {
                            label: "Estádio da Luz",
                            value: 0
                          }, {
                            label: "QWERTY",
                            value: 0
                          }, {
                            label: "AZERTY",
                            value: 14
                          }, {
                            label: "AAAAAA",
                            value: 20
                          }, {
                            label: "BBBBBB",
                            value: 30
                          }, {
                            label: "CCCCCC",
                            value: 40
                          }, {
                            label: "DDDDDDD",
                            value: 45
                          }, {
                            label: "EEEEEE",
                            value: 21
                          }, {
                            label: "FFFFFFF",
                            value: 31
                          }, {
                            label: "GGGGGGG",
                            value: 18
                          }, {
                            label: "eweqwww",
                            value: 18
                          }, {
                            label: "eqewe",
                            value: 18
                          }, {
                            label: "fsdfs",
                            value: 18
                          }];

          TimeSpentData = [{
                            label: "Rialva",
                            value: 10
                          }, {
                            label: "INESC",
                            value: 20
                          }, {
                            label: "IST",
                            value: 30
                          }, {
                            label: "Casa",
                            value: 5
                          }, {
                            label: "Atrium Saldanha",
                            value: 12
                          }, {
                            label: "Estádio da Luz",
                            value: 23
                          }];

/******* END OF HARDCODED DATA - WILL BE CHANGED TO THE SERVICE PROVIDED DATA ********/

  return {

      restrict: 'E',
      scope: true,
      link: function($scope, $elem, $attr, $http) {

          // DataManagerService.get('/barchartFrequency', []).then(function(d) {
          //   jsonRes1=d;
          // });

          // DataManagerService.get('/barchartTime', []).then(function(d) {
          //   jsonRes2=d;
          // });

          $scope.$watch(function () {
              return $elem[0].parentNode.clientWidth;
            }, function ( w ) {
              if ( !w ) { return; }
              if(resizeFlag==1) {
                createBarChart(FrequencyData, resizeFlag);
              }
              if(resizeFlag==2) {
                createBarChart(TimeSpentData, resizeFlag);
              }
            });

          $scope.$watch(function () {
              return $elem[0].parentNode.clientHeight;
            }, function ( h ) {
              if ( !h ) { return; }
              if(resizeFlag==1) {
                createBarChart(FrequencyData, resizeFlag);
              }
              if(resizeFlag==2) {
                createBarChart(TimeSpentData, resizeFlag);
              }
            });

          // $scope.$on('$destroy', function() {
          //   rootScopeBroadcast();
          //   rootScopeBroadcastLeave();
          // })

          $scope.$watchGroup(['frequency', 'timespent'], function (val) {
              if(val[0]==true && val[1]==false) {
                resizeFlag=1;
                createBarChart(FrequencyData, resizeFlag);
              }
              if(val[0]==false && val[1]==true) {
                resizeFlag=2;
                createBarChart(TimeSpentData, resizeFlag);
              }
          });
      
          function createBarChart(dataset, resizeFlag) { //posso passar aqui uma flag em vez de duplicar codigo para cada dataset

            dataset = dataset.sort(function(a, b) {  // function to sort the data descendingly
                              return a.value - b.value;
                          }).reverse();
            //console.log(dataset);

            setTimeout(function() {

              $elem[0].svg = null;

              var margin = {top: 33, right: 10, bottom: 75, left: 10},
                  width = $elem[0].parentNode.clientWidth - margin.left - margin.right,
                  height = $elem[0].parentNode.clientHeight - margin.top - margin.bottom;

              var div = d3.select($elem[0]).append("div").attr("class", "toolTip");
              var formatPercent = d3.format("");

              var y = d3.scale.ordinal()
                .domain(dataset.map(function(d) { return d.label; }))
                .rangeRoundBands([0, height], 0.1, 0.3);
              var x = d3.scale.linear()
                .domain([0, d3.max(dataset, function(d) { return d.value; })])
                .range([0, width]);

              var xAxis = d3.svg.axis()
                      .scale(x)
                      //.tickSize(-height)
                      .orient("bottom");

              d3.select($elem[0]).selectAll("svg").remove()

              var svg = d3.select($elem[0]).append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              svg.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + height + ")")
                      .call(xAxis);

              svg.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + height + ")")
                      .call(xAxis);

              svg.select(".y.axis").remove();
              svg.select(".x.axis").remove();

              if (resizeFlag==1) {
                svg.append("g")
                      .append("text")
                      .attr("transform", "rotate(0)")
                      .attr("x", 78)
                      .attr("dx", ".1em")
                      .style("text-anchor", "end")
                      .text("Frequency of Visit");
              }
              if (resizeFlag==2) {
                svg.append("g")
                      .append("text")
                      .attr("transform", "rotate(0)")
                      .attr("x", 49)
                      .attr("dx", ".1em")
                      .style("text-anchor", "end")
                      .text("Time Spent");
              }

              var bar = svg.selectAll(".bar")
                        .data(dataset, function(d) { return d.label; })

              // new data:
              bar.enter().append("rect")
                      .attr("class", "bar")
                      .attr("x", function(d) { return 0; })
                      .attr("y", function(d) { return y(d.label); })
                      .attr("width", function(d) { return x(d.value); }) // decomment bar.transition AND return 0 if want to animate
                      // for big dataset, limit the nr of bars shown!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                      // ex: bars with width under certain size or bars with d.value under certain value
                      // if(d.value<100) {return 0;}
                      // else {return x(d.value);}
                      .attr("height", y.rangeBand())
                      .text(function(d) { return d.label; });

              svg.selectAll(".bartext")
                      .data(dataset, function(d) { return d.label; })
                      .enter()
                      .append("text")
                      .attr("class", "bartext")
                      .attr("text-anchor", "middle")
                      .attr("fill", "white")
                      .attr("x", function(d,i) {
                          if (d.value==0) {return x(d.value)+50;}
                          return x(d.value)/2;
                      })
                      .attr("y", function(d,i) {
                          //if (d.value==0){return};
                          return y(d.label)+15;
                      })
                      .text(function(d){
                        //if (d.value==0){return}; use together with limitation of the nr of bars shown
                           return d.label;
                      });


              bar.on("mousemove", function(d){
                      div.style("left", d3.event.pageX+"px");
                      div.style("top", d3.event.pageY-130+"px");
                      div.style("display", "inline-block");
                      if (resizeFlag==1) {
                        div.html((d.value)+" times");
                      }
                      if (resizeFlag==2) {
                        div.html((d.value)+" mins");
                        // for now "mins" is hardcoded
                        // have function to format time accordingly (hours/just minutes/etc.)!!!!!!
                      }
                  });
              bar.on("mouseout", function(d){
                      div.style("display", "none");
                  });

              // removed data:
              bar.exit().remove();

              //animate updated data:
              // bar.transition()
              //         .duration(550)
              //         .attr("x", function(d) { return 0; })
              //         .attr("y", function(d) { return y(d.label); })
              //         .attr("width", function(d) { return x(d.value); })
              //         .attr("height", y.rangeBand());
              
              $elem[0].svg = svg;

            }, delay);

          }
      }
  };

}]);



app.directive('chordGraph', ['DataManagerService', '$rootScope', function (DataManagerService, $rootScope) {

  var delay=350;
  var jsonRes=null;

/******* HARDCODED DATA - WILL BE CHANGED TO THE SERVICE PROVIDED DATA ********/

var chordData = [{
                  "from": "INESC",
                  "to": ["IST", "home", "Atrium Saldanha", "Atrium Saldanha", "Atrium Saldanha", "Atrium Saldanha"]
                }, {
                  "from": "home",
                  "to": ["IST", "INESC"]
                }, {
                  "from": "Atrium Saldanha",
                  "to": ["IST", "INESC", "IST", "INESC", "Choupana caffe"]
                }, {
                  "from": "IST",
                  "to": ["home", "INESC", "Estádio da Luz", "Arco do Cego"]
                }, {
                  "from": "Estádio da Luz",
                  "to": ["home", "Colombo"]
                }, {
                  "from": "grandmother's house",
                  "to": ["home", "Forum Montijo"]
                }, {
                  "from": "INESC",
                  "to": ["home", "Forum Montijo"]
                }]


/******* END OF HARDCODED DATA - WILL BE CHANGED TO THE SERVICE PROVIDED DATA ********/


  return {
        restrict: 'E',
        scope: true,
        link: function($scope, $elem, $attr) {

          // DataManagerService.get('/chord', []).then(function(d) {
          //   jsonRes=d;
          // });

          $scope.$watch(function () {
              return $elem[0].parentNode.clientWidth;
            }, function ( w ) {
              if ( !w ) { return; }
              createChordGraph();
            });

          $scope.$watch(function () {
              return $elem[0].parentNode.clientHeight;
            }, function ( h ) {
            if ( !h ) { return; }
            createChordGraph();
           });

          function createChordGraph () {

            setTimeout(function() {

              $elem[0].svg = null;

              var margin = {top: 20, right: 10, bottom: 20, left: 10},
                  width = $elem[0].parentNode.clientWidth - margin.left - margin.right,
                  height = $elem[0].parentNode.clientHeight - margin.top - margin.bottom,
                  // outerRadius = 400 / 2,
                  // innerRadius = outerRadius-130;
                  innerRadius = Math.min(width, height) * .41,
                  outerRadius = innerRadius * 1.1;

              var formatPercent = d3.format(".1%");

              var fill = d3.scale.category20();

              var chord = d3.layout.chord()
                  .padding(.04)
                  .sortSubgroups(d3.descending)
                  .sortChords(d3.descending);

              var arc = d3.svg.arc()
                  .innerRadius(innerRadius)
                  .outerRadius(outerRadius);

              d3.select($elem[0]).selectAll("svg").remove()

              var svg = d3.select($elem[0]).append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom - 25)
                  .append("g")
                  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

              var indexByFromName = d3.map(),
                  fromNameByIndex = d3.map(),
                  matrix = [],
                  n = 0;

              // Compute a unique index for each package name.
              chordData.forEach(function(d) {
                if (!indexByFromName.has(d = d.from)) {
                  fromNameByIndex.set(n, d);
                  indexByFromName.set(d, n++);
                }
              });

              // Construct a square matrix counting package imports.
              chordData.forEach(function(d) {
                  var source = indexByFromName.get(d.from),
                      row = matrix[source];
                      //console.log(source);
                  if (!row) {
                   row = matrix[source] = [];
                   for (var i = -1; ++i < n;) row[i] = 0;
                  }
                  d.to.forEach(function(d) { row[indexByFromName.get(d)]++; });
              });

              chord.matrix(matrix);

              var g = svg.selectAll(".group")
                .data(chord.groups)
                .enter().append("g")
                .attr("class", "group");

              g.append("path")
                  .attr("fill", function(d) { return fill(d.index); })
                  .attr("stroke", function(d) { return fill(d.index); })
                  .attr("d", arc)
                  .on("click", fadeBroadcast(.1)) //put counter for to decide which function the clicking calls
                  .on("mouseout", fadeBroadcastLeave(1));

              g.append("text")
                  .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
                  .attr("dy", ".35em")
                  .attr("transform", function(d) {
                    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                        + "translate(" + (innerRadius + 26) + ")"
                        + (d.angle > Math.PI ? "rotate(180)" : "");
                  })
                  .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
                  .text(function(d) { return fromNameByIndex.get(d.index); });

                  // as labels não aparecem se o elemento tiver um nr de travels abaixo de um threshold
                  // ou elemento não aparece de todo

              svg.selectAll(".chord")
                  .data(chord.chords)
                  .enter().append("path")
                  .attr("class", "chord")
                  .attr("stroke", function(d) { return d3.rgb(fill(d.source.index)).darker(); })
                  .attr("fill", function(d) { return fill(d.source.index); })
                  .attr("d", d3.svg.chord().radius(innerRadius));

              svg.selectAll(".chord").append("title").text(function(d) {
                 return fromNameByIndex.get(d.source.index)
                 + " → " + fromNameByIndex.get(d.target.index)
                 + ": " + d.source.value + " travels"
                 + "\n" + fromNameByIndex.get(d.target.index)
                 + " → " + fromNameByIndex.get(d.source.index)
                 + ": " + d.target.value + " travels";
                 });

              $elem[0].svg = svg;

              // Returns an event handler for fading a given chord group.
              function fadeBroadcast(opacity) {
                return function(g, i) {
                  svg.selectAll(".chord")
                      .filter(function(d) { return d.source.index != i && d.target.index != i; })
                      .transition()
                      .style("opacity", opacity);
                      //$rootScope.selectedItem=true;
                      // $rootScope.$broadcast('rootScope:broadcast', { start : 4, end : 8});
                };
              }

              function fadeBroadcastLeave(opacity) {
                return function(g, i) {
                  svg.selectAll(".chord")
                      .filter(function(d) { return d.source.index != i && d.target.index != i; })
                      .transition()
                      .style("opacity", opacity);
                      //$rootScope.selectedItem=false;
                      // $rootScope.$broadcast('rootScope:broadcast-leave', 'json vazio');
                };
              }

            }, delay);
          }
      }
    };
}]);



app.directive('arcDiagram', ['DataManagerService', '$rootScope', function (DataManagerService, $rootScope) {

  var delay=350;
  var jsonResEdges=null;
  var jsonResNodes=null;

/******* HARDCODED DATA - WILL BE CHANGED TO THE SERVICE PROVIDED DATA ********/

 var nodes = [{ 
                id: "Rialva"
              }, {
                id: "INESC"
              }, {
                id: "IST alameda"
              }, {
                id: "home"
              }, {
                id: "Atrium Saldanha"
              }, {
                id: "grandmother's house"
              }, {
                id: "friend's house"
              }, {
                id: "airport"
              }, {
                id: "beach"
              }, {
                id: "alameda station"
              }, {
                id: "saldanha station"
              }, {
                id: "dolce vita monumental"
              }, {
                id: "choupana caffe"
              }, {
                id: "forum montijo"
              }, {
                id: "domus bar"
              }, {
                id: "IST taguspark"
              }, {
                id: "INCM"
              }, {
                id: "Estádio da Luz"
              }];

  var edges = [{ 
                source: "Rialva",
                target: "Estádio da Luz",
                frequency: 5
              }, {
                source: "INESC",
                target: "home",
                frequency: 6
              }, {
                source: "IST alameda",
                target: "home",
                frequency: 3
              }, {
                source: "home",
                target: "INESC",
                frequency: 8
              }, {
                source: "Atrium Saldanha",
                target: "IST alameda",
                frequency: 4
              }, {
                source: "home",
                target: "grandmother's house",
                frequency: 9
              }, {
                source: "home",
                target: "domus bar",
                frequency: 3
              }, {
                source: "IST alameda",
                target: "dolce vita monumental",
                frequency: 6
              }, {
                source: "IST alameda",
                target: "IST taguspark",
                frequency: 3
              }, {
                source: "IST taguspark",
                target: "IST alameda",
                frequency: 2
              }, {
                source: "alameda station",
                target: "saldanha station",
                frequency: 1
              }, {
                source: "home",
                target: "airport",
                frequency: 1
              }, {
                source: "INESC",
                target: "INCM",
                frequency: 7
              }, {
                source: "forum montijo",
                target: "home",
                frequency: 6
              }, {
                source: "INESC",
                target: "choupana caffe",
                frequency: 2
              }, {
                source: "home",
                target: "beach",
                frequency: 2
              }];


/******* END OF HARDCODED DATA - WILL BE CHANGED TO THE SERVICE PROVIDED DATA ********/


  return {
        restrict: 'E',
        scope: true,
        link: function($scope, $elem, $attr) {

          // DataManagerService.get('/arcedges', []).then(function(d) {
          //   jsonResEdges=d;
          // });

          // DataManagerService.get('/arcnodes', []).then(function(d) {
          //   jsonResNodes=d;
          // });

          function getNodePos(el) {
              var body = d3.select($elem[0]).node();

              for (var lx = 0, ly = 0;
                   el != null && el != body;
                   lx += (el.offsetLeft || el.clientLeft), ly += (el.offsetTop || el.clientTop), el = (el.offsetParent || el.parentNode))
                  ;
              return {x: lx, y: ly};
          }

          $scope.$watch(function () {
              return $elem[0].parentNode.clientWidth;
            }, function ( w ) {
              if ( !w ) { return; }
              createArcGraph();
            });

          $scope.$watch(function () {
              return $elem[0].parentNode.clientHeight;
            }, function ( h ) {
            if ( !h ) { return; }
            createArcGraph();
           });
          
          expEdges = edges;
          expNodes = nodes;
          
          var nodeHash = {};
          for (x in nodes) {
            nodeHash[nodes[x].id] = nodes[x];
            nodes[x].x = parseInt(x) * 50;
          }
          for (x in edges) {
            edges[x].source = nodeHash[edges[x].source];
            edges[x].target = nodeHash[edges[x].target];
             //console.log(edges[x].source);
             //console.log(edges[x].target);
          }
          
          function createArcGraph () {

            setTimeout(function() {

              $elem[0].svg = null;

              var margin = {top: 20, right: 10, bottom: 20, left: 25},
                  width = $elem[0].parentNode.clientWidth - margin.left - margin.right,
                  height = $elem[0].parentNode.clientHeight - margin.top - margin.bottom;
              
              d3.select($elem[0]).selectAll("svg").remove()

              var svg = d3.select($elem[0]).append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom-25)
                      .append("g")
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              var arrow = svg.append('g')

                  arrow.append('text')
                  .attr('class', 'button-direction-1')
                  .attr('x', width/2)
                  .attr('y', 1400/height)
                  .html('&#x2192;');

                  arrow.append('text')
                  .attr('class', 'button-direction-2')
                  .attr('x', width/2)
                  .attr('y', height/1.1)
                  .html('&#x2190;');

                  arrow.append("text")
                  .attr('x', (width/2)-90)
                  .attr('y', (height/1.1)-3)
                  .text("From-To Direction:")

                  arrow.append("text")
                  .attr('x', (width/2)-90)
                  .attr('y', (1400/height)-3)
                  .text("From-To Direction:")

              var tooltip = d3.select($elem[0]).append('div') 
                  .attr("class", "arc-tooltip")      
                  .style("opacity", 0);

              var arcG = svg.append("g")
                        .attr("id", "arcG")
                        .attr("transform", "translate(" + (2/-width) + "," + (height/2) + ")"); 
                        //.attr("transform", "translate(50,250)");

              arcG.selectAll("path")
                .data(edges)
                .enter()
                .append("path")
                .attr("id", "arcpath")
                .style("stroke", "black")
                .style("stroke-width", function(d) {return d.frequency * 2})
                .style("opacity", .25)
                .style("fill", "none")
                .attr("d", arc)
                .on("mouseover", edgeOver)
                .on("mouseout", function(d) {    
                    tooltip.transition()    
                        .duration(100)    
                        .style("opacity", 0); 
                });
              
              arcG.selectAll("circle")
                .data(nodes)
                .enter()
                .append("circle")
                .attr("id", "arccircle")
                .attr("r", 10)
                .style("fill", "lightgray")
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .attr("cx", function (d) {return d.x}) // fix width responsiveness
                .on("mouseover", nodeOver) // or change circles to squares ("rect")
                .on("mouseout", function(d) {    
                    tooltip.transition()    
                        .duration(100)    
                        .style("opacity", 0); 
                });

              function arc(d,i) {
                var draw = d3.svg.line().interpolate("basis");
                var midX = (d.source.x + d.target.x) / 2;
                var midY = (d.source.x - d.target.x) / (1400/height); // divisao decide altura do arco
                // colocar divisão diferente para cada intervalo de nr de elementos
                // ex: elementos < 10, (1200/height)->(200/height)
                return draw([[d.source.x,0],[midX,midY],[d.target.x,0]])
              }
              
              function nodeOver(d,i) {
                d3.selectAll("#arccircle").style("fill", function (p) {return p == d ? "#BF0000" : "lightgray"})
                d3.selectAll("#arcpath").style("stroke", function (p) {return p.source == d || p.target == d ? "red" : "black"})
                tooltip.style('display', 'block').transition()    
                  .duration(100)    
                  .style("opacity", .9);    
                tooltip.html(d.id)
                  .style("height", 30 + "px")
                  .style("width", 90 + "px");
                    // Show tooltip in absolutely positioned DIV, which position is calculated 
                    // taking screen size+scroll into consideration
                    var dist = { x: 10, y: 10 };
                    var body_sel = d3.select($elem[0]);
                    var body = { w: body_sel.node().offsetWidth, h: body_sel.node().offsetHeight };
                    var doc = { w: document.width, h: document.height };
                    var svgpos = getNodePos(d3.select("svg").node());
                    var scr = { x: window.scrollX, y: window.scrollY, w: window.innerWidth, h: window.innerHeight };
                    var m = d3.mouse(d3.select("svg").node());
                     scr.x = window.scrollX;
                     scr.y = window.scrollY;
                     m[0] += svgpos.x;
                     m[1] += svgpos.y;
                         tooltip.style("right", "");
                         tooltip.style("left", "");
                         tooltip.style("bottom", "");
                         tooltip.style("top", "");
                     if (m[0] > scr.x + scr.w / 2) {
                         tooltip.style("right", (body.w - m[0] + dist.x) + "px");
                     }
                     else {
                         tooltip.style("left", (m[0] + dist.x) + "px");
                     }

                     if (m[1] > scr.y + scr.h / 2) {
                         tooltip.style("bottom", (body.h - m[1] + dist.y) + "px");
                     }
                     else {
                         tooltip.style("top", (m[1] + dist.y) + "px");
                     }
                     tooltip.style("visibility", "visible");
              }
          
              function edgeOver(d) {
                d3.selectAll("#arcpath").style("stroke", function(p) {return p == d ? "red" : "black"})
                d3.selectAll("#arccircle").style("fill", function(p) {return p == d.source ? "#000ED4" : p == d.target ? "#43941C" : "lightgray"})
                tooltip.style('display', 'block').transition()    
                  .duration(100)    
                  .style("opacity", .9);    
                tooltip.html("From: " + d.source.id + "<br>" + "To: " + d.target.id)
                  .style("width", 120 + "px")
                  .style("height", 50 + "px");
                    // Show tooltip in absolutely positioned DIV, which position is calculated 
                    // taking screen size+scroll into consideration
                    var dist = { x: 10, y: 10 };
                    var body_sel = d3.select($elem[0]);
                    var body = { w: body_sel.node().offsetWidth, h: body_sel.node().offsetHeight };
                    var doc = { w: document.width, h: document.height };
                    var svgpos = getNodePos(d3.select("svg").node());
                    var scr = { x: window.scrollX, y: window.scrollY, w: window.innerWidth, h: window.innerHeight };
                    var m = d3.mouse(d3.select("svg").node());
                     scr.x = window.scrollX;
                     scr.y = window.scrollY;
                     m[0] += svgpos.x;
                     m[1] += svgpos.y;
                         tooltip.style("right", "");
                         tooltip.style("left", "");
                         tooltip.style("bottom", "");
                         tooltip.style("top", "");
                     if (m[0] > scr.x + scr.w / 2) {
                         tooltip.style("right", (body.w - m[0] + dist.x) + "px");
                     }
                     else {
                         tooltip.style("left", (m[0] + dist.x) + "px");
                     }

                     if (m[1] > scr.y + scr.h / 2) {
                         tooltip.style("bottom", (body.h - m[1] + dist.y) + "px");
                     }
                     else {
                         tooltip.style("top", (m[1] + dist.y) + "px");
                     }
                     tooltip.style("visibility", "visible");
              }
              
              $elem[0].svg = svg;

            }, delay);
          }
        }
      };

}]);



app.directive('staysGraph', ['DataManagerService', '$rootScope', function (DataManagerService, $rootScope) {

  var delay=350;
  var jsonRes=null;

  function makeid() { // funcao temporaria para criar labels aleatorias, em vez de estar a
                      // adicionar novas linhas com o nome "label" ao json das stays
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < 5; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }

/******* HARDCODED DATA - WILL BE CHANGED TO THE SERVICE PROVIDED DATA ********/

var stays=[  
                 {  
                    day:2, // day 1: sunday, day 2: monday, etc.
                    hour:1, // // 1-1 ate 1-1.59 -> corresponde ao intervalo 0 ate 0.59
                    // "primeira hora do dia" - fazer esta associaçao no backend
                    // ex: if 00<=hour<=00.59 -> hour=1
                    time_spent:127 //in minutes - shown in hours on the tooltip if >60
                    // label: "home"  in the future, this attr is also needed
                 },
                 {  
                    day:4,
                    hour:1,
                    time_spent:141
                 },
                 {  
                    day:1,
                    hour:1,
                    time_spent:134
                 },
                 {  
                    day:5,
                    hour:1,
                    time_spent:174
                 },
                 {  
                    day:3,
                    hour:1,
                    time_spent:131
                 },
                 {  
                    day:6,
                    hour:1,
                    time_spent:333
                 },
                 {  
                    day:7,
                    hour:1,
                    time_spent:311
                 },
                 {  
                    day:2,
                    hour:2,
                    time_spent:79
                 },
                 {  
                    day:4,
                    hour:2,
                    time_spent:99
                 },
                 {  
                    day:1,
                    hour:2,
                    time_spent:117
                 },
                 {  
                    day:5,
                    hour:2,
                    time_spent:123
                 },
                 {  
                    day:3,
                    hour:2,
                    time_spent:92
                 },
                 {  
                    day:6,
                    hour:2,
                    time_spent:257
                 },
                 {  
                    day:7,
                    hour:2,
                    time_spent:293
                 },
                 {  
                    day:2,
                    hour:3,
                    time_spent:55
                 },
                 {  
                    day:4,
                    hour:3,
                    time_spent:73
                 },
                 {  
                    day:1,
                    hour:3,
                    time_spent:107
                 },
                 {  
                    day:5,
                    hour:3,
                    time_spent:89
                 },
                 {  
                    day:3,
                    hour:3,
                    time_spent:66
                 },
                 {  
                    day:6,
                    hour:3,
                    time_spent:185
                 },
                 {  
                    day:7,
                    hour:3,
                    time_spent:262
                 },
                 {  
                    day:2,
                    hour:4,
                    time_spent:39
                 },
                 {  
                    day:4,
                    hour:4,
                    time_spent:67
                 },
                 {  
                    day:1,
                    hour:4,
                    time_spent:59
                 },
                 {  
                    day:5,
                    hour:4,
                    time_spent:83
                 },
                 {  
                    day:3,
                    hour:4,
                    time_spent:45
                 },
                 {  
                    day:6,
                    hour:4,
                    time_spent:180
                 },
                 {  
                    day:7,
                    hour:4,
                    time_spent:220
                 },
                 {  
                    day:2,
                    hour:5,
                    time_spent:48
                 },
                 {  
                    day:4,
                    hour:5,
                    time_spent:57
                 },
                 {  
                    day:1,
                    hour:5,
                    time_spent:73
                 },
                 {  
                    day:5,
                    hour:5,
                    time_spent:76
                 },
                 {  
                    day:3,
                    hour:5,
                    time_spent:72
                 },
                 {  
                    day:6,
                    hour:5,
                    time_spent:168
                 },
                 {  
                    day:7,
                    hour:5,
                    time_spent:199
                 },
                 {  
                    day:2,
                    hour:6,
                    time_spent:129
                 },
                 {  
                    day:4,
                    hour:6,
                    time_spent:102
                 },
                 {  
                    day:1,
                    hour:6,
                    time_spent:129
                 },
                 {  
                    day:5,
                    hour:6,
                    time_spent:140
                 },
                 {  
                    day:3,
                    hour:6,
                    time_spent:117
                 },
                 {  
                    day:6,
                    hour:6,
                    time_spent:148
                 },
                 {  
                    day:7,
                    hour:6,
                    time_spent:193
                 },
                 {  
                    day:2,
                    hour:7,
                    time_spent:314
                 },
                 {  
                    day:4,
                    hour:7,
                    time_spent:284
                 },
                 {  
                    day:1,
                    hour:7,
                    time_spent:367
                 },
                 {  
                    day:5,
                    hour:7,
                    time_spent:270
                 },
                 {  
                    day:3,
                    hour:7,
                    time_spent:310
                 },
                 {  
                    day:6,
                    hour:7,
                    time_spent:179
                 },
                 {  
                    day:7,
                    hour:7,
                    time_spent:192
                 },
                 {  
                    day:2,
                    hour:8,
                    time_spent:806
                 },
                 {  
                    day:4,
                    hour:8,
                    time_spent:811
                 },
                 {  
                    day:1,
                    hour:8,
                    time_spent:850
                 },
                 {  
                    day:5,
                    hour:8,
                    time_spent:609
                 },
                 {  
                    day:3,
                    hour:8,
                    time_spent:846
                 },
                 {  
                    day:6,
                    hour:8,
                    time_spent:208
                 },
                 {  
                    day:7,
                    hour:8,
                    time_spent:144
                 },
                 {  
                    day:2,
                    hour:9,
                    time_spent:1209
                 },
                 {  
                    day:4,
                    hour:9,
                    time_spent:1214
                 },
                 {  
                    day:1,
                    hour:9,
                    time_spent:1205
                 },
                 {  
                    day:5,
                    hour:9,
                    time_spent:960
                 },
                 {  
                    day:3,
                    hour:9,
                    time_spent:1073
                 },
                 {  
                    day:6,
                    hour:9,
                    time_spent:286
                 },
                 {  
                    day:7,
                    hour:9,
                    time_spent:152
                 },
                 {  
                    day:2,
                    hour:10,
                    time_spent:750
                 },
                 {  
                    day:4,
                    hour:10,
                    time_spent:808
                 },
                 {  
                    day:1,
                    hour:10,
                    time_spent:610
                 },
                 {  
                    day:5,
                    hour:10,
                    time_spent:655
                 },
                 {  
                    day:3,
                    hour:10,
                    time_spent:684
                 },
                 {  
                    day:6,
                    hour:10,
                    time_spent:482
                 },
                 {  
                    day:7,
                    hour:10,
                    time_spent:253
                 },
                 {  
                    day:2,
                    hour:11,
                    time_spent:591
                 },
                 {  
                    day:4,
                    hour:11,
                    time_spent:593
                 },
                 {  
                    day:1,
                    hour:11,
                    time_spent:573
                 },
                 {  
                    day:5,
                    hour:11,
                    time_spent:695
                 },
                 {  
                    day:3,
                    hour:11,
                    time_spent:622
                 },
                 {  
                    day:6,
                    hour:11,
                    time_spent:676
                 },
                 {  
                    day:7,
                    hour:11,
                    time_spent:326
                 },
                 {  
                    day:2,
                    hour:12,
                    time_spent:653
                 },
                 {  
                    day:4,
                    hour:12,
                    time_spent:679
                 },
                 {  
                    day:1,
                    hour:12,
                    time_spent:639
                 },
                 {  
                    day:5,
                    hour:12,
                    time_spent:736
                 },
                 {  
                    day:3,
                    hour:12,
                    time_spent:687
                 },
                 {  
                    day:6,
                    hour:12,
                    time_spent:858
                 },
                 {  
                    day:7,
                    hour:12,
                    time_spent:402
                 },
                 {  
                    day:2,
                    hour:13,
                    time_spent:738
                 },
                 {  
                    day:4,
                    hour:13,
                    time_spent:749
                 },
                 {  
                    day:1,
                    hour:13,
                    time_spent:631
                 },
                 {  
                    day:5,
                    hour:13,
                    time_spent:908
                 },
                 {  
                    day:3,
                    hour:13,
                    time_spent:888
                 },
                 {  
                    day:6,
                    hour:13,
                    time_spent:880
                 },
                 {  
                    day:7,
                    hour:13,
                    time_spent:507
                 },
                 {  
                    day:2,
                    hour:14,
                    time_spent:792
                 },
                 {  
                    day:4,
                    hour:14,
                    time_spent:847
                 },
                 {  
                    day:1,
                    hour:14,
                    time_spent:752
                 },
                 {  
                    day:5,
                    hour:14,
                    time_spent:1033
                 },
                 {  
                    day:3,
                    hour:14,
                    time_spent:942
                 },
                 {  
                    day:6,
                    hour:14,
                    time_spent:983
                 },
                 {  
                    day:7,
                    hour:14,
                    time_spent:636
                 },
                 {  
                    day:2,
                    hour:15,
                    time_spent:906
                 },
                 {  
                    day:4,
                    hour:15,
                    time_spent:1031
                 },
                 {  
                    day:1,
                    hour:15,
                    time_spent:954
                 },
                 {  
                    day:5,
                    hour:15,
                    time_spent:1199
                 },
                 {  
                    day:3,
                    hour:15,
                    time_spent:1014
                 },
                 {  
                    day:6,
                    hour:15,
                    time_spent:1125
                 },
                 {  
                    day:7,
                    hour:15,
                    time_spent:712
                 },
                 {  
                    day:2,
                    hour:16,
                    time_spent:1101
                 },
                 {  
                    day:4,
                    hour:16,
                    time_spent:1158
                 },
                 {  
                    day:1,
                    hour:16,
                    time_spent:1029
                 },
                 {  
                    day:5,
                    hour:16,
                    time_spent:1364
                 },
                 {  
                    day:3,
                    hour:16,
                    time_spent:1068
                 },
                 {  
                    day:6,
                    hour:16,
                    time_spent:1062
                 },
                 {  
                    day:7,
                    hour:16,
                    time_spent:736
                 },
                 {  
                    day:2,
                    hour:17,
                    time_spent:1303
                 },
                 {  
                    day:4,
                    hour:17,
                    time_spent:1426
                 },
                 {  
                    day:1,
                    hour:17,
                    time_spent:1270
                 },
                 {  
                    day:5,
                    hour:17,
                    time_spent:1455
                 },
                 {  
                    day:3,
                    hour:17,
                    time_spent:1407
                 },
                 {  
                    day:6,
                    hour:17,
                    time_spent:883
                 },
                 {  
                    day:7,
                    hour:17,
                    time_spent:666
                 },
                 {  
                    day:2,
                    hour:18,
                    time_spent:1549
                 },
                 {  
                    day:4,
                    hour:18,
                    time_spent:1653
                 },
                 {  
                    day:1,
                    hour:18,
                    time_spent:1350
                 },
                 {  
                    day:5,
                    hour:18,
                    time_spent:1502
                 },
                 {  
                    day:3,
                    hour:18,
                    time_spent:1507
                 },
                 {  
                    day:6,
                    hour:18,
                    time_spent:830
                 },
                 {  
                    day:7,
                    hour:18,
                    time_spent:652
                 },
                 {  
                    day:2,
                    hour:19,
                    time_spent:998
                 },
                 {  
                    day:4,
                    hour:19,
                    time_spent:1070
                 },
                 {  
                    day:1,
                    hour:19,
                    time_spent:787
                 },
                 {  
                    day:5,
                    hour:19,
                    time_spent:1027
                 },
                 {  
                    day:3,
                    hour:19,
                    time_spent:1019
                 },
                 {  
                    day:6,
                    hour:19,
                    time_spent:575
                 },
                 {  
                    day:7,
                    hour:19,
                    time_spent:519
                 },
                 {  
                    day:2,
                    hour:20,
                    time_spent:661
                 },
                 {  
                    day:4,
                    hour:20,
                    time_spent:756
                 },
                 {  
                    day:1,
                    hour:20,
                    time_spent:596
                 },
                 {  
                    day:5,
                    hour:20,
                    time_spent:730
                 },
                 {  
                    day:3,
                    hour:20,
                    time_spent:648
                 },
                 {  
                    day:6,
                    hour:20,
                    time_spent:494
                 },
                 {  
                    day:7,
                    hour:20,
                    time_spent:486
                 },
                 {  
                    day:2,
                    hour:21,
                    time_spent:431
                 },
                 {  
                    day:4,
                    hour:21,
                    time_spent:539
                 },
                 {  
                    day:1,
                    hour:21,
                    time_spent:430
                 },
                 {  
                    day:5,
                    hour:21,
                    time_spent:509
                 },
                 {  
                    day:3,
                    hour:21,
                    time_spent:457
                 },
                 {  
                    day:6,
                    hour:21,
                    time_spent:443
                 },
                 {  
                    day:7,
                    hour:21,
                    time_spent:421
                 },
                 {  
                    day:2,
                    hour:22,
                    time_spent:352
                 },
                 {  
                    day:4,
                    hour:22,
                    time_spent:428
                 },
                 {  
                    day:1,
                    hour:22,
                    time_spent:362
                 },
                 {  
                    day:5,
                    hour:22,
                    time_spent:462
                 },
                 {  
                    day:3,
                    hour:22,
                    time_spent:390
                 },
                 {  
                    day:6,
                    hour:22,
                    time_spent:379
                 },
                 {  
                    day:7,
                    hour:22,
                    time_spent:324
                 },
                 {  
                    day:2,
                    hour:23,
                    time_spent:329
                 },
                 {  
                    day:4,
                    hour:23,
                    time_spent:381
                 },
                 {  
                    day:1,
                    hour:23,
                    time_spent:293
                 },
                 {  
                    day:5,
                    hour:23,
                    time_spent:393
                 },
                 {  
                    day:3,
                    hour:23,
                    time_spent:313
                 },
                 {  
                    day:6,
                    hour:23,
                    time_spent:374
                 },
                 {  
                    day:7,
                    hour:23,
                    time_spent:288
                 },
                 {  
                    day:2,
                    hour:24, // 24-1 ate 24-1.59 -> corresponde ao intervalo 23 ate 23.59
                    time_spent:211
                 },
                 {  
                    day:4,
                    hour:24,
                    time_spent:249
                 },
                 {  
                    day:1,
                    hour:24,
                    time_spent:204
                 },
                 {  
                    day:5,
                    hour:24,
                    time_spent:417
                 },
                 {  
                    day:3,
                    hour:24,
                    time_spent:211
                 },
                 {  
                    day:6,
                    hour:24,
                    time_spent:379
                 },
                 {  
                    day:7,
                    hour:24,
                    time_spent:203
                 }
              ];

/******* END OF HARDCODED DATA - WILL BE CHANGED TO THE SERVICE PROVIDED DATA ********/


  return {
        restrict: 'E',
        scope: true,
        link: function($scope, $elem, $attr) {

          // DataManagerService.get('/staysgraph', []).then(function(d) {
          //   jsonRes=d;
          // });
          
          function getNodePos(el) {
              var body = d3.select($elem[0]).node();

              for (var lx = 0, ly = 0;
                   el != null && el != body;
                   lx += (el.offsetLeft || el.clientLeft), ly += (el.offsetTop || el.clientTop), el = (el.offsetParent || el.parentNode))
                  ;
              return {x: lx, y: ly};
          }

          $scope.$watch(function () {
              return $elem[0].parentNode.clientWidth;
            }, function ( w ) {
              if ( !w ) { return; }
              createStaysGraph();
            });

          $scope.$watch(function () {
              return $elem[0].parentNode.clientHeight;
            }, function ( h ) {
            if ( !h ) { return; }
            createStaysGraph();
           });

          function createStaysGraph () {

            setTimeout(function() {

              $elem[0].svg = null;
              
              //var days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
              var days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                  times = d3.range(24);

              var margin = {top: 70, right: 10, bottom: 20, left: 25},
                  width = $elem[0].parentNode.clientWidth - margin.left - margin.right,
                  //height = $elem[0].parentNode.clientHeight - margin.top - margin.bottom;
                  gridSize = Math.floor(width / times.length),
                  height = gridSize * (days.length);

              d3.select($elem[0]).selectAll("svg").remove()

              var svg = d3.select($elem[0]).append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              var tooltip = d3.select($elem[0]).append('div') 
                  .attr("class", "stays-tooltip")      
                  .style("opacity", 0);

              //Reset the overall font size
              var newFontSize = width * 62.5 / 900;
              d3.select("html").style("font-size", newFontSize + "%");

              var colorScale = d3.scale.linear()
                  .domain([0, d3.max(stays, function(d) {return d.time_spent; })/2, d3.max(stays, function(d) {return d.time_spent; })])
                  .range(["#FFFFDD", "#3E9583", "#1F2D86"])

              var dayLabels = svg.selectAll(".dayLabel")
                  .data(days)
                  .enter().append("text")
                  .text(function (d) { return d; })
                  .attr("x", 0)
                  .attr("y", function (d, i) { return i * gridSize; })
                  .style("text-anchor", "end")
                  .attr("transform", "translate(-6," + gridSize / 1.5 + ")")

              var timeLabels = svg.selectAll(".timeLabel")
                  .data(times)
                  .enter().append("text")
                  .attr("class", "hour-size")
                  .text(function(d) { return d + "h"; })
                  .attr("x", function(d, i) { return i * gridSize; })
                  .attr("y", 0)
                  .style("text-anchor", "middle")
                  .attr("transform", "translate(" + gridSize / 2 + ", -6)")

              var heatMap = svg.selectAll(".hour")
                  .data(stays)
                  .enter().append("rect")
                  .attr("x", function(d) { return (d.hour - 1) * gridSize; })
                  .attr("y", function(d) { return (d.day - 1) * gridSize; })
                  //.attr("rx", 4)
                  // .attr("ry", 4)
                  .attr("class", "hour bordered")
                  .attr("width", gridSize)
                  .attr("height", gridSize)
                  .style("stroke", "white")
                  .style("stroke-opacity", 0.6)
                  .style("stroke-width", 0.8)
                  .style("fill", function(d) { return colorScale(d.time_spent); })
                  .on("mouseover", function(d, i) {
                      
                      // Construct tooltip
                      var tooltip_html = '';
                      tooltip_html += '<div class="header"><strong>' + 'Stays' + ' </strong></div>';
                      
                      // Add info to the tooltip
                      angular.forEach(d.summary, function (d) {
                        tooltip_html += '<div><span><strong>' + makeid() + '</strong></span>';
                        tooltip_html += '<span>' + d.time_spent + '</span></div>';
                      });
                      
                      // Set tooltip width
                      tooltip.html(tooltip_html).style("width", 300 + "px");

                        // Show tooltip in absolutely positioned DIV, which position is calculated 
                        // taking screen size+scroll into consideration
                        var dist = { x: 10, y: 10 };
                        var body_sel = d3.select($elem[0]);
                        var body = { w: body_sel.node().offsetWidth, h: body_sel.node().offsetHeight };
                        var doc = { w: document.width, h: document.height };
                        var svgpos = getNodePos(d3.select("svg").node());
                        var scr = { x: window.scrollX, y: window.scrollY, w: window.innerWidth, h: window.innerHeight };
                        var m = d3.mouse(d3.select("svg").node());
                         scr.x = window.scrollX;
                         scr.y = window.scrollY;
                         m[0] += svgpos.x;
                         m[1] += svgpos.y;
                             tooltip.style("right", "");
                             tooltip.style("left", "");
                             tooltip.style("bottom", "");
                             tooltip.style("top", "");
                         if (m[0] > scr.x + scr.w / 2) {
                             tooltip.style("right", (body.w - m[0] + dist.x) + "px");
                         }
                         else {
                             tooltip.style("left", (m[0] + dist.x) + "px");
                         }

                         if (m[1] > scr.y + scr.h / 2) {
                             tooltip.style("bottom", (body.h - m[1] + dist.y) + "px");
                         }
                         else {
                             tooltip.style("top", (m[1] + dist.y) + "px");
                         }
                         tooltip.style("visibility", "visible");
                        
                        // Tooltip transition and more styling
                        tooltip.style('display', 'block')
                        .transition()
                          .ease('ease-in')
                          .duration(100)    
                          .style("opacity", .9);
                  })
                  .on("mouseout", function(d) {    
                      tooltip.transition()
                              .duration(100)
                              .ease('ease-in')
                              .style('opacity', 0); 
                  });

              $elem[0].svg = svg;

            }, delay);
          }
        }
      };

}]);

