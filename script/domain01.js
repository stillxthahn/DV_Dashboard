(function () {
 const margin = { top: 50, right: 20, bottom: 50, left: 70 };
 const width = 600 - margin.left - margin.right;
 const height = 400 - margin.top - margin.bottom;

 const tooltip = d3
  .select("#domain01")
  .append("div")
  .attr("class", "tooltip-domain01");

 fetch("./data/domain01.json")
  .then((response) => response.json())
  .then((data) => {
   const xLabels = [
    "<=16GB",
    "16-32GB",
    "32-64GB",
    "64-128GB",
    "128-256GB",
    "256-512GB",
   ];
   const yLabels = [">16GB", "12-16GB", "8-12GB", "6-8GB", "4-6GB", "<=4GB"];

   const xScale = d3.scaleBand().domain(xLabels).range([0, width]).padding(0.1);
   const yScale = d3
    .scaleBand()
    .domain(yLabels)
    .range([height, 0])
    .padding(0.1);
   const colorScale = d3
    .scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(data, (d) => d.value || 0)]);

   const svg = d3
    .select("#domain01")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 50) // Extra height for legend
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

   svg
    .selectAll(".cell")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", (d) => xScale(d.x))
    .attr("y", (d) => yScale(d.y))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .style("fill", (d) => (d.value === null ? "#d3d3d3" : colorScale(d.value)))
    .on("mouseover", function (event, d) {
     tooltip
      .style("opacity", 1)
      .html(
       `<strong>RAM:</strong> ${d.x}<br><strong>Storage:</strong> ${
        d.y
       }<br><strong>Actual price:</strong> ${
        d.value !== null ? d.value.toFixed(2) : "No Data"
       }`
      )
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 20 + "px");
     d3.select(this).style("stroke", "black");
    })
    .on("mousemove", function (event) {
     tooltip
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 20 + "px");
    })
    .on("mouseout", function () {
     tooltip.style("opacity", 0);
     d3.select(this).style("stroke", "#ccc");
    });

   svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

   svg.append("g").call(d3.axisLeft(yScale));

   svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .text("Relationship between RAM size, storage capacity, and price");

   // Add legend
   const legendHeight = 20;
   const legendWidth = 300;

   const legend = svg
    .append("g")
    .attr("transform", `translate(0, ${270 + margin.top + 20})`);

   const legendScale = d3
    .scaleLinear()
    .domain(colorScale.domain())
    .range([0, legendWidth]);

   const legendAxis = d3
    .axisBottom(legendScale)
    .ticks(5)
    .tickFormat((d) => d.toFixed(2));

   const gradient = svg
    .append("defs")
    .append("linearGradient")
    .attr("id", "legend-gradient")
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "0%");

   gradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", colorScale(colorScale.domain()[0]));

   gradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", colorScale(colorScale.domain()[1]));

   legend
    .append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#legend-gradient)");

   legend
    .append("g")
    .attr("transform", `translate(0, ${legendHeight})`)
    .call(legendAxis);
  })
  .catch((error) => console.error("Error loading data:", error));
})();
