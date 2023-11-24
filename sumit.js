var textarea = document.getElementById("sumit1_description");
textarea.value = "Sumit 1";


// Set dimensions and margins for the graph
var margin = {top: 20, right: 20, bottom: 20, left: 75};
var width = 650 - margin.left - margin.right; // Adjust as needed
var height = 470 - margin.top - margin.bottom; // Adjust as needed

// Append SVG object to the div with id "sumit1"
const svg = d3.select("#sumit1")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);


export function updateChartSumit(educationLevel = "") {
    svg.selectAll("*").remove();

    let filename = "modified_financial_journal.csv";

    if (educationLevel === 'Low') {
        filename = "modified_financial_journal_low.csv";
    } else if (educationLevel === 'HighSchoolOrCollege') {
        filename = "modified_financial_journal_highschool.csv";
    } else if (educationLevel === 'Bachelors') {
        filename = "modified_financial_journal_bachelors.csv";
    } else if (educationLevel === 'Graduate') {
        filename = "modified_financial_journal_graduate.csv";
    }

    const path = "data_preprocessing/" + filename;
    // Read the data (assuming the file path and format are correct)
    d3.csv(path).then(function(data) {
        // Group the data by month
        const sumByCategory = Array.from(d3.rollup(data, 
            v => d3.sum(v, leaf => leaf.total_amount), 
            d => d.month, 
            d => d.category
        ));
    
        // Map to a structure suitable for d3.stack()
        let dataset = sumByCategory.map(([month, categories]) => {
            const entries = { month: d3.timeParse("%Y-%m")(month) };
            for (const [category, total] of categories) {
                entries[category] = total;
            }
            return entries;
        });
    
        function removeKeys(obj, keysToRemove, keysToMultiply) {
            keysToRemove.forEach(key => {
                delete obj[key];
            });
            keysToMultiply.forEach(key => {
                    obj[key] *= -1;
            });
            return obj;
        }
    
        dataset = dataset.map(obj => removeKeys({...obj}, ['RentAdjustment', 'Shelter', 'Wage'], ['Food', 'Education', 'Recreation']));
    
        // List of subgroups (categories)
        const categories = ["Education", "Food", "Recreation"];

    const stackedData = d3.stack()
        .keys(categories)
        (dataset)

    // Add X axis
    const x = d3.scaleTime()
    .domain(d3.extent(dataset, d => d.month))
    .range([0, width]);

    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%Y-%m")))
    .selectAll("text")  // select all the text elements for the xaxis
    .attr("transform", "rotate(-20)")  // rotate the text
    .style("text-anchor", "end");  // set the text-anchor to 'end' which aligns the text to the end of the tick

    // Add X axis label:
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin.left)
    .attr("y", height + margin.top + 25)  // You might need to adjust this to position your x-axis label correctly
    .style("font-size", "15px")
    .text("Time (YYYY-MM)");

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Add Y axis label:
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)  // This positions the label to the left of the y-axis
    .attr("x", -margin.top - height/2 + 20)  // You might need to adjust this as well
    .style("font-size", "15px")
    .text("Monthly Revenue ($)");


    // Color palette
    const color = d3.scaleOrdinal()
    .domain(categories)
    .range(d3.schemeTableau10);

    // Add the area
    svg.selectAll("mylayers")
    .data(stackedData)
    .join("path")
        .style("fill", d => color(d.key))
        .style("stroke", "black") // Set the stroke color
        .style("stroke-width", "1px")
        .attr("d", d3.area()
        .x(d => x(d.data.month))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))
        );

    // Add legend (optional, if space permits)
    svg.selectAll("mydots")
        .data(categories)
        .join("circle")
        .attr("cx", 400)
        .attr("cy", function(d,i){ return 10 + i*25})
        .attr("r", 7)
        .style("fill", d => color(d));

    svg.selectAll("mylabels")
        .data(categories)
        .join("text")
        .attr("x", 420)
        .attr("y", function(d,i){ return 10 + i*25})
        .style("fill", d => color(d))
        .text(d => {
            if (d === "Education") {
                return "School";
            } else if (d === "Food") {
                return "Restaurant";
            } else {
                return "Pub";
            }
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
        
        });
}    

updateChartSumit();