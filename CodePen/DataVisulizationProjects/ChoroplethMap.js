const educationUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
const countyUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

const edReq = new XMLHttpRequest();
const coReq = new XMLHttpRequest();

let topoCounty;
let edData;

const w = 1000;
const h = 600;
const p = 60;

const fourthSvg = d3.select("#fourthSvg");

const tooltip = d3.select("#tooltip");

const canvas = () => {
    fourthSvg.attr("width", w).attr("height", h)
}

let firstMap = () => {
    fourthSvg.selectAll("path").data(topoCounty).enter().append("path").attr("d", d3.geoPath()).attr("class", "county")
    //colors
    .attr("fill", (topoCountyItem) => {
        let id = topoCountyItem["id"]
        let county = edData.find((item) => {return item["fips"] === id})
        let percent = county["bachelorsOrHigher"]
        if(percent <= 15){return "red"
        }else if(percent <= 30){return "orange"
        }else if(percent <= 45){return "blue"
        }else{return "green"}
    })
    .attr("data-fips", (topoCountyItem) => {
        return topoCountyItem["id"]
    })
    .attr("data-education", (topoCountyItem) => {
        let id = topoCountyItem["id"]
        let county = edData.find((item) => {return item["fips"] === id})
        let percent = county["bachelorsOrHigher"]
        return percent
    })
    //tooltip
    .on("mouseover", (event, topoCountyItem) => {
        tooltip.transition().style("visibility", "visible")
        if (edData) {
            let id = topoCountyItem["id"]
            let county = edData.find((item) => {return item["fips"] === id})
            if (county) {
                tooltip.text("Fips: " + county['fips'] + " - County: " + county["area_name"] + " - State: " + county["state"] + " - Percentage w/ Degree: " + county["bachelorsOrHigher"] + "%")
                tooltip.attr("data-education", county["bachelorsOrHigher"])
            } else {
                console.log("No matching county found")
            }
        } else {
            console.log("edData is not yet populated")
        }
    })
    .on("mouseout", (item) => {tooltip.transition().style("visibility", "hidden")})
}


edReq.open("GET", educationUrl ,true);
coReq.open("GET", countyUrl, true);
edReq.send();
coReq.send();

coReq.onload = function(){
    coData = JSON.parse(coReq.responseText);
    //Takes coData array(json parsed) from url data, makes it topograpgy data, selecting specifically the features array from the county data objects.counties
    topoCounty = topojson.feature(coData, coData.objects.counties).features
    console.log(topoCounty)
    if(edData){canvas()
    firstMap()
    }
}
edReq.onload = function(){
    edData = JSON.parse(edReq.responseText);
    console.log(edData)
        if(topoCounty){firstMap()
        }  
}
    
    
