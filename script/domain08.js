(function () {
 d3
  .csv("./data/Mobiles_Dataset_Enhanced.csv")
  .then((data) => {
   data.forEach((d) => {
    d["Actual price (₹)"] = +d["Actual price (₹)"];

    if (d["Camera Details"] && typeof d["Camera Details"] === "string") {
     d["Camera Details"] = d["Camera Details"]
      .split("+")
      .reduce((sum, mp) => sum + +mp.trim().replace("MP", ""), 0);
    } else {
     d["Camera"] = 0;
    }
   });

   // Tạo nhóm Budget và Premium
   const budget = data.filter((d) => d["Actual price (₹)"] <= 20000);
   const premium = data.filter((d) => d["Actual price (₹)"] > 20000);

   // Tính trung bình megapixels cho mỗi nhóm
   const budgetAvgMP = d3.mean(budget, (d) => d["Camera Details"]);
   const premiumAvgMP = d3.mean(premium, (d) => d["Camera Details"]);

   // Chuẩn bị dữ liệu để hiển thị
   const cameraData = [
    { group: "Budget (₹0-₹20,000)", avgMP: budgetAvgMP || 0 },
    { group: "Premium (₹20,001-₹80,000)", avgMP: premiumAvgMP || 0 },
   ];

   // Thiết lập kích thước biểu đồ
   const margin = { top: 50, right: 30, bottom: 50, left: 60 };
   const width = 800 - margin.left - margin.right;
   const height = 400 - margin.top - margin.bottom;

   const svg = d3
    .select("#domain08")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

   // Thang đo
   const x = d3
    .scaleBand()
    .domain(cameraData.map((d) => d.group))
    .range([0, width])
    .padding(0.2);

   const y = d3
    .scaleLinear()
    .domain([0, d3.max(cameraData, (d) => d.avgMP)])
    .nice()
    .range([height, 0]);

   // Trục x
   svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

   // Trục y
   svg.append("g").call(d3.axisLeft(y));

   // Vẽ cột
   svg
    .selectAll(".bar")
    .data(cameraData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.group))
    .attr("y", (d) => y(d.avgMP))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.avgMP))
    .attr("fill", "steelblue");

   // Gắn nhãn giá trị
   svg
    .selectAll(".label")
    .data(cameraData)
    .enter()
    .append("text")
    .attr("x", (d) => x(d.group) + x.bandwidth() / 2)
    .attr("y", (d) => y(d.avgMP) - 5)
    .attr("text-anchor", "middle")
    .text((d) => d.avgMP.toFixed(2) + " MP");

   // Thêm tiêu đề
   svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .text("Comparison of Camera Quality: Budget vs Premium");
  })
  .catch((error) => {
   console.error("Error loading the CSV file:", error);
  });
})();
