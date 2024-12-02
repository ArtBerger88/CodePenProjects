const dataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"

const req = new XMLHttpRequest();

let dataValues = [];
let gameData;

const w = 1000;
const h = 800;
const p = 50;
const w1 = 500;
const h1 = 200;


const svg = d3.select("#fifthSvg").attr("width", w).attr("height", h);
const svgLegend = d3.select("#legend").attr("width", w1).attr("height", h1);
const tooltip = d3.select("#tooltip");

const colors = [
    "#8B9467",
    "#FF99CC",
    "#663300",
    "#CCCC00",
    "#336699",
    "#CC3366",
    "#999999",
    "#33CC33",
    "#666699",
    "#CC6633",
    "#3399CC",
    "#996633",
    "#33CCCC",
    "#663366",
    "#CCCC66",
    "#666633",
    "#4488CC",
    "#FF77aa"
  ];
    
const treemap = () => {
        let hierarchy = d3.hierarchy(gameData, (node) => {
        return node["children"]
    }).sum((node) => {
        return node["value"]
    }).sort((node1, node2) => {
        return node2["value"] - node1["value"]
    })

    let makeTreemap = d3.treemap().size([1000,800])

    makeTreemap(hierarchy)

    console.log(hierarchy.leaves())

    let rectangle = svg.selectAll("g").data(hierarchy.leaves()).enter().append("g")
    .attr("transform", (game)=> {
        return "translate(" + game["x0"] + ", " + game["y0"] + ")"
    })

    rectangle.append("rect").attr("class", "tile")
    .attr("fill", (game) => {
        let category = game["data"]["category"]
        if (category === "2600"){
            return colors[0]
        }else if(category === "Wii") {
            return colors[1]
        }else if(category === "NES") {
            return colors[2]
        }else if(category === "GB") {
            return colors[3]
        }else if(category === "DS") {
            return colors[4]
        }else if(category === "X360") {
            return colors[5]
        }else if(category === "PS3") {
            return colors[6]
        }else if(category === "PS2") {
            return colors[7]
        }else if(category === "SNES") {
            return colors[8]
        }else if(category === "GBA") {
            return colors[9]
        }else if(category === "PS4") {
            return colors[10]
        }else if(category === "3DS") {
            return colors[11]
        }else if(category === "N64") {
            return colors[12]
        }else if(category === "PS") {
            return colors[13]
        }else if(category === "XB") {
            return colors[14]
        }else if(category === "PC") {
            return colors[15]
        }else if(category === "PSP") {
            return colors[16]
        }else if(category === "XOne") {
            return colors[17]
        }
    })
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .attr("width", (game) => {
        return game['x1'] - game['x0']
    })
    .attr("height", (game) => {
        return game['y1'] - game['y0']
    })
    .attr("style", "outline: thin solid black;")
    rectangle.append("text").attr("x", 0).attr("y",20).attr("font-size", 12)
    .each(function(d) {
        
        const words = d.data.name.split(" ");
        const tspanElements = d3.select(this).selectAll("tspan")
          .data(words)
          .enter()
          .append("tspan")
          .attr("x", 0)
          .attr("y", (d, i) => 10 + (i * 10))
          .text(d => d);
      });
}

let tooltipDisplay = () => {
    svg.on("mouseover", (event) => {
        const gameData = d3.select(event.target).datum();
        
        tooltip.transition().style("visibility", "visible")
        tooltip.attr("data-value", gameData.value)
        tooltip.style("white-space", "pre-wrap")
        if (gameData.data && gameData.data.name) {
            tooltip.html(`<tspan x ="10" y="20"> Name: ${gameData.data.name} </tspan>
               <tspan x ="10" y="40"> Category: ${gameData.data.category}</tspan>
               <tspan x ="10" y="60">Value: ${gameData.data.value}</tspan>`);
          } else {
            tooltip.text("No data available");
          }
 
    })
        
    .on("mouseout", (item) => {tooltip.transition().style("visibility", "hidden")})
    
}

req.open("GET", dataUrl, true);
req.send();
req.onload = function(){
    data = JSON.parse(req.responseText);
    gameData = data
    dataValues = data.children
    treemap()
    tooltipDisplay()
}