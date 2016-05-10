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
  					    valueCeil: undefined
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

		}
		
	};

}]);


app.directive('calendarHeatmap', ['DataManagerService', '$rootScope', function (DataManagerService, $rootScope) {

	var delay=350;

  // **************************** EXAMPLE DATA ***********************

     var now = moment().endOf('day').toDate();
      var yearAgo = moment().startOf('day').subtract(1, 'year').toDate();
      var data = d3.time.days(yearAgo, now).map(function (dateElement) {
        return {
            date: dateElement,
            details: Array.apply(null, new Array(Math.floor(Math.random() * 25))).map(function(e, i, arr) {
              return {
                'name': 'Place ' + Math.floor(Math.random() * 10),
                'date': function () {
                  var projectDate = new Date(dateElement.getTime());
                  projectDate.setHours(Math.floor(Math.random() * 24))
                  projectDate.setMinutes(Math.floor(Math.random() * 60));
                  return projectDate;
                }(),
                'value': 3600 * ((arr.length - i) / 5) + Math.floor(Math.random() * 3600)
              }
            }),
          init: function () {
            this.total = this.details.reduce(function (prev, e) {
              return prev + e.value;
            }, 0);
            return this;
          }
        }.init();
      });

      // Get daily summary if that was not provided
      if ( !data[0].summary ) {
        data.map(function (d) {
          var summary = d.details.reduce( function(uniques, project) {
            if ( !uniques[project.name] ) {
              uniques[project.name] = {
                'value': project.value
              };
            } else {
              uniques[project.name].value += project.value;
            }
            return uniques;
          }, {});
          var unsorted_summary = Object.keys(summary).map(function (key) {
            return {
              'name': key,
              'value': summary[key].value
            };
          });
          d.summary = unsorted_summary.sort(function (a, b) {
            return b.value - a.value;
          });
          return d;
        });
      }

  // **************************** EXAMPLE DATA ***********************


    return {
      restrict: 'E',
      scope: true,
      replace: true,
      link: function ($scope, $elem, $attr) {

        var margin = {top: 20, right: 10, bottom: 20, left: 10};
        var gutter = 5;
        var initialWidth = 1000;
        var initialHeight = ($elem[0].parentNode.clientHeight);
        var circle_radius = 10;
        var label_padding = 40;
        var max_block_height = 25;
        var selected_date;
        var in_transition = false;
        var delay=350;
        var transition_duration = 500;

        // Tooltip defaults
        var tooltip_width = 250;
        var tooltip_padding = 15;
        var tooltip_line_height = 15;


        d3.select($elem[0]).selectAll("svg").remove()
        // Initialize svg element
        var svg = d3.select($elem[0]).append('svg')
          .attr('class', 'svg')

        // Initialize main svg elements
        var items = svg.append('g').attr("transform", "translate(" + 0 + "," + 0 + ")");
        var labels = svg.append('g').attr("transform", "translate(" + 0 + "," + 0 + ")");
        var buttons = svg.append('g');
        var tooltip = svg.append('g')
          .style('opacity', 0)
          .attr('class', 'heatmap-tooltip');

        $scope.$watch(function () {
          return $elem[0].parentNode.clientWidth;
        }, function ( w ) {
          if ( !w ) { return; }
          width = w < 1000 ? 1000 : w;
          circle_radius = (((width - gutter) / (moment().weeksInYear() + 2)) - gutter) / 2;
          label_padding = circle_radius * 4;
          height = label_padding + 7 * (circle_radius * 2 + gutter);
          svg.attr({'width': width, 'height': height});
          drawChart();
        });

        /**
         * Draw the chart based on the current overview type
         */
         function drawChart() {
          if ( !data ) { return; }

          if ( !!selected_date ) {
            drawDayOverview();
          } else {
            drawYearOverview();
          }
        };

          /**
           * Draw year overview
           */
        function drawYearOverview() {

          setTimeout(function() {

            $elem[0].svg = null;

            var firstDate = moment(data[0].date);
            var max_value = d3.max(data, function (d) {
              return d.total;
            });

            var color = d3.scale.linear()
              .range(['#ffffff', '#3b6427' || '#ff4500'])
              .domain([-0.15 * max_value, max_value]);

            items.selectAll('.item-circle').remove();
            items.selectAll('.item-circle')
              .data(data)
              .enter()
              .append('circle')
              .attr('class', 'item item-circle')
              .style('opacity', 0)
              .attr('r', function (d) {
                if ( max_value <= 0 ) { return circle_radius; }
                return circle_radius * 0.75 + (circle_radius * d.total / max_value) * 0.25;
              })
              .attr('fill', function (d) {
                return ( d.total > 0 ) ? color(d.total) : 'transparent';
              })
              .attr('cx', function (d) {
                var cellDate = moment(d.date);
                var week_num = cellDate.week() - firstDate.week() + (firstDate.weeksInYear() * (cellDate.weekYear() - firstDate.weekYear()));
                return week_num * (circle_radius * 2 + gutter) + label_padding;
              })
              .attr('cy', function (d) {
                return moment(d.date).weekday() * (circle_radius * 2 + gutter) + label_padding;
              })
              .on('click', function (d) {
                in_transition = true;

                // Set selected date to the one clicked on
                selected_date = d;
  
                // Remove all year overview related items and labels
                removeYearOverview();
  
                // Redraw the chart
                drawChart();
              })
              .on('mouseover', function (d) {
                if ( in_transition ) { return; };
                // Pulsating animation
                var circle = d3.select(this);
                (function repeat() {
                  circle = circle.transition()
                    .duration(transition_duration)
                    .ease('ease-in')
                    .attr('r', circle_radius+1)
                    .transition()
                    .duration(transition_duration)
                    .ease('ease-in')
                    .attr('r', circle_radius)
                    .each('end', repeat);
                })();
  
                // Construct tooltip
                var tooltip_height = tooltip_padding * 4 + tooltip_line_height * d.summary.length;
                tooltip.selectAll('text').remove();
                tooltip.selectAll('rect').remove();
                tooltip.insert('rect')
                  .attr('class', 'heatmap-tooltip-background')
                  .attr('width', tooltip_width)
                  .attr('height', tooltip_height);
                tooltip.append('text')
                  .attr('font-weight', 900)
                  .attr('x', tooltip_padding)
                  .attr('y', tooltip_padding * 1.5)
                  .text((d.total ? formatTime(d.total) : 'No time') + ' tracked');
                tooltip.append('text')
                  .attr('x', tooltip_padding)
                  .attr('y', tooltip_padding * 2.5)
                  .text('on ' + moment(d.date).format('dddd, MMM Do YYYY'));
  
                // Add summary to the tooltip
                angular.forEach(d.summary, function (d, i) {
                  tooltip.append('text')
                    .style('font-weight', 900)
                    .attr('x', tooltip_padding)
                    .attr('y', tooltip_line_height * 4 + i * tooltip_line_height)
                    .text(d.name)
                    .each(function () {
                      var obj = d3.select(this),
                        textLength = obj.node().getComputedTextLength(),
                        text = obj.text();
                      while (textLength > (tooltip_width / 2 - tooltip_padding) && text.length > 0) {
                        text = text.slice(0, -1);
                        obj.text(text + '...');
                        textLength = obj.node().getComputedTextLength();
                      }
                    });
                  tooltip.append('text')
                    .attr('x', tooltip_width / 2 + tooltip_padding / 2)
                    .attr('y', tooltip_line_height * 4 + i * tooltip_line_height)
                    .text(formatTime(d.value));
                });

                var cellDate = moment(d.date);
                var week_num = cellDate.week() - firstDate.week() + (firstDate.weeksInYear() * (cellDate.weekYear() - firstDate.weekYear()));
                var x = week_num * (circle_radius * 2 + gutter) + label_padding + circle_radius;
                while ( width - x < (tooltip_width + tooltip_padding * 3) ) {
                  x -= 10;
                }
                var y = cellDate.weekday() * (circle_radius * 2 + gutter) + label_padding + circle_radius;
                while ( height - y < tooltip_height && y > label_padding/2 ) {
                  y -= 10;
                }
                tooltip.attr('transform', 'translate(' + x + ',' + y + ')');
                tooltip.transition()
                  .duration(transition_duration / 2)
                  .ease('ease-in')
                  .style('opacity', 1);
              })
              .on('mouseout', function () {
                if ( in_transition ) { return; };
  
                // Set circle radius back to what it's supposed to be
                d3.select(this).transition()
                  .duration(transition_duration / 2)
                  .ease('ease-in')
                  .attr('r', circle_radius);

                // Hide tooltip
                tooltip.transition()
                  .duration(transition_duration / 2)
                  .ease('ease-in')
                  .style('opacity', 0);
              })
              .transition()
                .delay(function () {
                  return ( in_transition ) ? transition_duration / 2: 0;
                })
                .duration(function () {
                  return Math.cos( Math.PI * Math.random() ) * transition_duration * 2;
                })
                .ease('ease-in')
                .style('opacity', 1)
                .call(function (transition, callback) {
                  if ( transition.empty() ) {
                    callback();
                  }
                  var n = 0;
                  transition
                    .each(function() { ++n; })
                    .each('end', function() {
                      if ( !--n ) {
                        callback.apply(this, arguments);
                      }
                    });
                  }, function() {
                    in_transition = false;
                  });

            // Add month labels
            var today = moment().endOf('day');
            var todayYearAgo = moment().startOf('day').subtract(1, 'year');
            var monthLabels = d3.time.months(todayYearAgo.startOf('month'), today);
            var monthLabelOffset = (width - label_padding * 2) / 12 / 2;
            var monthAxis = d3.scale.linear()
              .range([label_padding, width])
              .domain([0, monthLabels.length]);
            labels.selectAll('.label-month').remove();
            labels.selectAll('.label-month')
              .data(monthLabels)
              .enter()
              .append('text')
              .attr('class', 'label label-month')
              .style('font-size', function () {
                return Math.floor(label_padding / 2.5) + 'px';
              })
              .text(function (d) {
                return d.toLocaleDateString('en-us', {month: 'short'});
              })
              .attr('x', function (d, i) {
                return monthLabelOffset + monthAxis(i);
              })
              .attr('y', label_padding / 2)
              .on('mouseenter', function (d) {
                if ( in_transition ) { return; };
                var selectedMonth = moment(d);
                items.selectAll('.item-circle')
                  .transition()
                  .duration(transition_duration)
                  .ease('ease-in')
                  .style('opacity', function (d) {
                    return moment(d.date).isSame(selectedMonth, 'month') ? 1 : 0.1;
                  });
              })
              .on('mouseout', function () {
                if ( in_transition ) { return; };
                items.selectAll('.item-circle')
                  .transition()
                  .duration(transition_duration)
                  .ease('ease-in')
                  .style('opacity', 1);
              });

            // Add day labels
            var dayLabels = d3.time.days(moment().startOf('week'), moment().endOf('week'));
            var dayAxis = d3.scale.linear()
              .range([label_padding, height])
              .domain([0, dayLabels.length]);
            labels.selectAll('.label-day').remove();
            labels.selectAll('.label-day')
              .data(dayLabels)
              .enter()
              .append('text')
              .attr('class', 'label label-day')
              .attr('x', label_padding / 3)
              .attr('y', function (d, i) {
                return dayAxis(i);
              })
              .style('text-anchor', 'middle')
              .style('font-size', function () {
                return Math.floor(label_padding / 2.5) + 'px';
              })
              .attr('dy', function () {
                return Math.floor(width / 100) / 3;
              })
              .text(function (d) {
                return moment(d).format('dddd')[0];
              })
              .on('mouseenter', function (d) {
                if ( in_transition ) { return; };
                var selectedDay = moment(d);
                items.selectAll('.item-circle')
                  .transition()
                  .duration(transition_duration)
                  .ease('ease-in')
                  .style('opacity', function (d) {
                    return (moment(d.date).day() === selectedDay.day()) ? 1 : 0.1;
                  });
              })
              .on('mouseout', function () {
                if ( in_transition ) { return; };
                items.selectAll('.item-circle')
                  .transition()
                  .duration(transition_duration)
                  .ease('ease-in')
                  .style('opacity', 1);
              });

              $elem[0].svg = svg;

            }, delay);
          };

          /**
           * Draw day overview
           */
          function drawDayOverview(){

            $elem[0].svg = null;

            var projectLabels = selected_date.summary.map(function (project) {
              return project.name;
            });
            var projectScale = d3.scale.ordinal()
              .domain(projectLabels)
              .rangeRoundBands([label_padding, height], 0.1);
  
            var itemScale = d3.time.scale()
              .range([label_padding*2, width])
              .domain([moment(selected_date.date).startOf('day'), moment(selected_date.date).endOf('day')]);
            items.selectAll('.item-block').remove();
            items.selectAll('.item-block')
              .data(selected_date.details)
              .enter()
              .append('rect')
              .attr('class', 'item item-block')
              .attr('x', function (d) {
                return itemScale(moment(d.date));
              })
              .attr('y', function (d) {
                return projectScale(d.name)-10;
              })
              .attr('width', function (d) {
                var end = itemScale(d3.time.second.offset(moment(d.date), d.value));
                return end - itemScale(moment(d.date));
               })
              .attr('height', function () {
                return Math.min(projectScale.rangeBand(), max_block_height);
              })
              .attr('fill', function () {
                return '#3b6427';
              })
              .style('opacity', 0)
              .on('mouseover', function(d) {
                if ( in_transition ) { return; };
  
                // Construct tooltip
                var tooltip_height = tooltip_padding * 4 + tooltip_line_height;
                tooltip.selectAll('text').remove();
                tooltip.selectAll('rect').remove();
                tooltip.insert('rect')
                  .attr('class', 'heatmap-tooltip-background')
                  .attr('width', tooltip_width)
                  .attr('height', tooltip_height);
                tooltip.append('text')
                  .attr('font-weight', 900)
                  .attr('x', tooltip_padding)
                  .attr('y', tooltip_padding * 1.5)
                  .text(d.name)
                  .each(function () {
                    var obj = d3.select(this),
                      textLength = obj.node().getComputedTextLength(),
                      text = obj.text();
                    while (textLength > (tooltip_width - tooltip_padding * 2) && text.length > 0) {
                      text = text.slice(0, -1);
                      obj.text(text + '...');
                      textLength = obj.node().getComputedTextLength();
                    }
                  });
                tooltip.append('text')
                  .attr('font-weight', 900)
                  .attr('x', tooltip_padding)
                  .attr('y', tooltip_padding * 3)
                  .text((d.value ? formatTime(d.value) : 'No time') + ' tracked');
                tooltip.append('text')
                  .attr('x', tooltip_padding)
                  .attr('y', tooltip_padding * 4)
                  .text('on ' + moment(d.date).format('dddd, MMM Do YYYY HH:mm'));
  
                var x = d.value * 100 / (60 * 60 * 24) + itemScale(moment(d.date));
                while ( width - x < (tooltip_width + tooltip_padding * 3) ) {
                  x -= 10;
                }
                var y = projectScale(d.name) - 10 + projectScale.rangeBand();
                while ( height - y < tooltip_height && y > label_padding/2 ) {
                  y -= 10;
                }
                tooltip.attr('transform', 'translate(' + x + ',' + y + ')');
                tooltip.transition()
                  .duration(transition_duration / 2)
                  .ease('ease-in')
                  .style('opacity', 1);
              })
              .on('mouseout', function () {
                if ( in_transition ) { return; };
                // Hide tooltip
                tooltip.transition()
                  .duration(transition_duration / 2)
                  .ease('ease-in')
                  .style('opacity', 0);
              })
              .on('click', function (d) {
                console.log(d);
              })
              .transition()
                .delay( function () {
                  return ( in_transition ) ? transition_duration / 2 : 0;
                })
                .duration(function () {
                  return Math.cos( Math.PI * Math.random() ) * transition_duration * 2;
                })
                .duration(transition_duration)
                .ease('ease-in')
                .style('opacity', 0.5)
                .call(function (transition, callback) {
                  if ( transition.empty() ) {
                    callback();
                  }
                  var n = 0;
                  transition
                    .each(function() { ++n; })
                    .each('end', function() {
                      if ( !--n ) {
                        callback.apply(this, arguments);
                      }
                    });
                  }, function() {
                    in_transition = false;
                  });
  
            // Add time labels
            var timeLabels = d3.time.hours(moment(selected_date.date).startOf('day'), moment(selected_date.date).endOf('day'));
            var timeAxis = d3.time.scale()
              .range([label_padding*2, width])
              .domain([0, timeLabels.length]);
            labels.selectAll('.label-time').remove();
            labels.selectAll('.label-time')
              .data(timeLabels)
              .enter()
              .append('text')
              .attr('class', 'label label-time')
              .attr('font-size', function () {
                return Math.floor(label_padding / 3) + 'px';
              })
              .text(function (d) {
                return moment(d).format('HH:mm');
              })
              .attr('x', function (d, i) {
                return timeAxis(i);
              })
              .attr('y', label_padding / 2)
              .on('mouseenter', function (d) {
                if ( in_transition ) { return; };
                var selected = itemScale(moment(d));
                items.selectAll('.item-block')
                  .transition()
                  .duration(transition_duration)
                  .ease('ease-in')
                  .style('opacity', function (d) {
                    var start = itemScale(moment(d.date));
                    var end = itemScale(moment(d.date).add(d.value, 'seconds'));
                    return ( selected >= start && selected <= end ) ? 1 : 0.1;
                  });
              })
              .on('mouseout', function (time) {
                if ( in_transition ) { return; };
                items.selectAll('.item-block')
                  .transition()
                  .duration(transition_duration)
                  .ease('ease-in')
                  .style('opacity', 0.5);
              });
  
            // Add project labels
            labels.selectAll('.label-project').remove();
            labels.selectAll('.label-project')
              .data(projectLabels)
              .enter()
              .append('text')
              .attr('class', 'label label-project')
              .attr('x', gutter)
              .attr('y', function (d) {
                return projectScale(d);
              })
              .attr('min-height', function () {
                return projectScale.rangeBand();
              })
              .style('text-anchor', 'left')
              .attr('font-size', function () {
                return Math.floor(label_padding / 3) + 'px';
              })
              .attr('dy', function () {
                return Math.floor(width / 100) / 3;
              })
              .text(function (d) {
                return d;
              })
              .each(function () {
                var obj = d3.select(this),
                  textLength = obj.node().getComputedTextLength(),
                  text = obj.text();
                while (textLength > (label_padding * 1.5) && text.length > 0) {
                  text = text.slice(0, -1);
                  obj.text(text + '...');
                  textLength = obj.node().getComputedTextLength();
                }
              })
              .on('mouseenter', function (project) {
                if ( in_transition ) { return; };
                items.selectAll('.item-block')
                  .transition()
                  .duration(transition_duration)
                  .ease('ease-in')
                  .style('opacity', function (d) {
                    return (d.name === project) ? 1 : 0.1;
                  });
              })
              .on('mouseout', function () {
                if ( in_transition ) { return; };
                items.selectAll('.item-block')
                  .transition()
                  .duration(transition_duration)
                  .ease('ease-in')
                  .style('opacity', 0.5);
              });

              // Add button to switch back to year overview
              drawButton();
          };
  
  
          /**
           * Draw the button for navigation purposes
           */
          function drawButton() {
              buttons.selectAll('.button').remove();
              var button = buttons.append('g')
              .attr('class', 'button button-back')
              .style('opacity', 0)
              .on('click', function () {
                in_transition = true;
                // Unset selected date
                selected_date = undefined;
  
                // Remove all day overview related items and labels
                removeDayOverview();
  
                // Wait for transition to finish and redraw
                drawChart();
              });

              button.append('circle')
                .attr('cx', label_padding / 2.75)
                .attr('cy', label_padding / 2.5)
                .attr('r', circle_radius);
              button.append('text')
                .attr('x', label_padding / 2.75)
                .attr('y', label_padding / 2.5)
                .attr('dy', function () {
                  return Math.floor(width / 100) / 3;
                })
                .attr('font-size', function () {
                  return Math.floor(label_padding / 3) + 'px';
                })
              .html('&#x2190;');
              button.transition()
                .duration(transition_duration)
                .ease('ease-in')
                .style('opacity', 1);
          };
          
          /**
           * Transition and remove items and labels related to year overview
           */
          function removeYearOverview() {

            $elem[0].svg = null;

            items.selectAll('.item-circle')
              .transition()
              .duration(transition_duration)
              .ease('ease')
              .style('opacity', 0)
              .remove();
            tooltip.selectAll('text')
              .transition()
              .duration(transition_duration)
              .ease('ease')
              .style('opacity', 0)
              .remove();
            tooltip.selectAll('rect').remove();
            labels.selectAll('.label-day').remove();
            labels.selectAll('.label-month').remove();

            $elem[0].svg = svg;

          };
 
  
          /**
           * Transition and remove items and labels related to daily overview
           */
          function removeDayOverview() {

            $elem[0].svg = null;

            items.selectAll('.item-block')
              .transition()
              .duration(transition_duration)
              .ease('ease-in')
              .style('opacity', 0)
              .attr('x', function (d, i) {
                return ( i % 2 === 0) ? 0 : width;
              })
              .remove();
            labels.selectAll('.label-time').remove();
            labels.selectAll('.label-project').remove();
            buttons.selectAll('.button')
              .transition()
              .duration(transition_duration)
              .ease('ease')
              .style('opacity', 0)
              .remove();

            $elem[0].svg = svg;

          };
          /**
           * Helper function to convert seconds to a human readable format
           * @param seconds Integer
           */
          function formatTime(seconds) {
            var sec_num = parseInt(seconds, 10);
            var hours = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var time = '';
            if ( hours > 0 ) {
              time += hours === 1 ? '1 hour ' : hours + ' hours ';
            }
            if ( minutes > 0 ) {
              time += minutes === 1 ? '1 minute' : minutes + ' minutes';
            }
            if ( hours === 0 && minutes === 0 ) {
              time = seconds + ' seconds';
            }
            return time;
          };
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
                    console.log(e.latlng);
                });
                geolayer.addTo(trackmaps[trackmapCount]);
                geolayer.showExtremities('dotM');
                trackmaps[trackmapCount].invalidateSize();
                trackmapCount++;

            };
        });
      }
    }

}]);