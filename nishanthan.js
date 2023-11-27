var colorScale;
var backgroundSvg;
var educationLevel = "";
var validEducationLevels = ['HighSchoolOrCollege', 'Bachelors', 'Graduate', 'Low'];
var adata;



var nishanthanSvg = d3.select("#nishanthan");
// var textarea = document.getElementById("nishanthan_description");
// textarea.value = "This map of the city's blocks and apartment complexes describes the Ohio city's rental information.";
// textarea.value += "\n \t * This graph describes the residential areas of the city";
// textarea.value += "\n \t * This graph also visualizes the high rental and low rental areas";
// textarea.value += "\n \t * The rent increases when you move towards the center of the city";
// textarea.value += "\n \t * The number of rooms per occupant decreases when you move towards the center of the city";
// textarea.value += "\n \t * The size of the squares indicate the number of rooms occupied by each person";
// textarea.value += "\n \t \t \t \t \t- Nishanthan Rengaharan";

// Append an SVG element for the background image
backgroundSvg = nishanthanSvg.append("svg").attr("class", "map");

// Set up scales for x, y axes, and color
var xScale = d3.scaleLinear().range([20, 1053]); // width of the plot
var yScale = d3.scaleLinear().range([1137, 7]); // height of the plot

colorScale = d3.scaleLinear()
    .range(d3.schemeTableau10); // darker green to darker red // color range from green to red

// Load CSV data and overlay points on the image
d3.csv("./data/nishanthan/Apartments.csv").then(function (data) {
    processData(data);
    setupSimulation(data);
    addRectangles(data, backgroundSvg, xScale, yScale, colorScale);
    addLegend(nishanthanSvg, colorScale);
    adata = data;

    // Check if the provided education level is valid
    if (validEducationLevels.includes(educationLevel)) {
        updateMapChart(educationLevel);
    }

}).catch(function (error) {
    console.log(error);
});

function processData(data) {
    data.forEach(function (d) {
        var coordinates = d.location.replace('POINT (', '').replace(')', '').split(' ');
        d.x = +coordinates[0];
        d.y = +coordinates[1];
        d.rentalCost = +d.rentalCost;
        d.maxOccupancy = +d.maxOccupancy;
        d.numberOfRooms = +d.numberOfRooms;
        d.apartmentId = +d.apartmentId;
    });

    // Update the scales based on the data range
    xScale.domain(d3.extent(data, function (d) { return d.x; }));
    yScale.domain(d3.extent(data, function (d) { return d.y; }));
    colorScale.domain([d3.min(data, function (d) { return d.rentalCost; }) + 400, d3.max(data, function (d) { return d.rentalCost; })]);
}

function setupSimulation(data) {
    var simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(function (d) { return xScale(d.x); }).strength(0.1))
        .force("y", d3.forceY(function (d) { return yScale(d.y); }).strength(0.1))
        .force("collide", d3.forceCollide(function (d) { return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 7; }).iterations(2).strength(0.4))
        .stop();

    for (var i = 0; i < 200; ++i) simulation.tick();
}

function addRectangles(data, svg, xScale, yScale, colorScale) {
    svg.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("class", "point")
        .attr("x", function (d) {
            return d.x - Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 5;
        })
        .attr("y", function (d) {
            return d.y - Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 5;
        })
        .attr("width", function (d) {
            return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 10;
        })
        .attr("height", function (d) {
            return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 10;
        })
        .attr("fill", function (d) {
            return colorScale(d.rentalCost);
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1);
}

function addLegend(svg, colorScale) {
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(950,50)");

    var legendRectSize = 18;
    var legendSpacing = 12;

    var legendData = ["Low Rent", "High Rent"];

    var legendGradient = legend.append("defs")
        .append("linearGradient")
        .attr("id", "rentLegend")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");

    legendGradient.append("stop")
        .attr("offset", "0%")
        .style("stop-color", colorScale.range()[0]);

    legendGradient.append("stop")
        .attr("offset", "100%")
        .style("stop-color", colorScale.range()[1]);

    legend.append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize * 5)
        .style("fill", "url(#rentLegend)")
        .attr("transform", "translate(0," + (legendRectSize * 2) + ")");


    var legendText = legend.selectAll(".legendText")
        .data(colorScale.domain())
        .enter().append("text")
        .attr("class", "legendText")
        .attr("x", legendRectSize + legendSpacing * 2)
        .attr("y", function (d, i) { return (1 - i) * (legendRectSize + legendSpacing * 4) + legendRectSize * 2.65; })
        .attr("dy", "0.35em")
        .text(function (d) { return Math.round(d < 1000 ? d - 400 : d); });

    legend.append("text").attr("class", "legendText")
        .attr("x", legendRectSize + legendSpacing * 2 - 35)
        .attr("y", function (d, i) { return (1 - i) * (legendRectSize + legendSpacing * 4) + legendRectSize * -4; })
        .attr("dy", "0.35em")
        .text("Rent in $");
}

export function updateMapChart(educationLevel) {
    // Valid education levels

    // Check if the provided education level is valid
    if (validEducationLevels.includes(educationLevel)) {
        // Load the combined data CSV file
        d3.csv('./data/nishanthan/combined_data.csv').then(function (combinedData) {
            // Filter data based on the provided education level
            var filteredData = combinedData.filter(function (d) {
                return d.educationLevel === educationLevel;
            });

            // Extract apartmentIds from the filtered data
            var apartmentIds = filteredData.map(function (d) {
                return +d.apartmentId;
            });

            // Filter Apartments.csv data based on the extracted apartmentIds
            var filteredApartments = adata.filter(function (apartment) {
                return apartmentIds.includes(apartment.apartmentId);
            });

            // Remove existing rectangles
            backgroundSvg.selectAll("rect").remove();

            // Add rectangles for each point on the background SVG
            backgroundSvg.selectAll("rect")
                .data(filteredApartments)
                .enter().append("rect")
                .attr("class", "point")
                .attr("x", function (d) {
                    return d.x - Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 5;
                })
                .attr("y", function (d) {
                    return d.y - Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 5;
                })
                .attr("width", function (d) {
                    return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 10;
                })
                .attr("height", function (d) {
                    return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 10;
                })
                .attr("fill", function (d) {
                    return colorScale(d.rentalCost);
                })
                .attr("stroke", "black")
                .attr("stroke-width", 1);
        }).catch(function (error) {
            console.log(error);
        });
    } else {
        // If education level is not valid, plot rectangles for all data
        // Remove existing rectangles
        backgroundSvg.selectAll("rect").remove();

        // Add rectangles for each point on the background SVG
        backgroundSvg.selectAll("rect")
            .data(adata)
            .enter().append("rect")
            .attr("class", "point")
            .attr("x", function (d) {
                return d.x - Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 5;
            })
            .attr("y", function (d) {
                return d.y - Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 5;
            })
            .attr("width", function (d) {
                return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 10;
            })
            .attr("height", function (d) {
                return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 10;
            })
            .attr("fill", function (d) {
                return colorScale(d.rentalCost);
            })
            .attr("stroke", "black")
            .attr("stroke-width", 1);
    }
}





