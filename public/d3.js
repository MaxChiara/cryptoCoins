var widthCanva = 800;
var heightCanva = 450; //width e height totali compreso margin
var margin = {'top': 50, 'right': 30, 'bottom': 50, 'left': 30};
var width = widthCanva - margin.left - margin.right;
var height = heightCanva - margin.top - margin.bottom;
var maxValue; //valore massimo asse y
let valueList = [];    //lista temp con solo valori di data (no oggetto Date)
let Xtranslate = 50;    //translate(Xtranslate,) applicato a tutti i <g>
const extWidth= width+350;//grid extension width

function makeGraphWrapper() {

//considero solo i valori della valuta per determinare quello + alto, per impostare altezza ascisse
historyData.forEach((e)=> valueList.push(e[1]));
maxValue = Math.max(...valueList);

timeScale = d3.scaleTime()
    .domain([historyData.at(-1)[0], historyData[0][0]])
    .range([0, width]);

valueScale = d3.scaleLinear()
    .domain([0,maxValue])
    .range([height, 0])

let axis = d3.axisBottom(timeScale);
let ord = d3.axisLeft(valueScale);
let ordGrid = d3.axisLeft(valueScale)
            .tickFormat('');
ord.ticks( null,"$f");
ord.tickPadding('40');

var svg = d3.select('.svgClass').attr('width', "100%").attr('height', "100%");

d3.select('.intero')
    //.attr('width', "80%")   //  \ _Non cambia?
    //.attr('height', "80%")  //  /
    .attr('transform', 'translate(50, 50)');

d3.select('path')    //creo la linea
    .datum(historyData)
    .style('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 1)
    .attr('d', d3.line()
        .x(d=> timeScale(d[0]))
        .y(d=> valueScale(d[1]))
    )

d3.select('.points')    //cerchi
    .selectAll('circle')
    .data(historyData)
    .join('circle')
    //.style('fill', 'rgb(110 179 255 / 88%)')
    .attr('r', 2)
    .attr('opacity', 1)
    .attr('stroke', 'transparent')
    .attr('stroke-width', 40)
 
    /*function(d, i,w) {
        
        let dataA = d3.selectAll(w).data();
       if(i ==0 || i == (dataA.length-1)){return 2}
       else if(dataA[i-1][1] > dataA[i][1] && dataA[i+1][1] > dataA[i][1]) {return 3}
       else if(dataA[i-1][1] < dataA[i][1] && dataA[i+1][1] < dataA[i][1]) {return 3}
       else {return 2}  
       
    })*/
    .attr('cy', (d)=> {return valueScale(d[1])})
    .attr('cx', (d)=> {return timeScale(d[0])})
    .on("mouseover", function(e, d) {
        const index = Array.from(this.parentElement.children).indexOf(this);
        const te = d3.select('.points').selectAll('g')._groups[0][index];
        d3.select(te)
            .attr('transform', (d) => {
                let x = 0;
                let y = 0;
               /* if ((valueScale(0) - valueScale(d[1])) < 50) { //controllo se la distanza dall'elemento (valueScale(d[1])) all'inizio (valueScale(0)) dell'asse è < 50px
                    //return "translate(-5, -50)"
                    y = -50;
                }*/
                if(index<2) {x=-75}
                return "translate("+x+", "+y+")";

            })
            .style("opacity", 1);
        const te2 = d3.select(".popup").selectAll("g")._groups[0][index];
        d3.select(te2)
            //.attr('display', "inline")
            .style('opacity', 1)
      })
    .on("mouseleave", function(e, d) {
        const index = Array.from(this.parentElement.children).indexOf(this);
        const te = d3.select('.points').selectAll('g')._groups[0][index];
        setTimeout(function() {
        d3.select(te)
            .style("opacity", 0)
            .attr('transform', 'translate(0,999)');
         //d3.select(this).style("opacity", 0)
        }, 0)
        const te2 = d3.select(".popup").selectAll("g")._groups[0][index];
        d3.select(te2)
            //.attr('display', "none")
            .style('opacity', 0)
      })
      ;

d3.select('.points')    //rect
    .selectAll('g')
    .data(historyData)
    .join('g')
    .style("opacity", 0)
    .attr('transform', 'translate(0,999)') //quando non sono visibili li metto fuori dalle balle così non danno fastidio a 'mouseover'
    .append('rect')
    .attr('rx', 5)
    .attr("class", "tooltip")
    .attr('x', function(d) {
		return (timeScale(d[0]) + 10);
	})
    .attr('y', (d)=> {return valueScale(d[1]) - 36});



d3.select('.points')    //testo
    .selectAll('g')
    .data(historyData)
    .join('g')
    .append('text') 
    .attr('transform', 'translate(14, -19)')
    .append('tspan')    //popup prezzo
    .attr('x', (d) => timeScale(d[0]))
    .attr('y', (d) => valueScale(d[1]))
    .attr('dy', 0)
    .text(function(d) {
        return d[1] + " " + "\u20ac";
	})
    .append('tspan')    //popup data
    .attr('dy', 20)
    .attr('x', (d) => timeScale(d[0]) - 10)
    //.attr('y', (d) => valueScale(d[1]))
    .attr('y', heightCanva - margin.top - margin.bottom + 35)
    .text(function(d) {
        return d[0].toDateString().slice(4);
	});

//popup linee e cerchi
d3.select('svg')
    .select(".intero")
    .select('.popup')
    .selectAll('g')
    .data(historyData)
    .join('g')
    .attr('class', 'subpop')
    .style('opacity', 0)
    .append("line")
    .style("stroke-width", 1)
    .style("stroke-dasharray", 8)
    .attr("x1", (d)=> {return timeScale(d[0])})
    .attr("y1", (d)=> {return valueScale(d[1])})
    .attr("x2", (d)=> {return timeScale(d[0])})
    .attr("y2", heightCanva - margin.top - margin.bottom);
    

    
d3.select('svg')    //cerchi popup su asse x
    .select('.popup')
    .selectAll('.subpop')
    .data(historyData)
    .join('.subpop')
    .append("circle")
    .attr('r', 3)
    .attr('cy', heightCanva - margin.top - margin.bottom)
    .attr('cx', (d)=> {return timeScale(d[0])});



d3.selectAll('circle').attr('fill', '#ffffff');

//linee decorative
/*
d3.select(".intero")
    .select(".art")
    .append("g")
    .attr("class", "artlines")
    .selectAll("line")
    //.curve()
    .data(historyData)
    
    .join("line")
    
    .attr("class", "artline")
    .style("stroke-width", 1) 
    .attr("x1", (d)=> {return timeScale(d[0])})
    .attr("y1", (d)=> {return valueScale(d[1])})
    .attr("x2", (d,i) => {if(i%2==0){
        return width
    } else return 0})
    .attr("y2", (d,i) => {if(i%2==0){
        return heightCanva - margin.top - margin.bottom
    } else return 0});
*/


const yGrid = d3.axisLeft(valueScale)   //creo grid lines 
    .tickSize(width+350)
    .tickFormat('')
    .ticks(5);

d3.select('.intero')    //attacco grid lines 
    .append('g')
    .attr('class', 'yGrid')
    .attr('transform', `translate(${extWidth},0)`)
    .call(yGrid);

//creo gradient?
/*gradient =   d3.select('.intero')
                .select('.yGrid')
                .append('defs')
<defs>
<linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%"   stop-color="#05a"/>
  <stop offset="100%" stop-color="#0a5"/>
</linearGradient>
</defs>
*/

//gradient
var defs = svg.select(".intero").append("defs");
var gradient = defs.append("linearGradient")
.attr("id", "svgGradient")
.attr("x1", "0%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%");
gradient.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "rgb(110 142 207)")
.attr("stop-opacity", 0);
gradient.append("stop")
.attr("class", "end")
.attr("offset", "50%")
.attr("stop-color", "rgb(110 142 207)")
.attr("stop-opacity", 1);
gradient.append("stop")
.attr("class", "end")
.attr("offset", "90%")
.attr("stop-color", "rgb(110 142 207)")
.attr("stop-opacity", 0);



d3.select('.ascisse')
    .attr('transform', `translate(0, ${height})`)
    .call(axis);

d3.select('.ordinate')
    .call(ord);


//d3.select("#linear").attr("gradientUnits", "ObjectBoundingBox")

//grid extensions
d3.select(".intero")
    .select(".yGrid")
    .selectAll(".tick")
    .each(function(d,i){
        var tick = d3.select(this);
        line = tick.select('line');
        
        if (i==0) return 1;    
        tick.insert('rect', ':first-child')
            .attr('x', parseInt(line.attr("x2"))-200)
            .attr('y', 0)
          .attr('height', 0.5)
          .attr('width', `${extWidth + 200}`)
          .style('fill', "url(#svgGradient)");
        
      });



/*var xTextTicks = d3.select('.intero').select('.ascisse').selectAll('.tick')["_groups"][0];

for(i=1; i<xTextTicks.length;i+=2){
    d3.select(xTextTicks[i]).select('text').attr('dy', 15)
}*/



}







/*d3.select('.points')    //testo
    .selectAll('text')
    .data(historyData)
    .join('text')
    .style('font-size', '14px')
    .style('fill', '#00ddbc')
    .attr('x', function(d) {
		return (timeScale(d[0]));
	})
    .attr('y', (d)=> {return valueScale(d[1])})
	.text(function(d, i,w) {
        //return d[1]; -> ogni punto mostra il testo
        //return dataA[i][1]; uguale usando 
        let dataA = d3.selectAll(w).data();
       if(i ==0 || i == (dataA.length-1)){return dataA[i][1]}
       else if(dataA[i-1][1] > dataA[i][1] && dataA[i+1][1] > dataA[i][1]) {return dataA[i][1]}
       else if(dataA[i-1][1] < dataA[i][1] && dataA[i+1][1] < dataA[i][1]) {return dataA[i][1]}
       else {return null}   //testo mostrato solo se un picco   
	});*/