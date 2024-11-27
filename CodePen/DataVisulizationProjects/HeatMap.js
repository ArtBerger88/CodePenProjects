const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

const req = new XMLHttpRequest();


dataValues = [];

let x
let y

const w = 1000;
const h = 500;
const p = 60;

const thirdSvg = d3.select("svg");

const tooltip = d3.select("#tooltip");

const canvas = () => {
    thirdSvg.attr("width", w).attr("height", h)
}

let scales = () => {
    xScale = d3.scaleLinear().domain([d3.min(dataValues, (item) => {return item["year"] -1}), d3.max(dataValues, (item) => {return item["year"] +1})]).range([p, w - p])
    yScale = d3.scaleTime().domain([new Date(0,0,0,0,0,0,0), new Date(0,12,0,0,0,0,0)]).range([p, h - p])
}

let dataPoints = () => {
    thirdSvg.selectAll("rect").data(dataValues).enter().append("rect").attr("class", "cell")
    //color each cell according to temp
    .attr("fill", (item) => {
        if(item["variance"] <= -1){return "darkblue";}
        else if (item["variance"] <= 0){return "blue";}
        else if (item["variance"] <= 1){return "yellow";}
        else {return "orange";}
    })
    .attr("data-year", (item) => {return item["year"]}).attr("data-month", (item) => {return item["month"] -1}).attr("data-temp", (item) => {return baseTemp + item["variance"]}).attr("height", (h - (2 * p)) / 12).attr('y', (item => {return yScale(new Date(0, item["month"] - 1,0,0,0,0,0))})).attr("x", (item => {return xScale(item["year"])})).attr("width", 4.1)
    //tooltip
    .on("mouseover", (event, d) => {tooltip.transition().style("visibility", "visible")
        tooltip.text("Year:" + d["year"] + " - Month:" + d["month"] + " - Variance:" + d["variance"])
        .attr("data-year", d["year"])
    })
    .on("mouseout", (item) => {tooltip.transition().style("visibility", "hidden")})
    
}


let drawAxis = () => {
    let axisX = d3.axisBottom(xScale).tickFormat(d3.format("d"))
    thirdSvg.append("g").call(axisX).attr("id", "x-axis").attr("transform", "translate(0," + (h - p) + ")")
    let axisY = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"))
    thirdSvg.append("g").call(axisY).attr("id", "y-axis").attr("transform", "translate(" + p + ",0)")
}


req.open("GET", dataUrl ,true);
req.send();
req.onload = function(){
    data = JSON.parse(req.responseText);
    baseTemp = data["baseTemperature"]
    dataValues = data["monthlyVariance"]
    console.log(data)
    console.log(baseTemp)
    console.log(dataValues)
    canvas()
    scales()
    dataPoints()
    drawAxis()
}