MentionStackedChart = function(_parentElement){

    //#timeline
    this.parentElement = _parentElement;

    this.initVis();
};

MentionStackedChart.prototype.initVis = function(){
    //initialization for easy referenced
    var vis = this;
    //set margin, height, width
    vis.margin = { left:80, right:100, top:50, bottom:40 };
    vis.height = 250 - vis.margin.top - vis.margin.bottom;
    vis.width = 800 - vis.margin.left - vis.margin.right;

    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)

    vis.t = () => { return d3.transition().duration(1000); }

    vis.g = vis.svg.append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.x = d3.scaleTime()
        .range([0, vis.width]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    

    vis.yAxisCall = d3.axisLeft()
    vis.xAxisCall = d3.axisBottom()
        .ticks(d3.timeDay.every(1));
    vis.xAxis = vis.g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + vis.height +")");
    vis.yAxis = vis.g.append("g")
        .attr("class", "y axis");

    vis.areaPath = vis.g.append("path")
        .attr("fill", "#ccc");

    // Initialize brush component for selecting crossfilter
    

    vis.wrangleData();
};

//to distinguish the amount of tweets according to date
MentionStackedChart.prototype.wrangleData = function(){
    var vis = this;


    vis.dayNest = d3.nest()
        .key(function(d){ return formatTime(d.date); })
        .entries(calls)
    vis.dataFiltered = vis.dayNest
        .map(function(day){
            return {
                date: day.key,
                sum: day.values.length               
            }
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
MentionStackedChart.prototype.dummyDate = function(){
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
            vis.dataFiltered=vis.dataFiltered.concat([{date:formatTime(date1.setDate(date1.getDate())),sum:0}])
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


MentionStackedChart.prototype.updateVis = function(){
    var vis = this;
    // Update scales 
    // Add another dummy object contain zero to ease the visualization
    if (vis.dataFiltered.length!=0){
        domainDate = d3.extent(vis.dataFiltered, (d) => {  return parseTime(d.date); })
        var dMin = new Date(domainDate[0])
        vis.dataFiltered=vis.dataFiltered.concat([{sum:0,date:formatTime(dMin.setDate(dMin.getDate()-1))}])
    }
    
    vis.x.domain(d3.extent(vis.dataFiltered, (d) => { return parseTime(d.date); }));
    vis.y.domain([0, d3.max(vis.dataFiltered, (d) => d.sum) ])

    vis.xAxisCall.scale(vis.x)

    vis.xAxis.transition(vis.t()).call(vis.xAxisCall)
    vis.yAxisCall.scale(vis.y);
    vis.yAxis.transition(vis.t()).call(vis.yAxisCall);
    vis.area0 = d3.area()
        .x((d) => { return vis.x(parseTime(d.date)); })
        .y0(vis.height)
        .y1(vis.height);

    vis.area = d3.area()
        .x((d) => { return vis.x(parseTime(d.date)); })
        .y0(vis.height)
        .y1((d) => { return vis.y(d.sum); })

    vis.areaPath
        .data([vis.dataFiltered])
        .attr("fill","#5DADE2")
        .attr("d", vis.area);
}