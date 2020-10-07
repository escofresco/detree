// D3 detree plots

// Setup
// ===========================
// Get information about the view and create detree plot components
var defaultFilePath = "static/data/flare-2.json";

// Grab the width of the containing box
var width = parseInt(d3.select("#tree").style("width"));

// Designate the height of the graph
var height = width - width / 3.9;

// Create the actual canvas for the graph
var svg = d3
.select("#tree")
.append("svg")
.append("g")
.attr("width", width)
.attr("height", height)
.attr("class", "chart");

// Import .csv file.
// ========================
// Load either the user-submitted data or the demo data.

// Import our CSV data with d3's .csv import method.
// d3.csv(defaultFilePath).then(function(data) {
//   // Visualize the data
//   visualize(data);
// });

function treemap(date) {
  var fn = data => d3.treemap()
  .tile(tile)
  .size([width, height])
  .padding(1)
  .round(true)
  (d3.hierarchy(data)
  .sum(d => d.value)
  .sort((a, b) => b.value - a.value));
  return fn;
}

// Create a visualization function
// ====================================
// We called a "visualize" function on the data obtained with d3's .csv method.
// This function handles the visual manipulation of all elements dependent on
// the data
const visualize = (data) => {
//
//   // Configure tree map
//   chart = {
//     const root = treemap(data);
//
//     const svg = d3.create("svg")
//         .attr("viewBox", [0, 0, width, height])
//         .style("font", "10px sans-serif");
//
//     const leaf = svg.selectAll("g")
//       .data(root.leaves())
//       .join("g")
//         .attr("transform", d => `translate(${d.x0},${d.y0})`);
//
//     leaf.append("title")
//         .text(d => `${d.ancestors().reverse().map(d => d.data.name).join("/")}\n${format(d.value)}`);
//
//     leaf.append("rect")
//         .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
//         .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
//         .attr("fill-opacity", 0.6)
//         .attr("width", d => d.x1 - d.x0)
//         .attr("height", d => d.y1 - d.y0);
//
//     leaf.append("clipPath")
//         .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
//       .append("use")
//         .attr("xlink:href", d => d.leafUid.href);
//
//     leaf.append("text")
//         .attr("clip-path", d => d.clipUid)
//       .selectAll("tspan")
//       .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
//       .join("tspan")
//         .attr("x", 3)
//         .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
//         .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
//         .text(d => d);
//
//     return svg.node();
//   }
//
}


// Interactive Tree
// ====================================
// Samir's code:
var margin = {top: 20, right: 120, bottom: 20, left: 180},
width = 960 - margin.right - margin.left,
height = 480 - margin.top - margin.bottom;

var i = 0,
duration = 750,
root;

var tree = d3.layout.tree()
.size([height, width]);

var diagonal = d3.svg.diagonal()
.projection(function(d) { return [d.y, d.x]; });


d3.json("static/data/rules.json", function(error, flare) {
  if (error) throw error;

  root = flare;
  root.x0 = height / 2;
  root.y0 = 0;

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  root.children.forEach(collapse);
  update(root);
});

d3.select(self.frameElement).style("height", "480px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
  links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
  .attr("class", "node")
  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
  .on("click", click);

  nodeEnter.append("circle")
  .attr("r", 1e-6)
  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
  .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
  .attr("dy", ".35em")
  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
  .text(function(d) { return d.name; })
  .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
  .duration(duration)
  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
  .attr("r", 4.5)
  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
  .duration(duration)
  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
  .remove();

  nodeExit.select("circle")
  .attr("r", 1e-6);

  nodeExit.select("text")
  .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
  .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
  .attr("class", "link")
  .attr("d", function(d) {
    var o = {x: source.x0, y: source.y0};
    return diagonal({source: o, target: o});
  });

  // Transition links to their new position.
  link.transition()
  .duration(duration)
  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
  .duration(duration)
  .attr("d", function(d) {
    var o = {x: source.x, y: source.y};
    return diagonal({source: o, target: o});
  })
  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}
