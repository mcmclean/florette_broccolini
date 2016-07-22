// see: http://bl.ocks.org/ameyms/9184728
var D3WRAP = { REVISION: '1' };

// Zoomable Sunburst Object
D3WRAP.ZoomableSunburst = function(container, params, height, fileString) {
	this.container = container;
	this.params = params;
	var self = this;
    
    var width = height,
        height = height,
        radius = Math.min(width, height) / 2.2;
		
	var filepath = "data/flare_" + fileString + ".json";

    var x = d3.scale.linear()
        .range([0, 2 * Math.PI]);

    var y = d3.scale.linear()
        .range([0, radius]);

    var color = d3.scale.category20c();

    var svg = d3.select(container).append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

    var partition = d3.layout.partition()
        .value(function(d) { return d.size; });

    var arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });
    
    d3.json(filepath, function(error, root) {
        var g = svg.selectAll("g")
            .data(partition.nodes(root))
          .enter().append("g");

        var path = g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { 
                    //return color((d.children ? d : d.parent).name);
                    switch(d.name){
                        case "Grains":
                            return "#E4BF84";
                            break;
                        case "Vegetables":
                            return "#6AB66A";
                            break;
                        case "Fruits":
                            return "#5B7695";
                            break;
                        case "Protein":
                            return "#E48484";
                            break;
                        case "Dairy":
                            return "#ECEAD2";
                            break;
                        default:
                            return color(d.name);
                            break;
                    }
                })
            .style()
            .on("click", click);

        var text = g.append("text")
            .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
            .attr("x", function(d) { return y(d.y); })
            .attr("dx", "6") // margin
            .attr("dy", ".35em") // vertical-align
            .text(function(d) { return d.name.substring(0, params.strLength);})
            .style("font-size", "10px")
            .style("font-family", "Arial", "sans-serif")
            //.style("fill", "#FFFAD2");

        function click(d) {
            // fade out all text elements
            text.transition().attr("opacity", 0);

            path.transition()
              .duration(750)
              .attrTween("d", arcTween(d))
              .each("end", function(e, i) {
                  // check if the animated element's data e lies within the visible angle span given in d
                  if (e.x >= d.x && e.x < (d.x + d.dx)) {
                    // get a selection of the associated text element
                    var arcText = d3.select(this.parentNode).select("text");
                    // fade in the text element and recalculate positions
                    arcText.transition().duration(750)
                      .attr("opacity", 1)
                      .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
                      .attr("x", function(d) { return y(d.y); });
                  }
            });
        }
    });

    d3.select(container.frameElement).style("height", height + "px");

    // Interpolate the scales!
    function arcTween(d) {
      var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
          yd = d3.interpolate(y.domain(), [d.y, 1]),
          yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
      return function(d, i) {
        return i
            ? function(t) { return arc(d); }
            : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
      };
    }

    function computeTextRotation(d) {
      return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
    }
}
    
D3WRAP.ZoomableSunburst.prototype = Object.create(Object.prototype);
D3WRAP.ZoomableSunburst.prototype.constructor = D3WRAP.ZoomableSunburst;


D3WRAP.NeedleGauge = function(container, params) {
	this.container = container;
	this.params = params;
	this.el = d3.select(container);
}
D3WRAP.NeedleGauge.prototype = Object.create(Object.prototype);
D3WRAP.NeedleGauge.prototype.constructor = D3WRAP.NeedleGauge;
D3WRAP.NeedleGauge.prototype.setvalue = function (value) {
	this.value = value;
}