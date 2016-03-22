angular.module('myApp',['ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'angularRangeSlider',
  'gridster'])
.directive('chordGraph', function ($http) {

	var delay=350;

	            	console.log("chord");

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

        	function createChordGraph () {

        		            	console.log($elem);


        		setTimeout(function() { 

        			$elem[0].svg = null;

	        		var chord = d3.layout.chord()
				    .padding(.05)
				    .sortSubgroups(d3.descending)
				    .matrix(matrix);

				    var margin = {top: 20, right: 20, bottom: 50, left: 50},
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
					    .on("mouseout", fade(1));

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
					  };
					}

				}, delay);

        	}


   		}

   	};

});