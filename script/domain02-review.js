(function () {
 d3.json("data/domain02-review.json").then(function (data) {
  console.log("Data Loaded:", data); // Debug: Log the fetched data

  const margin = { top: 50, right: 100, bottom: 40, left: 70 };
  const width = 700 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Set up the SVG canvas
  const svg = d3
   .select("#domain02-review")
   .attr("width", width + margin.left + margin.right)
   .attr("height", height + margin.top + margin.bottom)
   .append("g")
   .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create scales
  const xScale = d3
   .scaleLinear()
   .domain([0, d3.max(data, (d) => d["Reviews (Total Reviews)"])])
   .nice() // Round up the max value for better axis ticks
   .range([0, width]);

  const yScale = d3
   .scaleBand()
   .domain(data.map((d) => d.Brand)) // Brands as categories
   .range([0, height])
   .padding(0.4); // Adjust spacing between bars

  // Create tooltip
  const tooltip = d3
   .select("body")
   .append("div")
   .attr("class", "tooltip")
   .style("position", "absolute")
   .style("visibility", "hidden")
   .style("background-color", "rgba(0,0,0,0.7)")
   .style("color", "white")
   .style("padding", "5px")
   .style("border-radius", "3px")
   .style("pointer-events", "none");

  // Create bars
  svg
   .append("g")
   .selectAll(".bar")
   .data(data)
   .enter()
   .append("rect")
   .attr("class", "bar")
   .attr("x", 0) // Start from the left (0)
   .attr("y", (d) => yScale(d.Brand)) // Y position based on Brand
   .attr("width", (d) => xScale(d["Reviews (Total Reviews)"])) // Width based on Reviews
   .attr("height", yScale.bandwidth()) // Height based on scale bandwidth
   // Mouse events for the tooltip
   .on("mouseover", function (event, d) {
    tooltip
     .style("visibility", "visible")
     .text(`${d.Brand}: ${d["Reviews (Total Reviews)"].toFixed(2)}`);
   })
   .on("mousemove", function (event) {
    tooltip
     .style("top", event.pageY + 5 + "px")
     .style("left", event.pageX + 5 + "px");
   })
   .on("mouseout", function () {
    tooltip.style("visibility", "hidden");
   });

  // Add X-axis
  svg
   .append("g")
   .attr("class", "axis")
   .attr("transform", `translate(0,${height})`) // Move to the bottom
   .call(d3.axisBottom(xScale));

  // Add Y-axis
  svg.append("g").attr("class", "axis").call(d3.axisLeft(yScale));

  // Add chart title
  svg
   .append("text")
   .attr("class", "chart-title")
   .attr("x", width / 2)
   .attr("y", -margin.top / 2)
   .attr("text-anchor", "middle")
   .text("Brand Reviews");
 });
})();
