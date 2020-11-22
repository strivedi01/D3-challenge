// @TODO: YOUR CODE HERE

function makeResponsive() {

    var svgWidth = 960;
    var svgHeight = 500;
    
    var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left:100
    };
    
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    
    // Create the SVG wrapper, then append the svg group with its size attributes
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    //Import Data from data.csv file
    d3.csv("assets/data/data.csv")
        .then(function(riskData){
            console.log(riskData);

    //Get data from data.csv file and turn strings into integers if needed
        riskData.forEach(function(data) {
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
            data.abbr = data.abbr;
            data.income = +data.income;
        });
       // console.log(riskData);

    //Create scales for X and Y
        var xLinearScale = d3.scaleLinear()
            .domain([8.5, d3.max(riskData, d => d.poverty)])
            .range([0, width]);
    
        var yLinearScale = d3.scaleLinear()
            .domain([3.5, d3.max(riskData, d => d.healthcare)])
            .range([height, 0]);
    
    
    //Create axis
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale);
    
    //Append axis to the chartGroup
        chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    
        chartGroup.append("g")
        .call(yAxis);
        
    //Make Circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(riskData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", 10)
            .attr("fill", "lightblue")
            .attr("opacity", ".6")
            .attr("stroke-width", "1")
            .attr("stroke", "black")
            .on("mouseover", function(data, index) {
                toolTip.show(data,this);

              d3.select(this).style("stroke","#323232")
              .style("stroke-width","10")
              })
              .on("mouseout", function(data, index) {
                  toolTip.hide(data,this)
               d3.select(this).style("stroke","#e3e3e3");
              });
            chartGroup.select("g")
            .selectAll("circle")
            .data(riskData)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare))
            .attr("dy",-395)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "black");
                     
         
            // console.log(riskData);
            
            var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -20])
            .html(function(d) {
             return (`${d.state}<br>poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);
            });
            chartGroup.call(toolTip)
            
            //Make labels for the healthrisk graph
    
        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - 50)
          .attr("x", 0 -250)
          .attr("dy", "1em")
          .attr("class", "axisText")
          .text("Lacks Healthcare (%)");
    
        chartGroup.append("text")
          .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 25})`)
          .attr("class", "axisText")
          .text("In Poverty (%)");
    
    
    
    });
}    
    makeResponsive();