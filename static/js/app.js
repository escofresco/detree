// D3 detree plots

// Setup
// ===========================
// Get information about the view and create detree plot components
var defaultFilePath = "static/data/flare-2.json";

// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width / 3.9;

// Create the actual canvas for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// Import .csv file.
// ========================
// Load either the user-submitted data or the demo data.

// Import our CSV data with d3's .csv import method.
d3.csv(defaultFilePath).then(function(data) {
  // Visualize the data
  visualize(data);
});

// Create a visualization function
// ====================================
// We called a "visualize" function on the data obtained with d3's .csv method.
// This function handles the visual manipulation of all elements dependent on
// the data
const visualize = (data) => {
  treemap = data => d3.treemap()
      .tile(tile)
      .size([width, height])
      .padding(1)
      .round(true)
    (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value));
  // Configure tree map
  chart = {
    const root = treemap(data);

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .style("font", "10px sans-serif");

    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    leaf.append("title")
        .text(d => `${d.ancestors().reverse().map(d => d.data.name).join("/")}\n${format(d.value)}`);

    leaf.append("rect")
        .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", 0.6)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);

    leaf.append("clipPath")
        .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
      .append("use")
        .attr("xlink:href", d => d.leafUid.href);

    leaf.append("text")
        .attr("clip-path", d => d.clipUid)
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
      .join("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .text(d => d);

    return svg.node();
  }

}
