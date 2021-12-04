let dataObjChecked;
let coinsPerPagina = 50; //mi serve conservare il valore iniziale di end per quando
						 //scroll() va oltre il limite
let end = coinsPerPagina;
let startB = 0;
let start = 1;
limite = 400; //id toatli che vengono fetchati
if(!window.location.href.includes('graph')) {getIds(start, end, true)};


//tabella iniziale scorre 4 pagine da 25 ciascuna ->idList deve fare riferimento a 100
//													cambia start
//tabella checklist scorre tutte 100 ->quindi stessa idList di tabella iniziale
//quindi tabella iniziale = prime 25 di tabella checklist
//tabella iniziale che scorre = chiamata aggiornaFetchTable con start ogni 25
//altra pagina con tutte 1000? o tutte 7000+?


//aggiungo l'event listener al form
document.getElementById("cryptoTable").addEventListener("submit", function(event) {
	event.preventDefault();
	moreTableId = [];
	for(i=0; i<event.target.length ; i++) {			//così metto in homeTableId gli Id delle valute che devo mostrare
		if (event.target[i].checked) {				//li mando nella fetch, saranno quindi allineati con la risposta:
			moreTableId.push(event.target[i].value);//homeTableId[0] = response.data[0]
		}												
	}													
	console.log("Preso!");
	nascondiDatiScroller();
	hideElements('secondario');
	aggiornaTabellaFetch(moreTableId);
	formatGreenRed();
	showCryptos()
})

//event listener enter input numbers

document.getElementById('coinsPerPagina').addEventListener('keyup', function(event) {
	if (event.key == 'Enter') {applicaUserValue()}
})
document.getElementById('numValuteTotali').addEventListener('keyup', function(event) {
	if (event.key == 'Enter') {applicaUserValue()}
})


// API Requests



function aggiornaTabellaFetch(id) {

	dataObjChecked = {};
	

	let reqHeader = new Headers({
		'Content-Type': 'text/json',
		'accept': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'convert': 'EUR',
		'id': id.join(),
	})
	
	let reqObj = {
		method: "GET",
		mode: "cors",
		headers: reqHeader,
	}
	console.log(url +'/'+tabellaFetch);
	let req = new Request(url +'/'+tabellaFetch, reqObj);

	fetch(req)
	.then(response=> response.json())
	.then(data => {
		dataObjChecked = data;
		clearTable();
		return data
	})
	.then (function (data) {
		rowCreator(id.length);  //ricreo le righe della tabella secondo quante crypto sono state richieste
		return data
	})	
	.then(function (data) {
		compilaQuoteTable(data, homeTableKeys, quoteTableValues, id.length, id);						
	})									
	.then(function () {
		cryptoInfoWrapper(id);				//avvolgo la seconda chiamata nella funzione cryptoInfoWrapper() 
											//perchè ho bisogno che venga prima finita la func compilaHomeTable()
		formatNumbers();
		formatValues();
		formatGreenRed();	
		addHref(id);			
	})									
	.catch(err=> console.log('Errore nella chiamata a tabella.json: ', err))

}



function getIds(start, end, first=false) {	//funzione che raccoglie tutti gli id delle valute in moreTableId
											//e crea la tabella dove scegliere le valute da visualizzare
	let onLoadReqHeader = new Headers({
		'Content-Type': 'text/json',
		'accept': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'limit': limite,
		'sort': "cmc_rank",
	})
	
	let onLoadReqObj = {
		method: "GET",
		mode: "cors",
		headers: onLoadReqHeader,
	}

	let onLoadReq = new Request(url+'/'+coinsId, onLoadReqObj);

	// + di 7000 coins, non posso visualizzare tutto.
	allId = [];

	fetch(onLoadReq)
		.then(response=> response.json())
		.then(data=> {
			for (i=0; i<data.data.length; i++) {
				allId.push(data.data[i].id)
			}
			return data
		})
		.then(data=> {
			console.log(moreTableId); //testing
			idMap = data.data;
		return idMap
		}) 
		.then(data=> {
			createCheckboxes(data);
			return data
		})
		.then(data=> {
			createCheckList(data, checkList);
			nameCheckboxes(checkList);
			if (!first) aggiornaTabellaFetch(allId.slice(start, end));
			visualizzaDatiScroller(start, limite, coinsPerPagina);		
		})
		//.then(aggiornaTabellaFetch()) 
		.catch(err=> console.log('Error' + err))
}




//crypto info request

/*function cryptoInfoWrapper(id) {

let infoReqHeader = new Headers({
	'Content-Type': 'text/json',
	'accept': 'application/json',
	'Access-Control-Allow-Origin': '*',
	'id': id.join(),
})

let infoReqObj = {
	method: "GET",
	mode: "cors",
	headers: infoReqHeader,
}

let infoReq = new Request(url +'/'+cryptoInfo, infoReqObj);

var rezp;

fetch(infoReq)
	.then(response=> {
		rezp = response;
		console.log(response);
		return response.json()
	})
	.catch(err => {
		console.log(err)
	})
	.then(data=> {
		console.log(data);
		addLogo(data, id);
		//checkCryptoTable(data);
		infoObj = data;
		formatGreenRed()
	})
	.catch(err => console.log('ERROR!:', err));
}
*/




function nascondiDatiScroller() {  
	let classArray = document.getElementsByClassName('segnaPagine'); 
	for(i=0; i<classArray.length; i++) {
		classArray[i].textContent= ''; 
	}
}

function applicaUserValue() {
	coinsPerPagina = parseInt(document.getElementById('coinsPerPagina').value);
	start = 0;
	end = coinsPerPagina;
	limite = parseInt(document.getElementById('numValuteTotali').value);
	getIds(start, end);
}

