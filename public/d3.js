var widthCanva = 800;
var heightCanva = 450; //width e height totali compreso margin
var margin = {'top': 30, 'right': 30, 'bottom': 30, 'left': 30};
var width = widthCanva - margin.left - margin.right;
var height = heightCanva - margin.top - margin.bottom;
var maxValue; //valore massimo asse y
let valueList = [];    //lista temp con solo valori di data (no oggetto Date)
let Xtranslate = 50;    //translate(Xtranslate,) applicato a tutti i <g>


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

var svg = d3.select('.svgClass').attr('width', '100%').attr('height', '100%');

d3.select('.intero')
    .attr('width', '100%')
    .attr('height', '100%');

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
    .style('fill', 'rgb(110 179 255 / 88%);')
    .attr('r', 2)
    .attr('opacity', 1)
    .attr('stroke', 'transparent')
    .attr('stroke-width', 20)
 
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
                let x = -5;
                let y = 10;
                if ((valueScale(0) - valueScale(d[1])) < 50) { //controllo se la distanza dall'elemento (valueScale(d[1])) all'inizio (valueScale(0)) dell'asse è < 50px
                    //return "translate(-5, -50)"
                    y = -50;
                }
                if(index<2) {x=-75}
                return "translate("+x+", "+y+")";

            })
            .style("opacity", 1)
      })
    .on("mouseleave", function(e, d) {
        const index = Array.from(this.parentElement.children).indexOf(this);
        const te = d3.select('.points').selectAll('g')._groups[0][index];
        d3.select(te)
            .style("opacity", 0)
            .attr('transform', 'translate(0,999)')
         //d3.select(this).style("opacity", 0)
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
		return (timeScale(d[0]));
	})
    .attr('y', (d)=> {return valueScale(d[1])});



d3.select('.points')    //testo
    .selectAll('g')
    .data(historyData)
    .join('g')
    .append('text') 
    .attr('transform', 'translate(4, 18)')
    .append('tspan')    //1 riga
    .attr('x', (d) => timeScale(d[0]))
    .attr('y', (d) => valueScale(d[1]))
    .attr('dy', 0)
    .text(function(d) {
        return d[1] + " " + "\u20ac";
	})
    .append('tspan')    //2 riga
    .attr('dy', 20)
    .attr('x', (d) => timeScale(d[0]))
    .attr('y', (d) => valueScale(d[1]))
    .text(function(d) {
        return d[0].toDateString().slice(4);
	});


d3.selectAll('circle').attr('fill', '#ffffff');


const yGrid = d3.axisLeft(valueScale)   //grid lines ordinate
    .tickSize(width)
    .tickFormat('')
    .ticks(5);
d3.select('.intero')
    .append('g')
    .attr('class', 'yGrid')
    .attr('transform', 'translate('+ width +',0)')
    .call(yGrid);

d3.select('.ascisse')
    .attr('transform', `translate(0, ${height})`)
    .call(axis);

d3.select('.ordinate')
    .call(ord);


/*var xTextTicks = d3.select('.intero').select('.ascisse').selectAll('.tick')["_groups"][0];

for(i=1; i<xTextTicks.length;i+=2){
    d3.select(xTextTicks[i]).select('text').attr('dy', 15)
}*/


d3.select('.intero').attr('transform', 'translate(50, 20)')
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