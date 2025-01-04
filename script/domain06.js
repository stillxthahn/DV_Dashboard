(function () {
 d3
  .csv("./data/Mobiles_Dataset_Enhanced.csv")
  .then((data) => {
   const processedData = data
    .filter((d) => +d["Actual price (₹)"] > 0 && +d["Discount price (₹)"] > 0) // Only valid rows
    .map((d) => ({
     ram: +d["RAM (GB)"],
     discount: +(
      ((+d["Actual price (₹)"] - +d["Discount price (₹)"]) /
       +d["Actual price (₹)"]) *
      100
     ).toFixed(2),
    }));

   const ramGroups = d3.group(processedData, (d) => d.ram);
   const averageDiscountData = Array.from(ramGroups, ([ram, values]) => ({
    ram,
    discount: d3.mean(values, (v) => v.discount),
   }))
    .filter((d) => d.discount !== null && !isNaN(d.discount))
    .sort((a, b) => a.ram - b.ram);

   const margin = { top: 50, right: 30, bottom: 50, left: 60 };
   const width = 600 - margin.left - margin.right;
   const height = 400 - margin.top - margin.bottom;

   const svg = d3
    .select("#domain06")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 30)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

   const x = d3
    .scaleBand()
    .domain(averageDiscountData.map((d) => d.ram))
    .range([0, width])
    .padding(0.4);

   const y = d3
    .scaleLinear()
    .domain([0, d3.max(averageDiscountData, (d) => d.discount)])
    .nice()
    .range([height, 0]);

   svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat((d) => `${d} GB`));

   svg.append("g").call(d3.axisLeft(y).tickFormat((d) => `${d}%`));

   svg
    .selectAll(".bar")
    .data(averageDiscountData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.ram))
    .attr("y", (d) => y(d.discount))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.discount))
    .attr("fill", "steelblue");

   svg
    .selectAll(".label")
    .data(averageDiscountData)
    .enter()
    .append("text")
    .attr("x", (d) => x(d.ram) + x.bandwidth() / 2)
    .attr("y", (d) => y(d.discount) - 5)
    .attr("text-anchor", "middle")
    .text((d) => `${d.discount.toFixed(2)}%`);

   svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .text("Average Discount Percentage by RAM Size");
  })
  .catch((error) => {
   console.error("Error loading the CSV file:", error);
  });
})();
