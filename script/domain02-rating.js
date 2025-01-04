(function () {
 d3
  .json("data/domain02-rating.json")
  .then(function (data) {
   const margin = { top: 50, right: 20, bottom: 40, left: 100 };
   const width = 700 - margin.left - margin.right;
   const height = 500 - margin.top - margin.bottom;

   // Set up the SVG canvas
   const svg = d3
    .select("#domain02-rating")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

   // Create scales
   const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d["Rating (Total Ratings)"])])
    .nice() // Làm tròn giá trị tối đa
    .range([0, width]); // Phạm vi ngang (X-axis)

   const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.Brand)) // Các giá trị danh mục (Brand)
    .range([0, height]) // Phạm vi dọc (Y-axis)
    .padding(0.4); // Khoảng cách giữa các bar

   // Create a tooltip
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
    .attr("y", (d) => yScale(d.Brand)) // Y position by Brand
    .attr("x", 0) // Bars start from the left
    .attr("width", (d) => xScale(d["Rating (Total Ratings)"])) // Width depends on Rating
    .attr("height", yScale.bandwidth())
    // Mouse events for the tooltip
    .on("mouseover", function (event, d) {
     tooltip
      .style("visibility", "visible")
      .text(`${d.Brand}: ${d["Rating (Total Ratings)"].toFixed(2)}`);
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
    .attr("transform", `translate(0,${height})`) // Move X-axis to bottom
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
    .text("Brand Ratings");
  })
  .catch(function (error) {
   console.error("Error loading the data:", error);
  });
})();
