const dataUrl='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

document.addEventListener('DOMContentLoaded', function() {
    fetch(dataUrl)
      .then(response => response.json())
      .then(data => {
        const jsonData = data;
        const title = jsonData.source_name;
        const dataset = jsonData.data;
        document.getElementById("title").textContent = title

        //svg
        const w = 1100;  //width variable
        const h = 500;  //height variable
        const p = 60;   //padding variable
        //x-asix
        const firstSvg = d3.select("body").append("svg").attr("width", w).attr("height", h);
      
        const x = d3.scaleTime().domain([new Date(dataset[0][0]),new Date(dataset[dataset.length - 1][0])]).range([p, w - p]);

            const axisX = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y"));

            firstSvg.append("g").attr("id", "x-axis").attr("transform", `translate(0, ${h - p})`).call(axisX).style("font-size", "10px").selectAll(".tick").attr("class", "tick");
        //y-axis
        
        const y = d3.scaleLinear().domain([0, d3.max(dataset, (d) => d[1])]).range([h - p, p]);

            const axisY = d3.axisLeft(y);

            firstSvg.append("g").attr("id", "y-axis").attr("transform", `translate(${p}, 0)`).call(axisY).style("font-size", "10px").selectAll(".tick").attr("class", "tick");
            
            //bar chart data display
            firstSvg.selectAll("rect").data(dataset).enter().append("rect").attr("class", "bar").attr("data-date", (d) => d[0]).attr("data-gdp", d => d[1]).attr("x", (d) => x(new Date(d[0]))).attr("y", (d) => y(d[1])).style("width", (w - 5 * p) / dataset.length).style("height", (d) => h - p - y(d[1]))

            //tooltip
            .on("mouseover", function (e, d){
              tooltip.style("opacity", 1).transition().duration(100).attr("data-date", d[0]).text(`${d[0]}`);
            })
            
            .on("mouseout", function (e){
              tooltip.style("opacity", 0)
            });

        const tooltip = d3.select("body").append("div").attr("id", "tooltip").style("opacity", 0).style("position", "absolute").style("background-color", "#0000FF").style("color", "#FF0000").style("padding", "10px");
  });
});