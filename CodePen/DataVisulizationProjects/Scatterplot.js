const dataUrl =  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

// using XMLHttpRequest to get data
const req = new XMLHttpRequest();

//array of data
let dataValues = [];

//x and y axis variables
//let x
//let y

//width, height, and padding variables
const w = 1000;
const h = 500;
const p = 60;

//svg variable
const secondSvg = d3.select("svg");
//tooltip id selection 
const tooltip = d3.select("#tooltip");

//using functions to create and render svg
const canvas = () => {
    secondSvg.attr("width", w).attr("height", h)
}

let scales = () => {
    x = d3.scaleLinear().domain([d3.min(dataValues, (item) => {return item["Year"] -1 }), d3.max(dataValues, (item =>{return item["Year"] +1}))]).range([p, w - p])
    y = d3.scaleTime().domain([d3.min(dataValues, (item) => {return new Date(item["Seconds"] * 1000)}), d3.max(dataValues, (item) => {return new Date(item["Seconds"] * 1000)})]).range([p, h - p])
}

let dataPoints = () => {
    secondSvg.selectAll("circle").data(dataValues).enter().append("circle").attr("class", "dot").attr("r", "5").attr("data-xvalue", (item) => {return item["Year"]}).attr("data-yvalue", (item) => {return new Date(item["Seconds"]*1000)}).attr("cx", (item) => {return x(item["Year"])}).attr("cy", (item) => {return y(new Date(item["Seconds"] * 1000))}).attr("fill", (item) => {if(item["Doping"] != ""){return "red"}else{return "lightgreen"}})
        .on("mouseover", (event, d) => {tooltip.transition().style("visibility", "visible")
            if(d["Doping"] != ""){tooltip.text("Name: " + d["Name"] + " - Nation: " + d["Nationality"] + " - Year: " + d["Year"] + " - Time: " + d["Time"] + " - Place: " + d["Place"] + " - Doping: " + d["Doping"])}
            else{tooltip.text("Name: " + d["Name"] + " - Nation: " + d["Nationality"] + " - Year: " + d["Year"] + " - Time: " + d["Time"] + " - Place: " + d["Place"] + " - Doping: None")}
            tooltip.attr("data-year", d["Year"])
        })
        .on("mouseout", (item) => {tooltip.transition().style("visibility", "hidden")})
}

let drawAxis = () => {
    let axisX = d3.axisBottom(x).tickFormat(d3.format("d")) //format without decimal("d")
    secondSvg.append("g").call(axisX).attr("id", "x-axis").attr("transform", "translate(0," + (h - p) + ")")
    let axisY = d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S")) //format in minutes(%M):seconds(%S)
    secondSvg.append("g").call(axisY).attr("id", "y-axis").attr("transform", "translate(" + p + ",0)")
}

req.open("GET", dataUrl ,true);
req.send();
req.onload = function(){
    dataValues = JSON.parse(req.responseText);
    console.log(dataValues)
    canvas()
    scales()
    dataPoints()
    drawAxis()
};