    var D3WRAP2 = { REVISION: '1' };

D3WRAP2.HorizontalBar = function(container, dataset) {
    this.container = container;
	//this.dataset = dataset;
    //this.params = params;
	var self = this;
	var stringval = dataset.split(",");
	
    var data = stringval;
    
    var width = 525,
        barHeight = 15;

    var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, 350]);

    var svg = d3.select(container).append("svg")
        .attr("width", width)
        .attr("height", barHeight * data.length);
		
	svg.append("text")
		.attr("x", 425)
        .attr("y", 10)
		.attr("font-size", "13px") 
		.style({fill: "black", font: "Arial"})
		.text("Calories");
		
	svg.append("text")
		.attr("x", 425)
        .attr("y", 25)
		.attr("font-size", "13px") 
		.style({fill: "black", font: "Arial"})
		.text("Saturated Fat");
		
	svg.append("text")
		.attr("x", 425)
        .attr("y", 40)
		.attr("font-size", "13px") 
		.style({fill: "black", font: "Arial"})
		.text("Sugar");

    var bar = svg.selectAll("g")
        .data(data)
		.enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    bar.append("rect")
        .attr("width", x)
        .attr("height", barHeight - 1)
        .style("fill", function(x) {
            if (x < 0.85) {
                return "#81D036";
            } else if (x >= 0.85 && x < 1.15) {
                return "#E8C53C";
            } else {
                return "#E84D3C";
            }    
        });
    bar.append("text")
        .attr("x", function(d) { 
            if (d < 1) {
                return x(d) - 37;
            } else if (d > 1 && d <= 1.15) {
                return x(d) - 47; 
            } else {
                return x(d) - 57;
            }
        })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .style({fill: "white", font: "Arial"})
        .text(function(d) { 
            if (d <= 1.15) {
                return Math.round(d*100) + '%';
            } else {
                return 'OVER!';
            }
        });
		
}

D3WRAP2.HorizontalBar.prototype = Object.create(Object.prototype);
D3WRAP2.HorizontalBar.prototype.constructor = D3WRAP2.HorizontalBar;


D3WRAP2.NeedleGauge = function(container, params) {
	this.container = container;
	this.params = params;
	this.el = d3.select(container);
}
D3WRAP2.NeedleGauge.prototype = Object.create(Object.prototype);
D3WRAP2.NeedleGauge.prototype.constructor = D3WRAP2.NeedleGauge;
D3WRAP2.NeedleGauge.prototype.setvalue = function (value) {
	this.value = value;
}