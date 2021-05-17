// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width / 3.9;

// Margin spacing for graph
var margin = 20;

// space for placing words
var labelArea = 110;

var bottomPadding = 40;
var leftPadding = 40;

// Create the actual canvas for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

var circleSize;
if (width <= 530){
  circleSize = 5;
}else{
  circleSize = 10;
}

// Import our CSV data with d3's .csv import method.
d3.csv("assets/data/data.csv").then(function(data) {
  // Visualize the data
  ShowData(data);
});

function ShowData(xData) {

  var x_column = "poverty";
  var y_column = "healthcare";

  var x_Min;
  var x_Max;
  var y_Min;
  var y_Max;


  function Get_X_MinMax() {
    x_Min = d3.min(xData, function(d) {
      return parseFloat(d[x_column]) * 0.90;
    });

    x_Max = d3.max(xData, function(d) {
      return parseFloat(d[x_column]) * 1.10;
    });
  }

  function Get_Y_MinMax() {
    y_Min = d3.min(xData, function(d) {
      return parseFloat(d[y_column]) * 0.90;
    });

    y_Max = d3.max(xData, function(d) {
      return parseFloat(d[y_column]) * 1.10;
    });
  }

  Get_X_MinMax();
  Get_Y_MinMax();

  var X_Scale = d3.scaleLinear()
    .domain([x_Min, x_Max])
    .range([margin + labelArea, width - margin]);

  var Y_Scale = d3.scaleLinear()
    .domain([y_Min, y_Max])
    .range([height - margin - labelArea, margin]);

  var x_Axis = d3.axisBottom(X_Scale);
  var y_Axis = d3.axisLeft(Y_Scale);

  function Set_Axis_Ticks() {
    if (width <= 530) {
      x_Axis.ticks(5);
      y_Axis.ticks(5);
    }
    else {
      x_Axis.ticks(10);
      y_Axis.ticks(10);
    }
  }
  Set_Axis_Ticks();

  svg
    .append("g")
    .call(x_Axis)
    .attr("class", "x_Axis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
    
  svg
    .append("g")
    .call(y_Axis)
    .attr("class", "y_Axis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  //  The Labels for our Axes
  // Bottom Axis

  svg.append("g").attr("class", "xText");
  var xText = d3.select(".xText");
  function xTextRefresh() {
    xText.attr(
      "transform",
      "translate(" +
        ((width - labelArea) / 2 + labelArea) +
        ", " +
        (height - margin ) +
        ")"
    );
  }
  //Now we use xText to append three text SVG files, with y coordinates specified to space out the values.
  // Poverty
  xTextRefresh();
  xText
  .append("text")
  .attr("y", -45)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");  

  // Left Axis
   
  var leftTextY = (height + labelArea) / 2 - labelArea;
  svg.append("g").attr("class", "yText");
  var yText = d3.select(".yText");
  function yTextRefresh() {
    yText.attr(
      "transform",
      "translate(" + margin + ", " + leftTextY + ")rotate(-90)"
    );
  }
  yTextRefresh();

// Now we append the text.
//  Healthcare
  yText
  .append("text")
  .attr("y", 36)
  .attr("data-name", "Health Care")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Lacks Healthcare (%)");

  var toolTip = d3.select("body").append("div").attr("class","tooltip");

  var Circles_Group = svg.selectAll("g Circles_Group").data(xData).enter();

  Circles_Group
    .append("circle")
    .attr("cx", function(d) {return X_Scale(d[x_column]);})
    .attr("cy", function(d) {return Y_Scale(d[y_column]);
    })
    .attr("r", circleSize)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    }); 

  Circles_Group
    .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text(function(d) {
      return d.abbr;
    })
    // Now place the text using our scale.
    .attr("dx", function(d) {return X_Scale(d[x_column]);})
    .attr("dy", function(d) {return Y_Scale(d[y_column]) + circleSize / 2.5;})
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      
    .attr("font-size", circleSize)
    .attr("class", "stateText")
    // Hover Rules
    .on("mouseover", function(d) {
      // Show the tooltip
    toolTip.style("display", "block")
           .style("opacity", "5")
          .html(
            `<strong>${d.state}<strong><br>Poverty: ${d[x_column]}%<br>Healthcare:${d[y_column]}%`)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
    toolTip.style("display", "none")
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });
}
