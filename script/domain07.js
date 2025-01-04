(function () {
 d3
  .csv("./data/Mobiles_Dataset_Enhanced.csv")
  .then((data) => {
   // Chuyển đổi dữ liệu sang dạng số
   data.forEach((d) => {
    d["Discount price (₹)"] = +d["Discount price (₹)"];
    d["Stars"] = +d["Stars"];
   });

   // Tạo các khoảng giá giảm (bins)
   const bins = [
    { range: "₹0-₹10,000", min: 0, max: 10000 },
    { range: "₹10,001-₹20,000", min: 10001, max: 20000 },
    { range: "₹20,001-₹30,000", min: 20001, max: 30000 },
    { range: "₹30,001-₹40,000", min: 30001, max: 40000 },
    { range: "₹40,001-₹50,000", min: 40001, max: 50000 },
    { range: "₹50,001-₹60,000", min: 50001, max: 60000 },
    { range: "₹60,001+", min: 60001, max: Infinity },
   ];

   // Nhóm dữ liệu theo bins
   const binData = bins.map((bin) => {
    const filtered = data.filter(
     (d) =>
      d["Discount price (₹)"] >= bin.min && d["Discount price (₹)"] <= bin.max
    );
    const avgStars = d3.mean(filtered, (d) => d["Stars"]);
    return { range: bin.range, avgStars: avgStars || 0 };
   });

   // Thiết lập kích thước biểu đồ
   const margin = { top: 50, right: 30, bottom: 50, left: 60 };
   const width = 800 - margin.left - margin.right;
   const height = 400 - margin.top - margin.bottom;

   const svg = d3
    .select("#domain07")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

   // Thang đo
   const x = d3
    .scaleBand()
    .domain(binData.map((d) => d.range))
    .range([0, width])
    .padding(0.2);

   const y = d3
    .scaleLinear()
    .domain([0, d3.max(binData, (d) => d.avgStars)])
    .nice()
    .range([height, 0]);

   // Trục x
   svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "-0.2em")
    .attr("transform", "rotate(-45)");

   // Trục y
   svg.append("g").call(d3.axisLeft(y));

   // Vẽ cột
   svg
    .selectAll(".bar")
    .data(binData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.range))
    .attr("y", (d) => y(d.avgStars))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.avgStars))
    .attr("fill", "steelblue");

   // Gắn nhãn giá trị
   svg
    .selectAll(".label")
    .data(binData)
    .enter()
    .append("text")
    .attr("x", (d) => x(d.range) + x.bandwidth() / 2)
    .attr("y", (d) => y(d.avgStars) - 5)
    .attr("text-anchor", "middle")
    .text((d) => d.avgStars.toFixed(2));

   // Thêm tiêu đề
   svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Impact of Price Discount on Stars Rating");
  })
  .catch((error) => {
   console.error("Error loading the CSV file:", error);
  });
})();
