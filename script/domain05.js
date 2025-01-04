(function () {
 d3
  .csv("./data/Mobiles_Dataset_Enhanced.csv")
  .then((data) => {
   const ramCounts = d3.rollups(
    data,
    (v) => v.length,
    (d) => +d["RAM (GB)"]
   );

   const ramData = ramCounts.map(([ram, count]) => ({ ram, count }));

   ramData.sort((a, b) => a.ram - b.ram);

   const margin = { top: 50, right: 30, bottom: 50, left: 60 };
   const width = 600 - margin.left - margin.right;
   const height = 400 - margin.top - margin.bottom;

   const svg = d3
    .select("#domain05")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

   const x = d3
    .scaleBand()
    .domain(ramData.map((d) => d.ram))
    .range([0, width])
    .padding(0.2);

   const y = d3
    .scaleLinear()
    .domain([0, d3.max(ramData, (d) => d.count)])
    .nice()
    .range([height, 0]);

   svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat((d) => `${d} GB`));

   svg.append("g").call(d3.axisLeft(y));

   svg
    .selectAll(".bar")
    .data(ramData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.ram))
    .attr("y", (d) => y(d.count))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.count))
    .attr("fill", "steelblue");

   svg
    .selectAll(".label")
    .data(ramData)
    .enter()
    .append("text")
    .attr("x", (d) => x(d.ram) + x.bandwidth() / 2)
    .attr("y", (d) => y(d.count) - 5)
    .attr("text-anchor", "middle")
    .text((d) => d.count);

   svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .text("Most Common RAM Sizes Among Mobiles");
  })
  .catch((error) => {
   console.error("Error loading the CSV file:", error);
  });
})();
