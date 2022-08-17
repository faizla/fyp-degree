var color = d3.scaleOrdinal(d3.schemeCategory10);

const geoData = [];

  const width = 1100,
      height = 600,
      translate = [width / 2, height / 2];
  const projection = d3.geoEquirectangular()
        .scale(175)
        .translate(translate);
  const startPingRadius = 5,
      endPingRadius = 30,
      pingThickness = 2;
  const arc = d3.arc()
        .innerRadius(startPingRadius - pingThickness)
        .outerRadius(startPingRadius);
       
  const svgMap = d3.select('#map')
          .append("svg")
          .attr("width", width)
          .attr("height", height);

  const path = d3.geoPath().projection(projection);

  
  d3.json("https://raw.githubusercontent.com/UsabilityEtc/d3-twitter-geo-stream/master/data/world-50m.json").then(function( world) {        
      svgMap.append("path")
        .datum(topojson.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path);

      svgMap.append("path")
        .datum(topojson.mesh(world, world.objects.countries))
        .attr("class", "boundary")
        .attr("d", path);

        updateDots();

    });

 
 
  function updateDots() {
    if (!svgMap) return;

    // enter
    svgMap.selectAll("circle")
      .data(geoData)
      .enter()
        .append("circle")
        .classed("point", true)
        .attr("r", 3)
        .each(function(d) {
          radarPing(d);
        });

    // update
    svgMap.selectAll("circle.point")
      .data(geoData)
        .attr("cx", function(d) {
          return projection(d.coordinates)[0];
        })
        .attr("cy", function(d) {
          return projection(d.coordinates)[1];
        })
        .attr("fill", countryFill);
  }

  function countryFill(d) {
 
    return color(d.countryCode);
  }

  // Based on the ripples function in
  // https://github.com/NickQiZhu/d3-cookbook/blob/master/src/chapter10/touch.html
  function radarPing(d) {
    var p = projection(d.coordinates);
    var x = p[0];
    var y = p[1];
    for (var i = 1; i < 5; i += 1) {
      svgMap.append("circle")
          .classed("radar-ping", true)
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", startPingRadius - (pingThickness / 2))
          .style("stroke-width", pingThickness / i)
          .style('stroke', countryFill(d))
        .transition()
          .delay(Math.pow(i, 2.5) * 50)
          .duration(1000).ease(d3.easeQuadIn)
          .attr("r", endPingRadius)
          .style("stroke-opacity", 0)
          .style('stroke', countryFill(d))
          .on("end", function() {
              d3.select(this).remove();
          });
    }
  }

  // return {
  //   addGeoData: addGeoData
  // };


function addGeoData(data){
  geoData.push({
          "coordinates": data});
    updateDots();
}
