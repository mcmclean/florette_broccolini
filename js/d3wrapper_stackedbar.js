var D3WRAP1 = { REVISION: '1' };

D3WRAP1.StackedBar = function(container, buttonval) {
    this.container = container;
	//this.dataset = dataset;
    //this.params = params;
	var self = this;
	
	var file_path = "data/" + buttonval + ".csv";
    
    var margin = {top: 10, right: 20, bottom: 30, left: 60},
        width = 575 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width-75], .35);
    var y = d3.scale.linear()
        .rangeRound([height, 0]);
    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
    var svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    d3.csv(file_path, function(error, data) {
      if (error) throw error;
      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "FoodGroup"; }));
      data.forEach(function(d) {
        var y0 = 0;
        d.meals = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
        d.total = d.meals[d.meals.length - 1].y1;
      });
      //data.sort(function(a, b) { return b.total - a.total; });
      x.domain(data.map(function(d) { return d.FoodGroup; }));
      y.domain([0, 6]);
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .style("font-size", "14px")
          .style("font-family", "Arial", "sans-serif")
          .text("Servings");
      var meal = svg.selectAll(".meal")
          .data(data)
        .enter().append("g")
          .attr("class", "g")
          .attr("transform", function(d) { return "translate(" + x(d.FoodGroup) + ",0)"; })
      meal.selectAll("rect")
          .data(function(d) { return d.meals; })
        .enter().append("rect")
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.y1); })
          .attr("height", function(d) { return y(d.y0) - y(d.y1); })
          .style("fill", function(d) { return color(d.name); });
      svg.append("line")
          .style("stroke", "#E4BF84")
          .style({"stroke-width":5})
          .attr("x1", x("Grains"))
          .attr("y1", y(5))
          .attr("x2", x("Grains") + x.rangeBand())
          .attr("y2", y(5));
      svg.append("line")
          .style("stroke", "#6AB66A")
          .style({"stroke-width":5})
          .attr("x1", x("Vegetables"))
          .attr("y1", y(2))
          .attr("x2", x("Vegetables") + x.rangeBand())
          .attr("y2", y(2));
      svg.append("line")
          .style("stroke", "#5B7695")
          .style({"stroke-width":5})
          .attr("x1", x("Fruits"))
          .attr("y1", y(1.5))
          .attr("x2", x("Fruits") + x.rangeBand())
          .attr("y2", y(1.5));
      svg.append("line")
          .style("stroke", "#E48484")
          .style({"stroke-width":5})
          .attr("x1", x("Protein"))
          .attr("y1", y(5))
          .attr("x2", x("Protein") + x.rangeBand())
          .attr("y2", y(5));
      svg.append("line")
          .style("stroke", "#ECEAD2")
          .style({"stroke-width":5})
          .attr("x1", x("Dairy"))
          .attr("y1", y(2.5))
          .attr("x2", x("Dairy") + x.rangeBand())
          .attr("y2", y(2.5));
      var legend = svg.selectAll(".legend")
          .data(color.domain().slice().reverse())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
      legend.append("rect")
          .attr("x", width - 16)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);
      legend.append("text")
          .attr("x", width - 22)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .style("font-size", "14px")
          .style("font-family", "Arial", "sans-serif")
          .text(function(d) { return d; });
    });
}

D3WRAP1.StackedBar.prototype = Object.create(Object.prototype);
D3WRAP1.StackedBar.prototype.constructor = D3WRAP1.StackedBar;


D3WRAP1.NeedleGauge = function(container, params) {
	this.container = container;
	this.params = params;
	this.el = d3.select(container);
}
D3WRAP1.NeedleGauge.prototype = Object.create(Object.prototype);
D3WRAP1.NeedleGauge.prototype.constructor = D3WRAP1.NeedleGauge;
D3WRAP1.NeedleGauge.prototype.setvalue = function (value) {
	this.value = value;
}