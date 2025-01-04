(function () {
 const margin = { top: 50, right: 20, bottom: 50, left: 70 };
 const width = 600;
 const height = 500;

 const svg = d3
  .select("#domain02-map")
  .append("svg")
  .attr("width", width)
  .attr("height", height + 30); // Tăng thêm 100px cho khoảng trống ở dưới

 const projection = d3
  .geoNaturalEarth1()
  .scale(150) // Tăng scale để phóng to bản đồ
  .translate([width / 2, height / 2]); // Đặt trọng tâm bản đồ

 const path = d3.geoPath().projection(projection);

 const tooltip = d3
  .select("#domain02-map")
  .append("div")
  .attr("class", "tooltip-domain02");

 svg
  .append("text")
  .attr("class", "chart-title")
  .attr("x", width / 2)
  .attr("y", 25)
  .text("Price over countries");

 d3.json("./data/domain02-map.geojson").then((geojsonData) => {
  d3
   .json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
   .then((worldData) => {
    const countries = topojson.feature(
     worldData,
     worldData.objects.countries
    ).features;

    svg
     .selectAll(".country")
     .data(countries)
     .enter()
     .append("path")
     .attr("class", "country")
     .attr("d", path)
     .attr("fill", (d) => {
      const countryData = geojsonData.features.find(
       (f) => f.properties.country === d.properties.name
      );

      return countryData
       ? colorScale(countryData.properties.average_actual_price)
       : "#d3d3d3";
     })
     .on("mouseover", function (event, d) {
      const countryData = geojsonData.features.find(
       (f) => f.properties.country === d.properties.name
      );
      if (countryData) {
       d3.select(this).classed("highlight", true);
       tooltip.style("opacity", 1).html(`<strong>Country:</strong> ${
        countryData.properties.country
       }<br>
                                       <strong>Average Price:</strong> ₹${countryData.properties.average_actual_price.toFixed(
                                        2
                                       )}`);
      }
     })
     .on("mousemove", function (event) {
      tooltip
       .style("left", event.pageX + 10 + "px")
       .style("top", event.pageY - 20 + "px");
     })
     .on("mouseout", function () {
      tooltip.style("opacity", 0);
      d3.select(this).classed("highlight", false); // Bỏ lớp highlight
     });
   });
  // Tạo legend
  const colorScale = d3
   .scaleLinear()
   .domain([
    0,
    d3.max(geojsonData.features, (f) => f.properties.average_actual_price),
   ])
   .range(["#ffcccc", "#cc0000"]);
  const legendHeight = 20;
  const legendWidth = 300;

  const legendMarginLeft = 50; // Khoảng cách từ bên trái
  const legend = svg
   .append("g")
   .attr(
    "transform",
    `translate(${legendMarginLeft}, ${400 + margin.top + 20})`
   );

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
   .attr("id", "legend-gradient-domain02")
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
   .style("fill", "url(#legend-gradient-domain02)");

  legend
   .append("g")
   .attr("transform", `translate(0, ${legendHeight})`)
   .call(legendAxis);
 });
})();
