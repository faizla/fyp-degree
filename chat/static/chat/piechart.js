const pie = { height: 300, width: 300, radius: 150 };
const cent = { x: (pie.width / 2 + 5), y: (pie.height / 2 + 5)};

// create svg container
const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', pie.width + 150)
  .attr('height', pie.height + 95);


// translates the graph group to the middle of the svg container
const graph = svg.append('g')
  .attr("transform", `translate(${cent.x}, ${cent.y})`);
// the value we are evaluating to create the pie angles
const pieAngles = d3.pie()
  .sort(null)
  .value(d => d.cost);
// initialize the arc for every slice
const arcPath = d3.arc()
  .outerRadius(pie.radius)
  .innerRadius(pie.radius / 2)
  .padAngle(0.05);


// ordianl colour scale
const colour = d3.scaleOrdinal(["#00B500","#E74C3C"]);


// legend setup
const legendGroup = svg.append('g')
  .attr('transform', `translate(${cent.x},${pie.height + 40})`)
const legend = d3.legendColor()
  .shape('path', d3.symbol().type(d3.symbolCircle)())
  .shapePadding(10)
  .scale(colour)





const tip = d3.tip()
	.attr('class', 'tip card')
	.html(d => {
	  let content = `<div class="name">${d.data.name}</div>`;
	  content += `<div class="cost">${d.data.cost}</div>`;
	  content += `<div class="delete">Click to show list of ...</div>`
	  return content;
	});

graph.call(tip);


// update function
const updatePie = (data) => {

	// console.log(data);

	colour.domain(data.map(d => d.name));

	// update legend
	legendGroup.call(legend);
	legendGroup.selectAll('text').attr('fill', 'grey');

	// join pie data to path elements
	const paths = graph.selectAll('path')
		.data(pieAngles(data));

	// console.log(pieAngles(data));
	// console.log(arcPath(pieAngles(data)));

	// handle the exit selection to remove shape that contained removed data
	paths.exit()
	.transition().duration(750)
		.attrTween('d',arcTweenExit)
		.remove();

	// handle the current DOM path updates for edited data
	paths.transition().duration(750)
    	.attrTween("d", arcTweenUpdate);

	// create the path in DOM
	paths.enter()
		.append('path')
			.attr('class', 'arc')
			.attr('stroke', '#fff')
			.attr('stroke-width', 3)
			.attr('fill', d => colour(d.data.name))
			.each(function(d){ this._current = d})
			.transition().duration(750).attrTween("d", arcTweenEnter);

	// add events
	graph.selectAll('path')
    .on('mouseover', (d,i,n) => {
      tip.show(d, n[i]);
      handleMouseOver(d, i, n);
    })
    .on('mouseout', (d,i,n) => {
      tip.hide();
      handleMouseOut(d, i, n);
    })
    .on('click', handleClick);

    //////GUNA BILA ADA SATU EVENT JE
  	// graph.selectAll('path')
    //  .on('mouseover', handleMouseOver)
    //  .on('mouseout', handleMouseOut);

};


const arcTweenEnter = (d) => {
	var i = d3.interpolate(d.endAngle-0.1, d.startAngle);

	return function(t) {
	  d.startAngle = i(t);
	  return arcPath(d);
	};
};

const arcTweenExit = (d) => {
  var i = d3.interpolate(d.startAngle, d.endAngle);

  return function(t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

// use function keyword to allow use of 'this'
function arcTweenUpdate(d) {
  // interpolate between the two objects
  var i = d3.interpolate(this._current, d);
  // update the current prop with new updated data
  this._current = i(1);

  return function(t) {
    // i(t) returns a value of d (data object) which we pass to arcPath
    return arcPath(i(t));
  };
};

// event handlers
const handleMouseOver = (d,i,n) => {
  //console.log(n[i]); another alternative for 'this' method
  d3.select(n[i])
    .transition('changeSliceFill').duration(300)
      .attr('fill', colour(d.data.name))
      .attr('stroke', '#fff')
      .attr('stroke-width', 10);
};

const handleMouseOut = (d,i,n) => {
  d3.select(n[i])
    .transition('changeSliceFill').duration(300)
      .attr('fill', colour(d.data.name))
      .attr('stroke', '#fff')
      .attr('stroke-width', 3);
};

const handleClick = (d) => {
  
};

var int=setInterval(test, 1000);
function test(){
	updatePie(dataPie);
}




