document.addEventListener("DOMContentLoaded", function() {
    var svg = d3.select("#ram");
    var textarea = document.getElementById("ram_description");
    textarea.value = "ram";
});
 /* function normalChart(){
  const margin = { top: 60, right: 40, bottom: 50, left: 50 };
  const width = 650 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3.select("#ram")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("data/ram/after_visual.csv").then(data => {
  data.forEach(d => {
    d.Month = d3.timeParse('%Y-%m')(d.Month);
    d['Education'] = +d['Education'];
    d['Food'] = +d['Food'];
    d['Recreation'] = +d['Recreation'];
    d['Rent'] = +d['Rent'];
    d['Shelter'] = +d['Shelter'];
    d['Wage'] = +d['Wage'];
    d['expense'] = +d['expense'];
  });
  const groupedData = d3.rollup(
    data,
    values => ({
      'Education': d3.sum(values, d => d['Education']),
      'Food': d3.sum(values, d => d['Food']),
      'Recreation': d3.sum(values, d => d['Recreation']),
      'Rent': d3.sum(values, d => d['Rent']),
      'Shelter': d3.sum(values, d => d['Shelter']),
      'Wage': d3.sum(values, d => d['Wage']),
      'expense': d3.sum(values, d => d['expense']),
    }),
    d => d.Month
  );

  // Convert groupedData to an array for further processing if needed
  const summarizedData = Array.from(groupedData, ([key, value]) => ({ Month: key, ...value }));
  
  // Create a stack generator
  const stack = d3.stack()
    .keys(['Education', 'Food', 'Recreation', 'Rent', 'Shelter', 'Wage', 'expense'])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetWiggle);

   console.log(summarizedData) 
  // Stack the data
  const stackedData = stack(summarizedData);
    console.log(stackedData)
  // Define color scale
  const color = d3.scaleOrdinal(d3.schemeTableau10);

  // Define x and y scales
  const xScale = d3.scaleTime()
    .domain(d3.extent(summarizedData, d => d.Month))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])])
    .range([height, 0]);

  // Create areas for each layer
  const area = d3.area()
    .x(d => xScale(d.data.Month))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]));
// Create a tooltip
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

    // Tooltip functions
  const mouseover = function (event, d) {
    // Dim all areas
    svg.selectAll('path')
      .transition().duration(200)
      .style('opacity', 0.2);

    // Highlight current area
    d3.select(this)
      .transition().duration(200)
      .style('opacity', 4)
      .attr('stroke', 'black')
      .attr('stroke-width', '2px');
  };



  const mouseleave = function (event, d) {
    // Restore all areas
    svg.selectAll('path')
      .transition().duration(200)
      .style('opacity', 1)
      .attr('stroke', 'none');
    tooltip.style('opacity', 0);
  };
    
  // Append areas to the chart
  svg.selectAll('path')
    .data(stackedData)
    .enter().append('path')
    .attr('fill', d => color(d.key))
    .attr('d', area)
    .on('mouseover', mouseover)
    .on('mouseleave', mouseleave);

  // Create x-axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b \'%y'));;
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  // Create y-axis
  const yAxis = d3.axisLeft(yScale);
  svg.append('g')
    .call(yAxis);

  // X-axis label
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom - 10)
    .style('text-anchor', 'middle')
    .text('Time');

  // Y-axis label
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -margin.left + 20)
    .style('text-anchor', 'middle')
    .text('Amount');

    // Create a legend
  const legend = svg.selectAll('.legend')
    .data(stackedData.map(d => d.key))
    .enter().append('g')
    .attr('class', 'legend')
    .attr('transform', (_, i) => `translate(${i * 95},-50)`);


  legend.append('rect')
    .attr('x', -50)
    .attr('width', 18)
    .attr('height', 18)
    .attr('fill', color);

  legend.append('text')
    .attr('x', -30)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'start')
    .text(d => d);  
    
 });
} */

export function updatevisual(education_level = "")
{
  d3.select("#ram").select("svg").remove();
  //d3.select("#ram").remove();
    const margin = { top: 60, right: 40, bottom: 50, left: 50 };
  const width = 650 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  const svg = d3.select("#ram")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

 d3.csv("data/ram/after_visual.csv").then(csvData => {
    const filteredData = csvData.map(d => ({
      Month: d3.timeParse('%Y-%m')(d.Month),
      'Education': +d['Education'],
      'Food': +d['Food'],
      'Recreation': +d['Recreation'],
      'Rent': +d['Rent'],
      'Shelter': +d['Shelter'],
      'Wage': +d['Wage'],
      'expense': +d['expense'],
      'educationLevel': d['educationLevel']
    })).filter(d => education_level === "" || d.educationLevel === education_level);

    const groupedData = d3.rollup(
    filteredData,
    values => ({
      'Education': d3.sum(values, d => d['Education']),
      'Food': d3.sum(values, d => d['Food']),
      'Recreation': d3.sum(values, d => d['Recreation']),
      'Rent': d3.sum(values, d => d['Rent']),
      'Shelter': d3.sum(values, d => d['Shelter']),
      'Wage': d3.sum(values, d => d['Wage']),
      'expense': d3.sum(values, d => d['expense']),
    }),
    d => d.Month
  );

  // Convert groupedData to an array for further processing if needed
  const summarizedData = Array.from(groupedData, ([key, value]) => ({ Month: key, ...value }));
  console.log(summarizedData)
  // Create a stack generator
  const stack = d3.stack()
    .keys(['Education', 'Food', 'Recreation', 'Rent', 'Shelter', 'Wage', 'expense'])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetWiggle);

   console.log(summarizedData) 
  // Stack the data
  const stackedData = stack(summarizedData);
    console.log(stackedData)
  // Define color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Define x and y scales
  const xScale = d3.scaleTime()
    .domain(d3.extent(summarizedData, d => d.Month))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])])
    .range([height, 0]);

  // Create areas for each layer
  const area = d3.area()
    .x(d => xScale(d.data.Month))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]));
// Create a tooltip
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

    // Tooltip functions
  const mouseover = function (event, d) {
    // Dim all areas
    svg.selectAll('.chart-area')
      .transition().duration(200)
      .style('opacity', 0.2);

    // Highlight current area
    d3.select(this)
      .transition().duration(200)
      .style('opacity', 4)
      .attr('stroke', 'black')
      .attr('stroke-width', '2px');
  };


  const mouseleave = function (event, d) {
    // Restore all areas
    svg.selectAll('.chart-area')
      .transition().duration(200)
      .style('opacity', 1)
      .attr('stroke', 'none');
    tooltip.style('opacity', 0);
  };
    
  // Append areas to the chart
  svg.selectAll('.char-area')
    .data(stackedData)
    .enter().append('path')
    .attr('class','chart-area')
    .attr('fill', d => color(d.key))
    .attr('d', area)
    .on('mouseover', mouseover)
    .on('mouseleave', mouseleave);

  // Create x-axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b \'%y'));
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  // Create y-axis
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.format('.2s'));
  svg.append('g')
    .call(yAxis);

  // X-axis label
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom - 10)
    .style('text-anchor', 'middle')
    .text('Time');

  // Y-axis label
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -margin.left + 15)
    .style('text-anchor', 'middle')
    .text('Expenditure  Amount');
  
    // Create a legend
  const legend = svg.selectAll('.legend')
    .data(stackedData.map(d => d.key))
    .enter().append('g')
    .attr('class', 'legend')
    .attr('transform', (_, i) => `translate(${i * 95},-50)`);


  legend.append('rect')
    .attr('x', -50)
    .attr('width', 18)
    .attr('height', 18)
    .attr('fill', color);

  legend.append('text')
    .attr('x', -30)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'start')
    .text(d => d);  

  });
}
//normalChart();
//const education_level = 'Low'
updatevisual();
