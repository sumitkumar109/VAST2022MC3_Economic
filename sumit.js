// var textarea = document.getElementById("sumit1_description");
// textarea.value = "Sumit 1";
//document.body.style.zoom = "50%";
// Set dimensions and margins for the graph
var margin = { top: 20, right: 20, bottom: 50, left: 75 };
const xsvg = d3.select("#sumit2");
var width = +xsvg.style("width").replace("px", '') - margin.left - margin.right; // Adjust as needed
var height = +xsvg.style("height").replace("px", '') - margin.top - margin.bottom; // Adjust as needed

// Append SVG object to the div with id "sumit1"
const svg = d3
  .select("#sumit1")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

export function updateLineChart(educationLevel = "") {
  svg.selectAll("*").remove();

  svg.append("text")
    .attr("class", "allText")
    .attr("x", width / 2)
    .attr("y", 2) // Adjust the Y position as needed
    .attr("text-anchor", "middle")
    .text("Education Level Distribution");

  let filename = "modified_financial_journal.csv";

  if (educationLevel === "Low") {
    filename = "modified_financial_journal_low.csv";
  } else if (educationLevel === "HighSchoolOrCollege") {
    filename = "modified_financial_journal_highschool.csv";
  } else if (educationLevel === "Bachelors") {
    filename = "modified_financial_journal_bachelors.csv";
  } else if (educationLevel === "Graduate") {
    filename = "modified_financial_journal_graduate.csv";
  }

  const path = "data_preprocessing/" + filename;
  // Read the data (assuming the file path and format are correct)
  d3.csv(path).then(function (data) {
    // Group the data by month
    const sumByCategory = Array.from(
      d3.rollup(
        data,
        (v) => d3.sum(v, (leaf) => leaf.total_amount),
        (d) => d.month,
        (d) => d.category
      )
    );

    // Map to a structure suitable for d3.stack()
    let dataset = sumByCategory.map(([month, categories]) => {
      const entries = { month: d3.timeParse("%Y-%m")(month) };
      for (const [category, total] of categories) {
        entries[category] = total;
      }
      return entries;
    });

    function removeKeys(obj, keysToRemove, keysToMultiply) {
      keysToRemove.forEach((key) => {
        delete obj[key];
      });
      keysToMultiply.forEach((key) => {
        obj[key] *= -1;
      });
      return obj;
    }

    dataset = dataset.map((obj) =>
      removeKeys(
        { ...obj },
        ["RentAdjustment", "Shelter", "Wage"],
        ["Food", "Education", "Recreation"]
      )
    );

    // List of subgroups (categories)
    const categories = ["Education", "Food", "Recreation"];

    // Transpose the dataset to convert it into a format suitable for multi-line chart
    const transposedData = categories.map((category) => ({
      name: category,
      values: dataset.map((d) => ({ date: d.month, value: d[category] })),
    }));

    // Add X axis
    const x = d3
      .scaleTime()
      .domain(d3.extent(dataset, (d) => d.month))
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%Y-%m")))
      .selectAll("text") // select all the text elements for the x-axis
      .attr("class", "axisTicks")
      .attr("transform", "rotate(-20)") // rotate the text
      .style("text-anchor", "end"); // set the text-anchor to 'end' which aligns the text to the end of the tick

    // Add X axis label:
    svg
      .append("text")
      .attr("class", "axisTicks")

      .attr("text-anchor", "end")
      .attr("x", width / 2 + margin.left)
      .attr("y", height + margin.top + 25) // You might need to adjust this to position your x-axis label correctly
      .style("font-size", "15px")
      .text("Time (YYYY-MM)");

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(transposedData, (d) => d3.max(d.values, (d) => d.value)),
      ])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Add Y axis label:
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20) // This positions the label to the left of the y-axis
      .attr("x", -margin.top - height / 2 + 20) // You might need to adjust this as well
      .style("font-size", "15px")
      .text("Monthly Revenue ($)");

    // Color palette
    const color = d3.scaleOrdinal().domain(categories).range(d3.schemeTableau10);

    // Define the line function
    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    // Add the lines
    const lines = svg
      .selectAll(".line")
      .data(transposedData)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("d", (d) => line(d.values))
      .style("stroke", (d) => color(d.name))
      .style("fill", "none")
      .style("stroke-width", 3);

    // Add legend (optional, if space permits)
    svg
      .selectAll("mydots")
      .data(categories)
      .enter()
      .append("circle")
      .attr("cx", width - 100)
      .attr("cy", (d, i) => 10 + i * 25)
      .attr("r", 7)
      .style("fill", (d) => color(d));

    svg
      .selectAll("mylabels")
      .data(categories)
      .enter()
      .append("text")
      .attr("x", width - 80)
      .attr("y", (d, i) => 10 + i * 25)
      .style("fill", (d) => color(d))
      .text((d) => {
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

updateLineChart();
