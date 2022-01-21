let scrollTabella = true;
let scrollArticles = true;
let limit = 50;
var homeNumRows = 6;
const hardLimit = 5000;
let idsFetch;
let sort = 'market_cap'
let idList = []
let coinIdMap = [];
let geckoIdMap = [];
let idGecko; // id della valuta gecko corrispondente a quella coinMarket
let historyData = {};//oggetto con dati storici per il grafico tornati dalla fetch


let dataObj, infoObj;



// API Requests

//crypto data

function loadHometable(start, limit, sort, info=true) {
let onLoadReqHeader = new Headers({
	'Content-Type': 'text/json',
    'accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
	'start': start,
    'limit': limit,
    'convert': 'EUR',
	'sort': sort,
})

let onLoadReqObj = {
	method: "GET",
	mode: "cors",
	headers: onLoadReqHeader,
}

let onLoadReq = new Request(url+'/'+onLoadData, onLoadReqObj);

idList = []; //lista degli id delle valute recuperate dalla seguente fetch. scrollArticlesA\B scorrono questa lista

fetch(onLoadReq)
	.then(response=> response.json())
	.then(data => {
		dataObj = data;	//TESTING
		return data
	})
	.then(function (data) {
		compilaHomeTable(data, homeTableKeys, homeTableValues, homeNumRows);
		createIdList(data);
		if(info) {cryptoInfoWrapper(idList)};		//avvolgo la seconda chiamata nella funzione cryptoInfoWrapper() 
											//perchè ho bisogno che venga prima finita la func compilaHomeTable()
		formatNumbers();
		formatValues();
		formatGreenRed();
		addHref(idList);
		visualizzaDatiScroller(start, limit, homeNumRows);
		applyCanOrder();
		
	})
	.catch(err=> console.log('Errore nella prima chiamata: ', err))
}


function scorriHomeTable(ids) {
	let onLoadReqHeader = new Headers({
		'Content-Type': 'text/json',
		'accept': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'id': ids.join(),
		'convert': 'EUR',
	})
	
	let onLoadReqObj = {
		method: "GET",
		mode: "cors",
		headers: onLoadReqHeader,
	}

	let onLoadReq = new Request(url+'/'+tabellaFetch, onLoadReqObj);

	idsFetch = ids;

	fetch(onLoadReq)
	.then(response=> response.json())
	.then(function (data) {
		scrollTable(data, homeTableKeys, homeTableValues, homeNumRows);
		formatNumbers();
		formatValues();
		formatGreenRed();
		visualizzaDatiScroller(start, end, homeNumRows);
		addHref(idsFetch)
	})
	.catch(err=> console.log('Errore nella prima chiamata: ', err))
}


let idFetchedArticle = []; // id delle valute che verranno passate alla fetch di cryptoInfoWrapper()
let currentId = 0; // a che punto sono gli articoli nella lista idList, index.
let currentIdTabella = 0; // a che punto è la tabella nella lista idList, index.



function scrollAll(avanti) {
	changeHomeNumRows();
	if (avanti) {
		start += homeNumRows;
		limit = start + homeNumRows;
	}
	else {
		start -= homeNumRows;
		limit = start + homeNumRows;		
	}
	if (limit > hardLimit) {
		limit = hardLimit;
	}
	if (start <= 0) {
		start = hardLimit - homeNumRows +1;
		limit = hardLimit
	}
	else if (start >= hardLimit) {
		start = 1;
		limit = homeNumRows
	}
	let diff = homeNumRows - document.getElementsByClassName('nameLogo').length;
	if (diff < 0) {
		clearTable(homeNumRows)
	}
	else if (diff > 0) {
		rowCreator(diff)
	}
	
	loadHometable(start, limit, sort, false);
	hideLogo();
	console.log(`Start:${start} Limit: ${limit}`)
}

function scrollT(avanti) {
	if (avanti) {
		if (start + coinsPerPagina >= limite) {
			start = 0;
			end = coinsPerPagina;
		}
		else {
			start += coinsPerPagina;
			end += coinsPerPagina;
		}
	}
	else {
		if (start - coinsPerPagina < 0) {
			start = limite - coinsPerPagina;
			end = limite;
		}
		else {
			start -= coinsPerPagina;
			end = start + coinsPerPagina;
		}
	}
	aggiornaTabellaFetch(allId.slice(start, end));
	visualizzaDatiScroller(start, limite, coinsPerPagina);		
}


if (window. location.pathname == "/indexAll.html") {showAll()}
else if(window. location.pathname != '/graph'){ //attivo la chiamata API solo se non siamo in una pagina grafico
	//creo le <tr> della tabella
	rowCreator(homeNumRows); 
	loadHometable(start, limit, sort);
	addArrowHoverEvents()
}
