import { updateLineChart } from "./sumit.js";
import { updateGraph } from "./vanshaj.js";
import { updateMapChart } from "./nishanthan.js";
import { updateBarGraph } from "./utkarsh.js";
import { updateRadarChart } from "./dhwanil.js";
import { updatevisual } from "./ram.js";

var textarea = document.getElementById("sumit2_description");
textarea.value = "Sumit 2";

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
        {type: 'Low', count: lowCount},
        {type: 'HighSchoolOrCollege', count: highSchoolCount},
        {type: 'Bachelors', count: bachelorsCount},
        {type: 'Graduate', count: graduateCount}
    ])
})
.catch((error) => console.error('Error loading the JSON file:', error));


function generateDonutChart(data) {
    console.log(data);
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    const width = 570;
    const height = 380;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#sumit2")
        .attr("width", width)
        .attr("height", height);

    const countGroup = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie()
        .value((d) => d.count);

    const arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.9);

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