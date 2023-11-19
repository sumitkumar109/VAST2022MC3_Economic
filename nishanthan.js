document.addEventListener("DOMContentLoaded", function () {
    var nishanthanSvg = d3.select("#nishanthan");
    var textarea = document.getElementById("nishanthan_description");
    textarea.value = "This map of the city's blocks and apartment complexes describes the Ohio city's rental information.";
    textarea.value += "\n \t * This graph describes the residential areas of the city";
    textarea.value += "\n \t * This graph also visualizes the high rental and low rental areas";
    textarea.value += "\n \t * The rent increases when you move towards the center of the city";
    textarea.value += "\n \t * The number of rooms per occupant decreases when you move towards the center of the city";
    textarea.value += "\n \t * The size of the circles indicate the number of rooms occupied by each person";
    textarea.value += "\n \t \t \t \t- Nishanthan Rengaharan";
    // Append an SVG element for the background image
    var backgroundSvg = nishanthanSvg.append("svg").attr("class", "map");

    // Set up scales for x, y axes, and color
    var xScale = d3.scaleLinear().range([20, 1053]); // width of the plot
    var yScale = d3.scaleLinear().range([1137, 7]); // height of the plot

    var colorScale = d3.scaleLinear()
        .range(["lightgreen", "darkred"]) // darker green to darker red // color range from green to red


    // Load CSV data and overlay points on the image
    d3.csv("./data/nishanthan/Apartments.csv").then(function (data) {
        // Convert string coordinates and rent to numbers
        data.forEach(function (d) {
            var coordinates = d.location.replace('POINT (', '').replace(')', '').split(' ');
            d.x = +coordinates[0];
            d.y = +coordinates[1];
            d.rentalCost = +d.rentalCost;
            d.maxOccupancy = +d.maxOccupancy;
            d.numberOfRooms = +d.numberOfRooms;
        });

        // Update the scales based on the data range
        xScale.domain(d3.extent(data, function (d) { return d.x; }));
        yScale.domain(d3.extent(data, function (d) { return d.y; }));
        colorScale.domain([d3.min(data, function (d) { return d.rentalCost; }) + 400, d3.max(data, function (d) { return d.rentalCost; })]);
        // colorScale.domain(d3.extent(data, function (d) { return d.rentalCost; }));

        var simulation = d3.forceSimulation(data)
            .force("x", d3.forceX(function (d) { return xScale(d.x); }).strength(0.1))
            .force("y", d3.forceY(function (d) { return yScale(d.y); }).strength(0.1))
            .force("collide", d3.forceCollide(function (d) { return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 7; }).iterations(2).strength(0.4))
            .stop(); // Stop the simulation initially to adjust the circles based on the forces

        // Run the simulation for a few iterations to adjust the circle positions
        for (var i = 0; i < 100; ++i) simulation.tick();

        // Add circles for each point on the background SVG
        backgroundSvg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("class", "point")
            .attr("cx", function (d) {
                return d.x;

            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("r", function (d) {
                // Adjust the radius based on the ratio of number of rooms to maxOccupancy
                return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 5; // You can adjust the multiplier for a better visual effect
            })
            .attr("fill", function (d) {
                return colorScale(d.rentalCost);
            })
            .attr("stroke", "black") // Add black stroke
            .attr("stroke-width", 1);

        // Add legend
        var legend = nishanthanSvg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(950,50)"); // Adjust the position of the legend

        var legendRectSize = 18;
        var legendSpacing = 12;

        var legendData = ["Low Rent", "High Rent"];

        // Create a color scale legend
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

        // Add text labels for the legend
        var legendText = legend.selectAll(".legendText")
            .data(colorScale.domain())
            .enter().append("text")
            .attr("class", "legendText")
            .attr("x", legendRectSize + legendSpacing*2)
            .attr("y", function (d, i) { return (1 - i) * (legendRectSize + legendSpacing * 4) + legendRectSize * 2.65; })
            .attr("dy", "0.35em")
            .text(function (d) { return Math.round(d < 1000 ? d - 400 : d); }); 


    }).catch(function (error) {
        console.log(error);
    });
});
