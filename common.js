import { updateLineChart } from "./sumit.js";
import { updateGraph } from "./vanshaj.js";
import { updateMapChart } from "./nishanthan.js";
import { updateBarGraph } from "./utkarsh.js";
import { updateRadarChart } from "./dhwanil.js";
import { updatevisual } from "./ram.js";

// var textarea = document.getElementById("sumit2_description");
// textarea.value = "Sumit 2";
//document.body.style.zoom = "50%";
// Load the JSON file using fetch
fetch('data_preprocessing/participant_education.json')
    .then((response) => response.json())
    .then((data) => {
        // Initialize counters for different education levels
        let lowCount = 0;
        let highSchoolCount = 0;
        let bachelorsCount = 0;
        let graduateCount = 0;

        // Iterate through the objects in the JSON data
        data.forEach((participant) => {
            const educationLevel = participant.educationLevel;
            if (educationLevel === 'Low') {
                lowCount++;
            } else if (educationLevel === 'HighSchoolOrCollege') {
                highSchoolCount++;
            } else if (educationLevel === 'Bachelors') {
                bachelorsCount++;
            } else if (educationLevel === 'Graduate') {
                graduateCount++;
            }
        });

        generateDonutChart([
            { type: 'Low', count: lowCount },
            { type: 'HighSchoolOrCollege', count: highSchoolCount },
            { type: 'Bachelors', count: bachelorsCount },
            { type: 'Graduate', count: graduateCount }
        ])
    })
    .catch((error) => console.error('Error loading the JSON file:', error));


function generateDonutChart(data) {
    console.log(data);
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    const xsvg = d3.select("#sumit2");
    const width = +xsvg.style("width").replace("px", '');
    const height = +xsvg.style("height").replace("px", '');
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#sumit2")
        .attr("width", width)
        .attr("height", height);
    
    svg.append("text")
    .attr("class", "allText")
    .attr("x", width / 2)
    .attr("y", 25) // Adjust the Y position as needed
    .attr("text-anchor", "middle")
    .attr("font-size", "24px") // Set the font size as needed
    .attr("font-family", "Georgia")
    .text("Education Level Distribution");

    const countGroup = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie()
        .value((d) => d.count);

    const arc = d3.arc()
        .innerRadius(radius * 0.45)
        .outerRadius(radius * 0.8);

    const arcs = svg.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => colorScale(i))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .on("mouseover", function (event, d) {
            d3.select(this)
                .attr("stroke-width", 4);
            countGroup.select("text")
                .text(d.data.type + ": " + d.data.count);
        })
        .on("mouseout", function () {
            d3.select(this)
                .attr("stroke-width", 1);
            countGroup.select("text")
                .text("");
        })
        .on("click", function (event, d) {
            updateLineChart(d.data.type);
            updateGraph(d.data.type);
            updateMapChart(d.data.type);
            updateBarGraph(d.data.type);
            updateRadarChart(d.data.type, false);
            updatevisual(d.data.type);
        });

    countGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .text("")
        .attr("fill", "black")
        .attr("font-size", "15px");
}