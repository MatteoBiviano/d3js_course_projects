document.addEventListener("DOMContentLoaded", () => {
  fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
      .then(response => response.json())
      .then(data => {
        const config = {
          "w": 1000,
          "h": 600,
          "padding": 50,
          "x_max_range": 950,
          "y_min_range": 550,
        }
        const dates = data.data.map(elem => {
          return new Date(elem[0])
        })

    
        const values = data.data.map(elem =>{
          return elem[1]
        })
        
        const min_dates = d3.min(dates)
        const max_dates = d3.max(dates)
        
        
        const min_values = d3.min(values)
        const max_values = d3.max(values)

        const x_scale = d3.scaleTime()
                          .domain([min_dates, max_dates])
                          .range([config["padding"], config["x_max_range"]])

        const y_scale = d3.scaleLinear()
                          .domain([0, max_values])
                          .range([config["y_min_range"], config["padding"]])
        
        const hist_values = data.data.map(elem => {
          return y_scale(elem[1])
        })        

        console.log(y_scale)
        
        const svg = d3.select("#hist")
                      .append("svg")
                      .style("height", 600)
                      .style("width", 1000)
        
        const xAxis = d3.axisBottom(x_scale)
        const yAxis = d3.axisLeft(y_scale)        
        
        let onover = d3.select("body")
                       .append("div")
                       .attr("id", "tooltip")
                       .style("opacity", 0)
                       .style("display", "flex")
                       .style("background-color", "white")
                       .style("border-radius", "5px")
                       .style("border", "1px solid black")
                       .style("height", "70px")
                       .style("width", "150px")
                       .style("flex-direction", "column")
                       .style("align-items", "center")
                       .style("display", "flex")
                       .style("text-align", "center")
                       .style("position", "absolute")
        
        svg.append("g")
           .attr("id", "x-axis")
           .attr("transform", "translate(0,"+ (config["y_min_range"]) +")")
           .call(xAxis)

        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", "translate("+ config["padding"] +",0)")
            .call(yAxis)
       
        svg.selectAll("rect")
          .data(hist_values)         
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("data-date", (d,i) => data.data[i][0])
          .attr("data-gdp", (d,i) => data.data[i][1])
          .attr("width", config["w"]/data.data.length)
          .attr("y", (d) => d)
          .attr("height", (d) => 600 - d - 50 )
          .attr("x", (d, i) => x_scale(dates[i]))
          .on("mouseover", (d, i) =>{
            onover.transition()
                  .duration(100)
                  .style("opacity", .5)
            onover.style("left", d3.event.pageX - 100 + "px")
                  .style("top", config["h"] - 100 + "px")
                  .html("<pre> Date: " +  dates[i].toLocaleDateString() + "<\pre> Value: " + data.data[i][1])
                  .attr("data-date", data.data[i][0])
                  .attr("data-gdp", data.data[i][1])
          })
         .on("mouseout", (d,i) =>{
          onover.transition()
                .duration(100)
                .style("opacity", 0)
        })
        
	    })
});
