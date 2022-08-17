
StackedAreaChart = function(_parentElement){
    this.parentElement = _parentElement;

    this.initVis();
};

StackedAreaChart.prototype.initVis = function(){
    var vis = this;

    vis.margin = { left:80, right:100, top:50, bottom:40 };
    vis.height = 250 - vis.margin.top - vis.margin.bottom;
    vis.width = 800 - vis.margin.left - vis.margin.right;

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);
    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + 
            ", " + vis.margin.top + ")");

    vis.t = () => { return d3.transition().duration(1000); }

    vis.color = d3.scaleOrdinal(['#b3cde3','#fbb4ae']);

    vis.x = d3.scaleTime().range([0, vis.width]);
    vis.y = d3.scaleLinear().range([vis.height, 0]);

    vis.yAxisCall = d3.axisLeft()
    vis.xAxisCall = d3.axisBottom()
        .ticks(d3.timeDay.every(1));
    vis.xAxis = vis.g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + vis.height +")");
    vis.yAxis = vis.g.append("g")
        .attr("class", "y axis");

    vis.stack = d3.stack()
        .keys(["0", "1"]);

    vis.area = d3.area()
        .x(function(d) { return vis.x(parseTime(d.data.date)); })
        .y0(function(d) { return vis.y(d[1]); })
        .y1(function(d) { return vis.y(d[0]); });  

    // vis.linePositive = d3.line()
    //     //.curve(d3.curveCardinal)
    //     .x(function(d){ return vis.x(parseTime(d.date))})
    //     .y(function(d){ return vis.y(d.positive)});
    // vis.lineNegative = d3.line()
    //     //.curve(d3.curveCardinal)
    //     .x(function(d){ return vis.x(parseTime(d.date))})
    //     .y(function(d){ return vis.y(d.negative)});

    // // line path element
    // vis.pathPositive = vis.g.append('path');
    // vis.pathNegative = vis.g.append('path');

    
    vis.addLegend();
    vis.wrangleData();
};


StackedAreaChart.prototype.wrangleData = function(){
    var vis = this;

    vis.variable = $("#var-select").val()

    vis.dayNest = d3.nest()
        .key(function(d){ return formatTime(d.date); })
        .entries(calls)

    vis.dataFiltered = vis.dayNest
        .map(function(day){
            return day.values.reduce(function(accumulator, current){
                accumulator.date = day.key
                accumulator[current.tweet_sentiment] = accumulator[current.tweet_sentiment] + 1//nombor
                return accumulator;
            }, {
                "0": 0,
                "1": 0
            })
        })
    vis.dataFiltered.sort(function(a, b) {
            a = new Date(parseTime(a.date));
            b = new Date(parseTime(b.date));

            return a>b ? -1 : a<b ? 1 : 0;
        });

    if(vis.dataFiltered.length <= 1)
    {
        vis.updateVis();
    }
    else{
        vis.dummyDate();
    }
};
StackedAreaChart.prototype.dummyDate = function(){
    var vis = this;

    var date1 = new Date(d3.extent(vis.dataFiltered, (d) => {  return parseTime(d.date); })[1]); 
    var date2 = new Date(d3.extent(vis.dataFiltered, (d) => {  return parseTime(d.date); })[0]); 
    
    // To calculate the time difference of two dates 
    var Difference_In_Time = date1.getTime() - date2.getTime(); 
      
    // To calculate the no. of days between two dates 
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 

    date1.setDate(date1.getDate()-1)
    var date3 = new Date(parseTime(vis.dataFiltered[1].date)); 
    for(var i=2; i <= Difference_In_Days ; i++){
        
        if(date1.getTime() === date3.getTime())
        {               
            
            date1.setDate(date1.getDate()-1)
            var date3 = new Date(parseTime(vis.dataFiltered[i].date)); 
        }
        else{
            vis.dataFiltered=vis.dataFiltered.concat([{date:formatTime(date1.setDate(date1.getDate())),0:0,1:0}])
            
            date1.setDate(date1.getDate()-1)

        }
    }
    vis.dataFiltered.sort(function(a, b) {
                a = new Date(parseTime(a.date));
                b = new Date(parseTime(b.date));

                return a>b ? -1 : a<b ? 1 : 0;
        });
    vis.updateVis();
};

StackedAreaChart.prototype.updateVis = function(){
    var vis = this;
    vis.maxDateVal = d3.max(vis.dataFiltered, function(d){
        var vals = d3.keys(d).map(function(key){ return key !== 'date' ? d[key] : 0 });
        return d3.sum(vals);
    });

    // Update scales 
    // Add another dummy object contain zero to ease the visualization
    if (vis.dataFiltered.length!=0){

        domainDate = d3.extent(vis.dataFiltered, (d) => {  return parseTime(d.date); })
        var dMin = new Date(domainDate[0])
        vis.dataFiltered=vis.dataFiltered.concat([{0:0,1:0,date:formatTime(dMin.setDate(dMin.getDate()-1))}])
    }
    
    

    vis.x.domain(d3.extent(vis.dataFiltered, (d) => {  return parseTime(d.date); }));
    vis.y.domain([0, vis.maxDateVal]);

    // Update axes
    vis.xAxisCall.scale(vis.x);
    vis.xAxis.transition(vis.t()).call(vis.xAxisCall);
    vis.yAxisCall.scale(vis.y);
    vis.yAxis.transition(vis.t()).call(vis.yAxisCall);

    vis.teams = vis.g.selectAll(".team")
        .data(vis.stack(vis.dataFiltered));
    // Update the path for each team
    vis.teams.select(".area")
        .attr("d", vis.area)

    vis.teams.enter().append("g")
        .attr("class", function(d){ return "team " + d.key })
        .append("path")
            .attr("class", "area")
            .attr("d", vis.area)
            .style("fill", function(d){
                return vis.color(d.key)
            })
            .style("fill-opacity", 0.5)

    // vis.pathPositive.data([vis.lineFiltered])
    //     .attr('fill', 'none')
    //     .attr('stroke', vis.color("1") )
    //     .attr('stroke-width', '2')
    //     .attr('d', vis.linePositive);
    // vis.pathNegative.data([vis.lineFiltered])
    //     .attr('fill', 'none')
    //     .attr('stroke', vis.color("0") )
    //     .attr('stroke-width', '2')
    //     .attr('d', vis.lineNegative);

};


StackedAreaChart.prototype.addLegend = function(){
    var vis = this;

    var legend = vis.g.append("g")
        .attr("transform", "translate(" + (50) + 
                    ", " + (-25) + ")");

    var legendArray = [
        {label: "Positive", color: vis.color("1")},
        {label: "Negative", color: vis.color("0")},
        
    ]

    var legendCol = legend.selectAll(".legendCol")
        .data(legendArray)
        .enter().append("g")
            .attr("class", "legendCol")
            .attr("transform", (d, i) => {
                return "translate(" + (i * 150) + ", " + (0) + ")"
            });
        
    legendCol.append("rect")
        .attr("class", "legendRect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", d => { return d.color; })
        .attr("fill-opacity", 0.5);

    legendCol.append("text")
        .attr("class", "legendText")
        .attr("x", 20)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .text(d => { return d.label; }); 
}