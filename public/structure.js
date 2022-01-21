const width = 1300;
const height = 800;
const stroke = '#ccc';


function dendogram(data, svg, width, height){
  //d3.select(svg)
  const cluster = d3.cluster()
    .size([height, width - 520]);  // 100 is the margin I will have on the right side

  // Give the data to this cluster layout:
  const root = d3.hierarchy(data, function(d) {
      return d.children;
  });
  cluster(root);


  svg.selectAll('path')
  .data( root.descendants().slice(1) )
  .join('path')
  .attr("d", function(d, i, e) {
      return "M" + d.y + "," + d.x
              + "C" + (d.parent.y + 40) + "," + d.x
              + " " + (d.parent.y + 250) + "," + d.parent.x // 50 and 150 are coordinates of inflexion, play with it to change links shape
              + " " + d.parent.y + "," + d.parent.x;
            })
  .style("fill", 'none')
  .attr('class', function(d,i,e) {
    if(i==0){return `child${i}`}
    else {
      return d.parent.data.name == d.data.name ? e[i-1].className.baseVal : `child${i}`
    }
  })
  .attr("stroke", stroke)

   // Add a circle for each node.
  svg.selectAll("g")
  .data(root.descendants())
  .join("g")
  .attr("transform", function(d) {
      return `translate(${d.y},${d.x})`
  })
  .append("circle")
    .attr("r", 7)
    .style("fill", "#69b3a2")
    .attr("stroke", "black")
    .style("stroke-width", 2);

  //hover text
  svg.selectAll("g")
  .data(root.descendants())
  .join("g")
  .attr("transform", function(d) {
      return `translate(${d.y},${d.x})`
  })  
  .append("text")
    .attr("opacity", "0")
    .text(function(d){
      return d.data["desc"]
    })
    .attr("class", "text")
    .attr("transform", function(d,i){
      if(d.children) {return ("translate(-20, -10)")}
      else {return ("translate(-40, -10)")}
    })
    .on("mouseover", function(e,d){
      //console.log(e)
      d3.select(e.target).classed("display", true)
    })
    .on("mouseleave", function(e,d){
      //console.log(e)
      d3.select(e.target).classed("display", false)
    })

  //Nome nodi
  svg.selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", function(d,i) {
        return `translate(${d.y},${d.x})`
    })
    .append("text")
    .text(function(d) {
          return d.data.name;
  	})
    .attr("class", "text")
    .attr("transform", "translate(-20, 30)");
}

function sfaso(n){
  if(n%2==0){return 30}
  else{return -10}
}


// append the svg object to the body of the page
const svg = d3.select("#canva")
  .select("svg")
    .attr("overflow", "visible")
    .attr("class", "noshow")
    .attr("width", width + 200)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,0)")  // bit of margin on the left = 40
    .attr("overflow", "visible");


const svg2 = d3.select("#canva2")
  .select("svg")
    .attr("overflow", "visible")
    .attr("class", "noshow")
    .attr("width", width/2)
    .attr("height", height/2)
    .append("g")
    .attr("transform", "translate(40,0)")  // bit of margin on the left = 40
    .attr("overflow", "visible");


document.getElementById("funcs").addEventListener("click", function(){
  d3.select("#strSvg").classed("noshow", true);
  $("#func").toggleClass("noshow");
})

document.getElementById("str").addEventListener("click", function(){
  d3.select("#func").classed("noshow", true);
  $("#strSvg").toggleClass("noshow");
})
    
dendogram(data[0], svg, width, height);
dendogram(data[1], svg2, width/2, height/2);
