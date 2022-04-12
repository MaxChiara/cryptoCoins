const http = require('http');
const path = require('path');
const fs = require('fs');
const util = require('util');
const fetch = require('node-fetch');
const EventEmitter = require('events');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const Config = require('./config');


class MyEmitter extends EventEmitter {}

async function getCeckoCoinList(req, filePath, contentType, res) {
    let data = await CoinGeckoClient.coins.list();
    let geckoIdMapStr = JSON.stringify(data.data);
    const doneWritingEmitter = new MyEmitter();
    doneWritingEmitter.on('doneWriting', (filePath, contentType, res) => {       
        sendResponse(filePath, contentType, res);
    });
    fs.writeFile(path.join(__dirname, 'ApiData', req.url.slice(1)), geckoIdMapStr, (err)=>{
        if (err) throw err;
        doneWritingEmitter.emit('doneWriting', filePath, contentType, res)
    })
}

function getDates() {   //crea list di date per recuperari i dati storici di getHistoryData
    let dateObj = new Date();
    let geckoDateList = [];//date in formato accettato dall'API di gecko. Primo e metà del mese indietro per 'quantiMesi'
    let dateObjArray = []; //lista con gli oggetti Date corrispondenti a geckoDateList (in d3 mi serviranno gli oggetti Date)
    let quantiMesi = 12; //quanti mesi indietro va a prendere valori
    let day = dateObj.getDate();
    let month = dateObj.getMonth()+1;
    let year = dateObj.getFullYear();
    let dateB = new Date(dateObj.valueOf());
    dateObjArray.push(dateB);
    let d = day+'-'+(month)+'-'+year; 
    geckoDateList.push(d);
    for (i=0;i<quantiMesi;i++) {    //Recupera fino a 12 mesi indietro, ogni inizio e metà mese
        if (!(day==1)){day = dateObj.getDate(dateObj.setDate(1))} //controllo che non sia già il primo
        month = dateObj.getMonth()+1;
        year = dateObj.getFullYear();
        d = day+'-'+(month)+'-'+year;
        geckoDateList.push(d);
        let dateC = new Date(dateObj.valueOf());
        dateObjArray.push(dateC);
        day = dateObj.getDate(dateObj.setDate(dateObj.getDate()-15));
        month = dateObj.getMonth()+1;
        year = dateObj.getFullYear();
        d = day+'-'+(month)+'-'+year;
        geckoDateList.push(d);
        let dateD = new Date(dateObj.valueOf());
        dateObjArray.push(dateD);
    }    
    let returnList =[geckoDateList, dateObjArray]; //lista con [0] = lista con date per l'API gecko / [1] oggetti tipo Date per d3
    return returnList
}


async function getHistoryData(req, filePath, contentType, res, id) { //recupera dati storici di una valuta per il grafico
    const doneWritingEmitter = new MyEmitter(); //inizializzo event emitter per fare partire la risposta quando finisce la scrittura
    doneWritingEmitter.on('doneWriting', (filePath, contentType, res) => {       
        sendResponse(filePath, contentType, res);
    });
    //let dataObj = {}; //oggetto in cui raggrupperò i dati storici raccolti dalle chiamate API
    let dates = getDates();
    let geckoDates = dates[0];
    let objDates = dates[1];
    let finalDateList = [];
    for(i=0; i<geckoDates.length;i++) {
        try {
        let data = await CoinGeckoClient.coins.fetchHistory(id, {
            date:geckoDates[i],
            localization:false
        });
        //dataObj[dates[i]] = data.data.market_data.current_price['eur'];   
        console.log(objDates[i]);   
        console.log(data.data.market_data.current_price['eur'].toFixed(1));   
        finalDateList[i] = [objDates[i], data.data.market_data.current_price['eur'].toFixed(1)];
    }
    catch (error) {
        console.log(error);
        break
        //finalDateList[i] = [objDates[i], 0];
    }}
    let dataStr = JSON.stringify(finalDateList);
    fs.writeFile(path.join(__dirname, 'ApiData', req.url.slice(1)), dataStr, (err)=>{
        if (err) throw err;
        doneWritingEmitter.emit('doneWriting', filePath, contentType, res)
    })
}


function setContentType (extName) {       //funzione che accetta il nome dell'estensione del file richiesto
    let contentType = 'text/html'; 
    switch (extName) {
        case'.html':
            return contentType;
        case'.css':
            contentType = 'text/css';
            return contentType;
        case'.js':
            contentType = 'text/javascript';
            return contentType;
        case'.json':
            contentType = 'application/json';
            return contentType;
        case'.png':
            contentType = 'image/png';
            return contentType;
        case'.jpg':
            contentType = 'image/jpg';
            return contentType;
    }
}


function sendResponse(filePath, contentType, res) {
    fs.readFile(filePath, (err, content)=>{
        if(err) {
            if(err.code==='ENOENT'){
                //se non trova la pagina carico 404.html
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content)=>{
                    if (err){
                        console.log('404 page not found!');
                        throw err
                    }
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(content, 'utf8');
                })    
            }
            else {
                res.writeHead(500);
                res.end(`Server error: ${err.code}`)
            };
        } 
        else {
            res.writeHead(200, {'Content-Type': contentType});
            res.end(content)     
        }
        })
}




//creo la cartella ApiData, se c'è già ignoro l'errore
fs.mkdir(path.join(__dirname, 'ApiData'), err => {
    if (err){
        if (err.code==='EEXIST'){return}
        else throw err;
    }
console.log('ApiData folder created')
});


const server = http.createServer((req,res)=>{
    const queryParams = ['start', 'limit', 'price_min', 'price_max', 'market_cap_min', 'volume_24h_min', 'volume_24h_max', 
    'circulating_supply_min', 'circulating_supply_max', 'percent_change_24h_min', 'percent_change_24h_max', 	
    'convert', 'convert_id', 'sort', 'sort_dir', 'cryptocurrency_type',	'tag', 'aux', 'id', 'slug', 'gecko'];
    let filePath ='';
    var contentType;
    let idGraph;
    
    console.log(req.url);
    console.log(req.url === '/favicon.ico');
    //ignoro la richiesta di favicon
    if (req.url === '/favicon.ico'){
        res.writeHead(200, {'contentType': 'image/x-icon'});
        res.end();
        return
      }   


    //controllo se è una richiesta alla API Gecko
    if (req.headers['gecko']) {
        console.log('Ricevuta richiesta per API Gecko');
        console.log(req.url.slice(1));
        filePath = path.join(__dirname, 'ApiData', req.url);
        contentType = 'application/json';
        if (req.headers['id']){ // se c'è il paramentro id vuole dire che è una richiesta di  una valuta specifica per dati storici per il grafico
            getHistoryData(req, filePath, contentType, res, req.headers['id'])
        }
        else {
            switch(req.url.slice(1)){
                case 'geckoIdMap.json':
                    getCeckoCoinList(req, filePath, contentType, res); 
                    break;
                default:
                    console.log('Json gecko non trovato')
            }
        }
    }
    
    //controllo se è una richiesta di file json
    else if (req.headers['content-type'] ==='text/json') {
        console.log('Ricevuta richiesta dati');
        //filePath è l'indirizzo del file richiesto
        filePath = path.join(__dirname, 'ApiData', req.url);
        console.log(filePath);
        contentType = 'application/json';

        const doneWritingEmitter = new MyEmitter();


        //->richiesta offline
        /*fetch(filePath)
        .then(response => JSON.stringify(response))
        .catch(err => console.log('Error!', err));*/

        //->richiesta online
        //creo l'oggetto con headers e tipo di richiesta
        let onLoadReqObj = {
            method: "GET",
            mode: "cors",
            headers: {'Content-Type': 'text/json',
            'accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'X-CMC_PRO_API_KEY': 'de2431bb-c4f1-42ff-8bea-07ee15797876',
        }}

        //creo una stringa con i parametri della query 
        let queryParamString ='?';
        for(i=0; i<Object.keys(req.headers).length; i++) {
            if (queryParams.includes(Object.keys(req.headers)[i])){
                queryParamString += `${Object.keys(req.headers)[i]}=${Object.values(req.headers)[i]}&`
            }
        }
        //tolgo l'ultimo '&'; o '?' se non ci sono parametri
        queryParamString = queryParamString.slice(0, -1);

        //testing
        console.log(queryParamString);

        // individuo l'url della chiamata API
        let apiUrl ='';
        console.log(req.url);
        switch (req.url.slice(1)){
            case 'onLoadData.json':
                apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
                console.log('Richiesto onLoadData.json');
                break;
            case 'cryptoInfo.json':
                apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/info';
                console.log('Richiesto cryptoInfo.json');
                break;
            case 'tabella.json':
                apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
                break;
            case 'id.json':
                apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map';
                break;
            case 'coinIdMap.json':
                apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map';
                break;
            case 'idSymbol.json':
                apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map';
                break;
            default:
                console.log('File json richiesto non trovato')
        }

        doneWritingEmitter.on('doneWriting', (filePath, contentType, res) => {       
            sendResponse(filePath, contentType, res);
        });
        //mando la richiesta all'API
        fetch(apiUrl+queryParamString, onLoadReqObj) 
        //trasformo la risposta in json
        .then(response => {return response.json()})
        //se è la richiesta di tutti i nomi e symbol tolgo tutti i dati superflui
        .then(response=> {
            if(req.url==='/idSymbol.json'){
                let arr = [];
                for (const ob in response.data) {      
                    let obj = new Object;    
                    obj['name'] = response.data[ob].name.toLowerCase(); 
                    obj['symbol'] = response.data[ob].symbol;
                    obj['id'] = response.data[ob].id;
                    arr.push(obj)
                  }
                response = arr;
            } 
        return response
        })

        //trasformo il json in stringa
        .then(response =>{return JSON.stringify(response)})
        //metto i dati nel file data.json
        .then(response =>{
            fs.writeFile(path.join(__dirname, 'ApiData', req.url.slice(1)), response, (err)=>{
                if (err) throw err;
                doneWritingEmitter.emit('doneWriting', filePath, contentType, res)
            })
        })
        .catch(err => console.log('Errore nella scrittura del file JSON', err))
    }

    //Se non è una richiesta di json cerco il file richiesto nella cartella public
    else {
        if (req.url.includes('graph')){ //controllo se è la richiesta del grafico
            req.url = req.url.slice(0, req.url.indexOf('?'))+'.html';
        }
        else if (req.url == "/indexAll.html"){ //controllo se è la richiesta di All of them da un pagina grafico
            req.url = '/';
        }
        filePath = path.join(__dirname, 'public', req.url==='/' ? 'index.html' : req.url)  
        //controllo l'estensione di filePath per determinare il 'Content-Type'
        contentType = setContentType(path.extname(filePath));
        //leggo il file richiesto
        sendResponse(filePath, contentType, res);
    }

});

const PORT = process.env.PORT || 5500;

server.listen(PORT, ()=> console.log(`Server running on port:${PORT}`));