DonutChart = function(_parentElement, _variable){
	this.parentElement = _parentElement;
	this.variable = _variable;
	this.initVis();
};

DonutChart.prototype.initVis = function(){
	var vis = this;

	vis.margin = { left:40, right:100, top:40, bottom:10 };
	vis.width = 350 - vis.margin.left - vis.margin.right;
	vis.height = 140 - vis.margin.top - vis.margin.bottom;
	vis.radius = Math.min(vis.width, vis.height) / 2;

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom + 50);
    
    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + (vis.margin.left + (vis.width / 2) - 50) + 
            ", " + (vis.margin.top + (vis.height / 2)) + ")");

	vis.pie = d3.pie()
        .sort(null)
		.value((d) => { return d.count; });
		

	vis.arc = d3.arc()
		.innerRadius(vis.radius - 15)
		.outerRadius(vis.radius);

    vis.g.append("text")
        .attr("class", "title")
        .attr("y", -60)
        .attr("x", -90)
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
        .text("Sentiment Donut")

    vis.color = d3.scaleOrdinal(['#b3cde3','#fbb4ae']);

    vis.addLegend();
	vis.wrangleData();
}

DonutChart.prototype.wrangleData = function(){
	var vis = this;
    
    
	sizeNest = d3.nest()
		.key(function(d){
			return d.tweet_sentiment
		})
		.entries(calls)
    vis.dataFiltered = sizeNest.map(function(size){
        return {
            value: size.key,
            count: size.values.length
        }
    })

    

    //Push dummy data contain zero to ease visualization
    if (vis.dataFiltered.length ==1){
        if (vis.dataFiltered[0]['value'] == 0){
           vis.dataFiltered=vis.dataFiltered.concat({value:"1",count:0})
        }
        else if (vis.dataFiltered[0]['value'] == 1){
            vis.dataFiltered=vis.dataFiltered.concat({value:"0",count:0})
        }
    }
    if (vis.dataFiltered.length != 0){
        if (vis.dataFiltered[0]['value'] == 0){
            vis.dataFiltered.reverse();
        }
    }
	vis.updateVis();
}

DonutChart.prototype.updateVis = function(){
	var vis = this;

	vis.path = vis.g.selectAll("path")
		.data(vis.pie(vis.dataFiltered));

	vis.path.attr("class", "update arc")
		.transition()
	        .duration(750)
	        .attrTween("d", arcTween);

	vis.path.enter().append("path") 
		.attr("class", "enter arc")
		.attr("fill", (d) => { return vis.color(d.data.value); })
			.transition()
	        .duration(750)
	        .attrTween("d", arcTween);

	// Only want to attach this once!
	d3.selectAll(".enter.arc")
		.append("title")
		.text(function(d) { return d.data.count; })

	function arcTween(d) {
		var i = d3.interpolate(this._current, d);
		this._current = i(0);
		return function(t) { return vis.arc(i(t)); };
	}

}

DonutChart.prototype.addLegend = function(){
	var vis = this;

    var legend = vis.g.append("g")
        .attr("transform", "translate(" + (150) + 
                    ", " + (-30) + ")");

    var legendArray = [
    	{label: "Positive", color: vis.color("1")},
    	{label: "Negative", color: vis.color("0")},
	]

    var legendRow = legend.selectAll(".legendRow")
        .data(legendArray)
        .enter().append("g")
            .attr("class", "legendRow")
            .attr("transform", (d, i) => {
                return "translate(" + 0 + ", " + (i * 20) + ")"
            });
        
    legendRow.append("rect")
        .attr("class", "legendRect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", d => { return d.color; });

    legendRow.append("text")
        .attr("class", "legendText")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .text(d => { return d.label; }); 
}