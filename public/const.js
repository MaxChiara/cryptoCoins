const url = 'https://fathomless-earth-51378.herokuapp.com/';
const onLoadData = 'onLoadData.json';
const coinsId = 'id.json';
const cryptoInfo = 'cryptoInfo.json';
const tabellaFetch = 'tabella.json';
const coinIdMapUrl = 'coinIdMap.json';
const geckoIdMapUrl = 'geckoIdMap.json';
const idSymbol = 'idSymbol.json';


const dark = 'black';
const chiaro = 'rgb(215 203 255)';
const positivo = 'rgb(118 255 74)';
const negativo = 'rgb(255 74 74)';
const valore = 'rgb(138 104 255)';

const homeTableKeys =['Name', 'Total_Supply', 'Max_Supply', 'Trading_Volume_24h', 'Price_change_1h', 'Price_change_24h', 'Value'];
const homeTableValues =['name', 'total_supply', 'max_supply', 'quote.EUR.volume_24h', 'quote.EUR.percent_change_1h', 'quote.EUR.percent_change_24h', 'quote.EUR.price'];
const quoteTableValues =['name', 'total_supply', 'max_supply', 'quote.EUR.volume_24h', 'quote.EUR.percent_change_1h', 'quote.EUR.percent_change_24h', 'quote.EUR.price'];
const valueFormat = ['Value'] //i valori di homeTableValues che saranno formattati come $
const numberFormat= ['Total_Supply', 'Max_Supply', 'Trading_Volume_24h', 'Market_cap', 'Price_change_1h', 'Price_change_24h', "Price_change_7d", "Price_change_30d"] //i valori di homeTableValues che saranno formattati come numeri
const greenRedFormat = ['Price_change_1h', 'Price_change_24h', "Price_change_7d", "Price_change_30d"]; //valori di homeTableValues che saranno verdi se positivi e rossi se negativi
var homeTableId = [];
var moreTableId = [];   //id che vengono effetivamente chiamati
var allId = []; //tutti Id relativi a quella pagina
var idMap; //

let checkList = []; //lista di oggetti che contiene ID, name e checked dei checkBoxes


var moreNumRows = 20;