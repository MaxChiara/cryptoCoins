//Darkmode
let textArray = ['th', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'label']
function changeTextColor(element, parent) {	//element = elemento html di vui si vuole cambiare il colore
											//parent = parent element all'interno del quale agisce la funzione
	let tagElement = parent.getElementsByTagName(element);
	for (j = 0; j<tagElement.length; j++){
		tagElement[j].style.color = tagElement[j].style.color == dark ? chiaro : dark;
	}
}
function darkmode(){
	document.getElementById('lightSwitch').className = 'lightOff';
	document.getElementsByTagName('body')[0].className = 'darkBackground';
	localStorage.setItem('darkmode', 'yes');
	//textArray.forEach(changeTextColor(element, 'document'));
	for (i=0; i<textArray.length; i++) {
		changeTextColor(textArray[i], document)
	}
	formatGreenRed();
	colorValues()
}  
function lightmode(){
	document.getElementById('lightSwitch').className = 'lightOn';
	document.getElementsByTagName('body')[0].className = 'lightBackground';
	localStorage.setItem('darkmode', 'no');
	//textArray.forEach(changeTextColor('document'));
	for (i=0; i<textArray.length; i++) {
		changeTextColor(textArray[i], document)
	}
	formatGreenRed();
	colorValues()
}
function dswitch(ds){
	if (ds.className == 'lightOff') {
		lightmode();
	} else {
		darkmode();
	}	
}
// /darkmode