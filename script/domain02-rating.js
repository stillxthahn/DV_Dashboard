(function () {
 d3
  .json("data/domain02-rating.json")
  .then(function (data) {
   console.log("Data Loaded:", data); // Debug: Log the fetched data

   const margin = { top: 50, right: 20, bottom: 40, left: 50 };
   const width = 600 - margin.left - margin.right;
   const height = 400 - margin.top - margin.bottom;

   // Set up the SVG canvas
   const svg = d3
    .select("#domain02-rating")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

   // Create scales
   const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.Brand)) // Brands as categories
    .range([0, width])
    .padding(0.4);

   const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d["Rating (Total Ratings)"])])
    .nice() // Round up the max value for better axis ticks
    .range([height, 0]);

   // Create X and Y axes
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
    .attr("x", (d) => xScale(d.Brand))
    .attr("y", (d) => yScale(d["Rating (Total Ratings)"]))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d["Rating (Total Ratings)"]))
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
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text") // Lựa chọn các nhãn
    .attr("transform", "rotate(-90)") // Xoay chữ 90 độ
    .attr("text-anchor", "end") // Căn chỉnh chữ về cuối
    .attr("dx", "-0.8em") // Dịch chuyển nhãn để tránh bị đè lên nhau
    .attr("dy", "-0.4em");

   // Add Y-axis
   svg.append("g").attr("class", "axis").call(d3.axisLeft(yScale));

   // Add chart title
   svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .text("Brand Ratings");
  })
  .catch(function (error) {
   console.error("Error loading the data:", error);
  });
})();
