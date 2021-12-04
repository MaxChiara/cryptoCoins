const searchBar = document.getElementById('searchBar');
const instantSearchP = document.getElementById("instant-search-id");
let idSymbolObj;

searchBar.addEventListener('keyup', (e) => {
	let search = e.target.value.toLowerCase();
    const key = idSymbolObj.filter((element)=> element.name.includes(search));
	console.log(key);
	instantSearch(key.slice(0, 21), search); // compaiono solo i primi 20 risultati
    if (e.key == 'Enter'){
        const idArray = key.map(coin => coin.id);
        nascondiDatiScroller();
        hideElements('secondario');
        aggiornaTabellaFetch(idArray);
        formatGreenRed();
    }
})



function instantSearch(results, search) {
	let arr = document.getElementsByClassName("instant-search-result");
	if (arr) {
		while(arr[0]){
			//if (!arr[i].textContent.includes(search)) {arr[i].remove()}
			{arr[0].remove()}
		}
	}
	if(!search){
		while (instantSearchP.children.length>0) {
			instantSearchP.removeChild(instantSearchP.children[0])
		}
		return
	}
	results.forEach(element => {
		let a = document.createElement("a");
		a.innerHTML = `<a href="graph\?id=${element.id}" class="instant-search-result">${element.name}</a>`;
		instantSearchP.appendChild(a);
	})
}


//fetch json con name e symbol delle valute coinMarket per la search bar

function fetchNameSymbol() {
	let onLoadReqHeader = new Headers({
		'Content-Type': 'text/json',
		'accept': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'limit': 5000,
	})
	
	let onLoadReqObj = {
		method: "GET",
		mode: "cors",
		headers: onLoadReqHeader,
	}
	
	let onLoadReq = new Request(url+'/'+idSymbol, onLoadReqObj);
	
	
	
	fetch(onLoadReq)
		.then(response=> response.json())
		.then(data => idSymbolObj = data)
		.catch(err=> console.log('Errore nel recupero lista Nome-Symbol: ', err))
	}
	fetchNameSymbol();

