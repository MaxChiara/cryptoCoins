const hardLimit = 5000;
let coinIdMap = [];
let geckoIdMap = [];
let idGecko; // id della valuta gecko corrispondente a quella coinMarket
let historyData = {};//oggetto con dati storici per il grafico tornati dalla fetch

//reupero id dall'url

let paramsString = window.location.href.slice(window.location.href.indexOf('?')+1); //ottengo stringa con solo i query parameters
let params = paramsString.split('&');
let idPar = params.filter(e=>e.includes('id'));
idPar = idPar[0].split('=');
idGraph = idPar[1];

//FETCH coinMarket data

function getCryptoData(id) {
	let onLoadReqHeader = new Headers({
		'Content-Type': 'text/json',
		'accept': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'id': id,
		'convert': 'EUR',
	})
	
	let onLoadReqObj = {
		method: "GET",
		mode: "cors",
		headers: onLoadReqHeader,
	}

	let onLoadReq = new Request(url+'/'+tabellaFetch, onLoadReqObj);

	fetch(onLoadReq)
	.then(response=> response.json())
	.then(function (data) {
		let sym = data.data[id].symbol.toLocaleLowerCase();
		fetchIDGecko(sym);
		return data
	})
	.then(data => {
		graphInfoWrapper([id]);
		populateTable(data,id);
		formatNumbers();
		formatValues();
		formatGreenRed();
	})
	.catch(err=> console.log('Errore nella prima chiamata: ', err))
}



//FETCH JSON ID coin\gecko
/*
function fetchCoinHistoryData(id) {	//id = id valuta CoinMarket Cap di cui vuoi fare il grafico. Funzione da cui parte tutto
	let loadReqHeader = new Headers({
		'Content-Type': 'text/json',
		'accept': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'limit': hardLimit,
	})

	let loadReqObj = {
		method: "GET",
		mode: "cors",
		headers: loadReqHeader,
	}

	let loadReq = new Request(url+'/'+coinIdMapUrl, loadReqObj);
	fetch(loadReq)
		.then(response=>response.json())
		.then(data => {
			coinIdMap = data; //TESTING
			let symbol = data['data'].find(o=>o.id==id)['symbol'];
			fetchIDGecko(symbol.toLowerCase());
			
		})
		//.then(fetchHistoricData(idGecko))
		.catch(err => console.log('Errore nel caricamento di '+ coinIdMapUrl, err))
}
*/

function fetchIDGecko(coinId=''){	//può accettare un parametro che è il symbol di coinMarketCap che vuoi trovare su gecko
	let loadReqHeader = new Headers({	//se no recupera tutti gli id
		'Content-Type': 'text/json',
		'accept': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'gecko':true
	})

	let loadReqObj = {
		method: "GET",
		mode: "cors",
		headers: loadReqHeader,
	}

	let loadReq = new Request(url+'/'+geckoIdMapUrl, loadReqObj);

	fetch(loadReq)
		.then(response=>response.json())
		.then(data => {
			if (coinId){
				idGecko = getGeckoId(data,coinId);
				//return idGecko;
			}
			else {
				geckoIdMap = data //TESTING
			}
			fetchHistoricData(idGecko)
		})
		//.then(fetchHistoricData(idGecko))
		.catch(err => console.log('Errore nel caricamento di '+ geckoIdMapUrl, err))
}


/*funzione che accetta come parametri: -file Json con tutti gli id di gecko
										-id CoinMarketCap da cercare
Torna l'id corrispondete di gecko*/
function getGeckoId(coinsList, coinId) {	
	return coinsList.find(o=> o.symbol ==coinId).id
}



function fetchHistoricData(id){	//recupera i dati storici per fare il grafico
	let loadReqHeader = new Headers({	
		'Content-Type': 'text/json',
		'accept': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'gecko':true,
		'id' : id 
	})

	let loadReqObj = {
		method: "GET",
		mode: "cors",
		headers: loadReqHeader,
	}

	let loadReq = new Request(url+'/'+id+'History'+'.json', loadReqObj);
	console.log(id);
	fetch(loadReq)
		.then(response=>response.json())
		.then(data => {
			historyData = data;
			remakeDateObj(data);  
			makeGraphWrapper()				   
		})
		.catch(err => console.log('Errore nel caricamento di '+ geckoIdMapUrl, err))
}

function remakeDateObj(data) {	//data=riposta json della fetch
	for(i=0; i<data.length; i++) {		//i dati della fetch con le date riconvertite in oggetti Date (arrivano come stringhe) vengono salvati in historyData
		historyData[i][0] = new Date(data[i][0]);
		historyData[i][1] = data[i][1];
	}
}

// invoco la funzione principale
getCryptoData(idGraph);

function populateTable(data, id) {
	document.getElementsByClassName('Name')[0].textContent = data.data[id].name;
	document.getElementsByClassName('Total_Supply')[0].textContent = data.data[id].total_supply;
	document.getElementsByClassName('Max_Supply')[0].textContent = data.data[id].max_supply;
	document.getElementsByClassName('Trading_Volume_24h')[0].textContent = data.data[id].quote['EUR'].volume_24h;
	document.getElementsByClassName('Price_change_1h')[0].textContent = data.data[id].quote['EUR'].percent_change_1h;
	document.getElementsByClassName('Price_change_24h')[0].textContent = data.data[id].quote['EUR'].percent_change_24h;
	document.getElementsByClassName('Price_change_7d')[0].textContent = data.data[id].quote['EUR'].percent_change_7d;
	document.getElementsByClassName('Price_change_30d')[0].textContent = data.data[id].quote['EUR'].percent_change_30d;
	document.getElementsByClassName('Market_cap')[0].textContent = data.data[id].quote['EUR'].market_cap;
	document.getElementsByClassName('Value')[0].textContent = data.data[id].quote['EUR'].price;
}

function graphInfoWrapper(ids) { //ids = id delle valute che deve fecthare

	idFetchedArticle = ids;

let infoReqHeader = new Headers({
	'Content-Type': 'text/json',
	'accept': 'application/json',
	'Access-Control-Allow-Origin': '*',
	'id': ids[0],
})

let infoReqObj = {
	method: "GET",
	mode: "cors",
	headers: infoReqHeader,
}

let infoReq = new Request(url +'/'+cryptoInfo, infoReqObj);


fetch(infoReq)
	.then(response=> response.json())
	.then(data=> {
		infoObj = data; //TESTING
		return data
	})
	.then(data=> { 
		addLogo(data, ids);
		populateUrls(data, ids[0]);
		checkTextLength();
		return data
	})
	.then(data=>addArticles(data))
	//.then(data=>addArticles(data, homeNumRows))
	.catch(err => console.log('ERROR!:', err));
}

function populateUrls(data, id) {
	document.getElementById("site").href = data.data[id].urls['website'][0];
	document.getElementById("site").textContent = data.data[id].urls['website'][0];
	document.getElementById("reddit").href = data.data[id].urls['reddit'][0];
	document.getElementById("reddit").textContent = data.data[id].urls['reddit'][0];
	document.getElementById("technicalDoc").href = data.data[id].urls["technical_doc"][0];
	document.getElementById("technicalDoc").textContent = data.data[id].urls["technical_doc"][0];
	document.getElementById("sourceCode").href = data.data[id].urls["source_code"][0];
	document.getElementById("sourceCode").textContent = data.data[id].urls["source_code"][0];
}

function checkTextLength() {
	if(document.getElementById("technicalDoc").textContent.length > 44) {
		document.getElementById("technicalDoc").textContent = document.getElementById("technicalDoc").textContent.slice(1,38) + "..."
	}
}