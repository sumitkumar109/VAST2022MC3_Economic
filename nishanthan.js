document.addEventListener("DOMContentLoaded", function () {
    var nishanthanSvg = d3.select("#nishanthan");
    var textarea = document.getElementById("nishanthan_description");
    textarea.value = "This graph describes the Ohio city's rental information. The follwoing is the map of the city's blocks and apartment complexes. From the graph, you can interpret the rent of the apartments increase when you move towards the centre of the city. \n \t \t \t \t- Nishanthan Rengaharan";

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
        colorScale.domain(d3.extent(data, function (d) { return d.rentalCost; }));

        // Add circles for each point on the background SVG
        backgroundSvg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("class", "point")
            .attr("cx", function (d) {
                return xScale(d.x);
            })
            .attr("cy", function (d) {
                return yScale(d.y);
            })
            .attr("r", function (d) {
                // Adjust the radius based on the ratio of number of rooms to maxOccupancy
                return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 7; // You can adjust the multiplier for a better visual effect
            })
                .attr("fill", function (d) {
                return colorScale(d.rentalCost);
            });

        // Add legend
        var legend = nishanthanSvg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(950,50)"); // Adjust the position of the legend

        var legendRectSize = 18;
        var legendSpacing = 4;

        var legendData = ["Low Rent", "High Rent"];

        var legendRects = legend.selectAll("rect")
            .data(legendData)
            .enter()
            .append("rect")
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .attr("y", function (d, i) { return i * (legendRectSize + legendSpacing); })
            .style("fill", function (d, i) { return colorScale(i === 0 ? d3.min(data, function (d) { return d.rentalCost; }) : d3.max(data, function (d) { return d.rentalCost; })); });

        var legendTexts = legend.selectAll("text")
            .data(legendData)
            .enter()
            .append("text")
            .attr("x", legendRectSize + legendSpacing)
            .attr("y", function (d, i) { return i * (legendRectSize + legendSpacing) + legendRectSize / 2; })
            .attr("dy", "0.35em")
            .text(function (d) { return d; });


    }).catch(function (error) {
        console.log(error);
    });
});
