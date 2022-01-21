//const hardLimit = 5000;
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
getCryptoData(idGraph);   //__________TESTING

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
	.then(data=>{
		addIco(data);
		addArticles(data)
	})
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

function addIco(data) {
	document.getElementById("Ico").src = data.data[idFetchedArticle].logo;
	document.getElementById("icoTitle").textContent = data.data[idFetchedArticle].name;

}
//OFFLINE TESTING
/*
const D = [
    [
        "2021-12-08T13:56:55.803Z",
        "3823.9"
    ],
    [
        "2021-12-01T13:56:55.803Z",
        "4092.1"
    ],
    [
        "2021-11-16T13:56:55.803Z",
        "4032.9"
    ],
    [
        "2021-11-01T13:56:55.803Z",
        "3713.4"
    ],
    [
        "2021-10-17T12:56:55.803Z",
        "3322.9"
    ],
    [
        "2021-10-01T12:56:55.803Z",
        "2603.6"
    ],
    [
        "2021-09-16T12:56:55.803Z",
        "3042.1"
    ],
    [
        "2021-09-01T12:56:55.803Z",
        "2913.0"
    ],
    [
        "2021-08-17T12:56:55.803Z",
        "2677.4"
    ],
    [
        "2021-08-01T12:56:55.803Z",
        "2141.8"
    ],
    [
        "2021-07-17T12:56:55.803Z",
        "1587.6"
    ],
    [
        "2021-07-01T12:56:55.803Z",
        "1922.6"
    ],
    [
        "2021-06-16T12:56:55.803Z",
        "2112.5"
    ],
    [
        "2021-06-01T12:56:55.803Z",
        "2213.9"
    ],
    [
        "2021-05-17T12:56:55.803Z",
        "2964.5"
    ],
    [
        "2021-05-01T12:56:55.803Z",
        "2310.2"
    ],
    [
        "2021-04-16T12:56:55.803Z",
        "2100.6"
    ],
    [
        "2021-04-01T12:56:55.803Z",
        "1633.7"
    ],
    [
        "2021-03-17T13:56:55.803Z",
        "1519.5"
    ],
    [
        "2021-03-01T13:56:55.803Z",
        "1171.8"
    ],
    [
        "2021-02-14T13:56:55.803Z",
        "1494.0"
    ],
    [
        "2021-02-01T13:56:55.803Z",
        "1086.3"
    ],
    [
        "2021-01-17T13:56:55.803Z",
        "1022.1"
    ],
    [
        "2021-01-01T13:56:55.803Z",
        "604.7"
    ],
    [
        "2020-12-17T13:56:55.803Z",
        "521.4"
    ]
]
historyData = D;
remakeDateObj(D);  
makeGraphWrapper()	
*/