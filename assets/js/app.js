// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width / 3.9;

// Margin spacing for graph
var margin = 20;

//space  for placing text
var labelArea=110;


// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter").append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

  // svg.append("g")
  // .call(xAxis)
  // .attr("class","xAxis")
  // .attr("transform", "translate(0," + (height - margin - labelArea) + ")");


//  var chartGroup = svg.append("g")
//   .attr("transform", `translate(${margin}, ${margin})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(data) {
    console.log(data);
    visualize(data);

});
    // Step 1: Parse Data/Cast as numbers
    // ==============================

function visualize(theData){
  
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  var curX = "poverty";
  var curY = "obesity";


  function xMinMax() {
    // min will grab the smallest datum from the selected column.
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });

    // .max will grab the largest datum from the selected column.
    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }

  function yMinMax() {
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });

    // .max will grab the largest datum from the selected column.
    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }


  xMinMax();
  yMinMax();

  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);

  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height-margin-labelArea, margin]);
  
  
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ",0)");

    //var circlesGroup = svg.selectAll("g theCircle").data(theData).enter();

    // circlesGroup.append("circle")
    // .attr("cx", function(d) {return xScale(d["poverty"]);})
    // .attr("cy", function(d) {return yScale(d["healthcare"]);})
    // .attr("r", 10)
    // .attr("fill", "pink")
    // .attr("opacity", ".5");

    var theCircles = svg.selectAll("g theCircles").data(theData).enter();

    // We append the circles for each row of data (or each state, in this case).
    theCircles
      .append("circle")
      // These attr's specify location, size and class.
      .attr("cx", function(d) {return xScale(d[curX]);})
      .attr("cy", function(d) {return yScale(d[curY]);})
      .attr("r", 5)
      .attr("class", function(d) {return "stateCircle " + d.abbr;})
  

}


    // allData.forEach(function(data) {
    //     data.age = +data.age;
    //     data.healthcare = +data.healthcare;
    //     data.income= +data.income;
    //     data.obesity = +data.obesity;
    //     data.poverty= +data.poverty;
    //     data.smokes= +data.smokes;

      
      //console.log(data.poverty)
      


      // Step 2: Create scale functions
      // ==============================
      // var xLinearScale = d3.scaleLinear()
      //   .domain([0, d3.max(data.poverty, d => d.poverty)])
      //   .range([0, width]);
  
      // var yLinearScale = d3.scaleLinear()
      //   .domain([0, d3.max(data.healthcare, d => d.healthcare)])
      //   .range([height, 0]);
  
      // // Step 3: Create axis functions
      // // ==============================
      // var bottomAxis = d3.axisBottom(xLinearScale);
      // var leftAxis = d3.axisLeft(yLinearScale);
  
      // // Step 4: Append Axes to the chart
      // // ==============================
      // chartGroup.append("g")
      //   .attr("transform", `translate(0, ${height})`)
      //   .call(bottomAxis);
  
      // chartGroup.append("g")
      //   .call(leftAxis);
  
    //   // Step 5: Create Circles
    //   // ==============================
    //   var circlesGroup = chartGroup.selectAll("circle")
    //   .data(hairData)
    //   .enter()
    //   .append("circle")
    //   .attr("cx", d => xLinearScale(d.hair_length))
    //   .attr("cy", d => yLinearScale(d.num_hits))
    //   .attr("r", "15")
    //   .attr("fill", "pink")
    //   .attr("opacity", ".5");
  
    //});

