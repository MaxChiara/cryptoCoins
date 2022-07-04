//chiamata Api al caricamento pagina
function compilaHomeTable(data, tableKeys, tableValues, numRows = 50) {
    // tableKeys = list headers tabella - !!hardcoded in rowCrerator!!
    for (i = 0; i < tableKeys.length; i++) {
        //colonne						 tableValues = list dati corrispondenti a tableKeys,
        let classArray = document.getElementsByClassName(tableKeys[i]); //percorso nel file json: data.data[i].tableValues[i]
        for (ii = 0; ii < numRows; ii++) {
            //righe
            //classArray[ii].textContent = eval(`data.data[${ii}].${tableValues[i]}`);
            let data_flattened = flattenObj(data.data[ii]);
            classArray[ii].textContent = data_flattened[tableValues[i]];
        }
    }
    if (homeTableId[0]) return data; //TOGLIERE?
    //homeTableId = [];
    else
        for (i = 0; i < numRows; i++) {
            homeTableId.push(data.data[i].id); //servirà  in addLogo()
        }
    return data;
}

// Declare a flatten function that takes
// object as parameter and returns the
// flatten object
const flattenObj = (ob) => {
    // The object which contains the
    // final result
    let result = {};
    // loop through the object "ob"
    for (const i in ob) {
        // We check the type of the i using
        // typeof() function and recursively
        // call the function again
        if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
            const temp = flattenObj(ob[i]);
            for (const j in temp) {
                // Store temp in result
                result[i + "." + j] = temp[j];
            }
        }
        // Else store ob[i] in result directly
        else {
            result[i] = ob[i];
        }
    }
    return result;
};

function scrollTable(data, tableKeys, tableValues, numRows) {
    for (i = 0; i < tableKeys.length; i++) {
        //colonne	tableValues = list dati corrispondenti a tableKeys,
        let classArray = document.getElementsByClassName(tableKeys[i]); //percorso nel file json: data.data[i].tableValues[i]
        for (ii = 0; ii < numRows; ii++) {
            //righe
            //classArray[ii].textContent = eval(`data.data[${ii}].${tableValues[i]}`);
            let data_flattened = flattenObj(data.data[idsFetch[ii]]);
            classArray[ii].textContent = data_flattened[tableValues[i]];
        }
    }
    return 0;
}

//chiamata Api all'evento "submit"
function compilaQuoteTable(data, tableKeys, tableValues, numRows, ids) {
    // come sopra ma usa 'id' per accedere ai dati e non index (loop oggetto, non lista)
    for (i = 0; i < tableKeys.length; i++) {
        //colonne
        let classArray = document.getElementsByClassName(tableKeys[i]); //percorso nel file json: data.data[i].tableValues[i]
        for (ii = 0; ii < numRows; ii++) {
            //righe
            let data_flattened = flattenObj(data.data[ids[ii]]);
            classArray[ii].textContent = data_flattened[tableValues[i]];
            //classArray[ii].textContent = eval(`data.data[homeTableId[${ii}]].${tableValues[i]}`);
        }
    }
    return data; //quando la funzione viene chiamata da 'Submit' button  homeTableId è già popolata,
}

function formatValues() {
    //formatta i valori di valueFormat
    for (i = 0; i < valueFormat.length; i++) {
        let classArray = document.getElementsByClassName(valueFormat[i]);
        for (j = 0; j < classArray.length; j++) {
            val = classArray[j].textContent;
            classArray[j].textContent = new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
            }).format(val);
        }
    }
    colorValues();
}

function colorValues() {
    //funzione che cambia solo il colore di 'Value'
    for (i = 0; i < valueFormat.length; i++) {
        let classArray = document.getElementsByClassName(valueFormat[i]);
        for (j = 0; j < classArray.length; j++) {
            classArray[j].style.color = valore;
        }
    }
}

function formatNumbers() {
    //formatta i valori di numberFormat
    for (i = 0; i < numberFormat.length; i++) {
        let classArray = document.getElementsByClassName(numberFormat[i]);
        for (j = 0; j < classArray.length; j++) {
            val = classArray[j].textContent;
            classArray[j].textContent = new Intl.NumberFormat("de-DE").format(val);
            classArray[j].style.fontSize = "0.9rem";
            if (classArray[j].textContent == "0") {
                classArray[j].textContent = "/";
            }
        }
    }
}

function formatGreenRed() {
    //formatta i valori di greenRedFormat
    for (i = 0; i < greenRedFormat.length; i++) {
        let classArray = document.getElementsByClassName(greenRedFormat[i]);
        for (j = 0; j < classArray.length; j++) {
            if (parseFloat(classArray[j].textContent) < 0) {
                classArray[j].style.color = negativo;
            } else {
                classArray[j].style.color = positivo;
            }
        }
    }
}

function addLogo(info, ids) {
    let classArray = document.getElementsByClassName("nameLogo");
    //if (classArray[0].src != window.location.href) {return}
    for (i = 0; i < classArray.length; i++) {
        classArray[i].src = info.data[ids[i]].logo.replace("64x64", "16x16");
    }
}

function addHref(ids) {
    let nameArray = document.getElementsByClassName("Name");
    for (i = 0; i < nameArray.length; i++) {
        nameArray[i].href = "graph?id=" + ids[i];
    }
}

function addArticles(info) {
    let classArray = document.getElementsByClassName("articleLogo");
    if (classArray.length > 0) {
        for (i = 0; i < classArray.length; i++) {
            classArray[i].src = info.data[idFetchedArticle[i]].logo;
        }
    }
    classArray = document.getElementsByClassName("logoLink");
    if (classArray.length > 0) {
        for (i = 0; i < classArray.length; i++) {
            classArray[i].href = info.data[idFetchedArticle[i]].urls.website[0];
        }
    }
    classArray = document.getElementsByClassName("titoloArticle");
    let classArray2 = document.getElementsByClassName("contenutoArticle");
    if (classArray.length > 0 && classArray2.length > 0) {
        for (i = 0; i < classArray.length; i++) {
            classArray[i].textContent = info.data[idFetchedArticle[i]].name;
            classArray2[i].textContent = info.data[idFetchedArticle[i]].description;
        }
    }
}

/*function createCryptoObj {
	
}*/

function showCryptos() {
    var x = document.getElementById("cryptoTable");
    if (x.style.display == "block") {
        x.style.display = "none";
    } else x.style.display = "block";
}

//compila la checkList, accetta i data della chiamata API e la checkList
function createCheckList(data, checkList) {
    for (i = 0; i < data.length; i++) {
        let singleObj = {};
        singleObj["name"] = data[i].name;
        singleObj["id"] = data[i].id;
        singleObj["checked"] = false;
        checkList.push(singleObj);
    }
}

//compila la cryptoTable, accetta i data della chiamata API e l'oggetto checkObj
function nameCheckboxes(checkList) {
    let classArray = document.getElementsByClassName("label");
    for (i = 0; i < classArray.length; i++) {
        classArray[i].textContent = checkList[i].name;
    }
}

//regola i checked\unchecked boxes in base alla chiamata info
//function checkCryptoTable(data) {}

function clearTable(remaining = 0) {
    //remaining = quanti td si vuole lasciare, default nessuno.
    if (remaining < 0) {
        remaining = 0;
    }
    remaining += 1;
    parent = document.getElementsByTagName("tbody")[0];
    while (parent.children[remaining]) {
        parent.removeChild(parent.children[remaining]);
    }
}

function createIdList(data) {
    data.data.forEach((element) => {
        idList.push(element["id"]);
    });
}

function scrollRowsA() {
    //funzione che scorre tabella in avanti
    currentIdTabella += homeNumRows;
    if (currentIdTabella >= idList.length) {
        currentIdTabella = 0;
    }
    start = currentIdTabella;
    let ids = idList.slice(currentIdTabella, currentIdTabella + homeNumRows);
    scorriHomeTable(ids);
    //visualizzaDatiScroller(start, end, homeNumRows);
}

function scrollRowsB() {
    //funzione che scorre tabella indietro
    currentIdTabella -= homeNumRows;
    if (currentIdTabella < 0) {
        currentIdTabella = idList.length - homeNumRows;
    }
    start = currentIdTabella;
    let ids = idList.slice(currentIdTabella, currentIdTabella + homeNumRows);
    scorriHomeTable(ids);
}

function scrollArticlesA() {
    //funzione che scorre gli articles in avanti
    currentId += homeNumRows; // aumento currentId del numero di valute mostrate
    if (currentId >= idList.length) {
        currentId = 0;
    } //controllo se dobbiamo scorrere da capo
    let ids = idList.slice(currentId, currentId + homeNumRows);
    cryptoInfoWrapper(ids);
}

function scrollArticlesB() {
    //funzione che scorre gli articles idietro
    currentId -= homeNumRows; // aumento currentId del numero di valute mostrate
    if (currentId < 0) {
        currentId = idList.length - homeNumRows;
    } //controllo se dobbiamo tornare alle fine
    let ids = idList.slice(currentId, currentId + homeNumRows);
    cryptoInfoWrapper(ids);
}

function scrollA() {
    if (scrollTabella) {
        scrollRowsA();
    }
    if (scrollArticles) {
        scrollArticlesA();
    }
}

function scrollB() {
    if (scrollTabella) {
        scrollRowsB();
    }
    if (scrollArticles) {
        scrollArticlesB();
    }
}

function visualizzaDatiScroller(start, end, perPagina) {
    let pagine = Math.floor(end / perPagina);
    let pagina = Math.floor(start / perPagina + 1);
    let classArray = document.getElementsByClassName("segnaPagine");
    for (i = 0; i < classArray.length; i++) {
        classArray[i].textContent = `${pagina}/${pagine}`;
    }
}

//crypto info request
function cryptoInfoWrapper(ids) {
    //ids = id delle valute che deve fecthare

    idFetchedArticle = ids;

    let infoReqHeader = new Headers({
        "Content-Type": "text/json",
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        id: idFetchedArticle.join(),
    });

    let infoReqObj = {
        method: "GET",
        mode: "cors",
        headers: infoReqHeader,
    };

    let infoReq = new Request(url + "/" + cryptoInfo, infoReqObj);

    fetch(infoReq)
        .then((response) => response.json())
        .then((data) => {
            infoObj = data; //TESTING
            return data;
        })
        .then((data) => {
            addLogo(data, ids);
            return data;
        })
        .then((data) => addArticles(data))
        //.then(data=>addArticles(data, homeNumRows))
        .catch((err) => console.log("ERROR!:", err));
}

function hideElements() {
    for (i = 0; i < arguments.length; i++) {
        try {
            document.getElementById(arguments[i]).style.display = "none";
        } catch (error) {
            continue;
        }
    }
}

function hideClass() {
    for (i = 0; i < arguments.length; i++) {
        try {
            let classArray = document.getElementsByClassName(arguments[i]);
            for (ii = 0; ii < classArray.length; ii++) {
                classArray[ii].style.display = "none";
            }
        } catch (error) {
            console.log("eccolo");
            continue;
        }
    }
}

function showClass() {
    for (i = 0; i < arguments.length; i++) {
        let classArray = document.getElementsByClassName(arguments[i]);
        for (ii = 0; ii < classArray.length; ii++) {
            classArray[ii].style.display = "block";
        }
    }
}

function showElements() {
    for (i = 0; i < arguments.length; i++) {
        document.getElementById(arguments[i]).style.display = "block";
    }
}

function changeHomeNumRows() {
    homeNumRows = parseInt(document.getElementById("coinsPerPagina").value);
    limit = homeNumRows;
    loadHometable(start, limit, sort, false);
}

function showAll() {
    hideElements("secondario", "aside", "showAllSpan");
    hideClass("scroller", "flexContainerUrls");
    showElements("coinsPerPaginaDiv");
    showClass("scroller2");
    changeHomeNumRows();
    clearTable();
    rowCreator(homeNumRows);
    start = 1;
    loadHometable(start, 400, sort, false);
    hideLogo();
    scrollArticles = false;
    applyCanOrder();
    visualizzaDatiScroller();
}

function applyCanOrder() {
    classArray = document.getElementsByClassName("head");
    for (i = 1; i < classArray.length; i++) {
        if (!Array.from(classArray[i]).includes("canOrder")) {
            classArray[i].className += " canOrder";
            classArray[i].addEventListener("click", setOrder);
        }
    }
}

function setOrder(event) {
    addArrowHoverEvents();
    hideClass("h");
    let order = event.currentTarget.textContent.trim();
    switch (order) {
        case "Total Supply":
            order = "total_supply";
            break;
        case "Max Supply":
            order = "max_supply";
            break;
        case "Trading Volume 24h":
            order = "volume_24h";
            break;
        case "Price % change 1h":
            order = "percent_change_1h";
            break;
        case "Price % change 24h":
            order = "percent_change_24h";
            break;
        case "Value":
            order = "price";
            break;
    }
    if (sort == order) {
        sort = "market_cap";
        for (let e of event.currentTarget.children) {
            if (e.className.includes("arrow")) {
                e.style.opacity = "1";
            }
        }
    } else {
        event.currentTarget.removeEventListener("mouseenter", showArrow);
        event.currentTarget.removeEventListener("mouseleave", showArrow);
        for (let e of event.currentTarget.children) {
            if (e.className.includes("arrow")) {
                e.style.opacity = "1";
            }
        }
        sort = order;
    }
    loadHometable(start, limit, sort, false);
}

function hideLogo() {
    logoArray = document.getElementsByClassName("nameLogo");
    for (i = 0; i < logoArray.length; i++) {
        logoArray[i].style.display = "none";
    }
}

function addArrowHoverEvents() {
    let classArray = document.getElementsByClassName("ar");
    for (let e of classArray) {
        e.addEventListener("mouseenter", showArrow);
        e.addEventListener("mouseleave", showArrow);
        for (let ee of e.children) {
            if (ee.className.includes("arrow")) {
                ee.style.opacity = "0";
            }
        }
    }
}

function showArrow(event) {
    /*event.cancelBubble = true*/
    //event.stopPropagation();
    // if (event.target !== this) {
    //     event.scr;
    // }
    for (let e of event.target.children) {
        if (e.className.includes("arrow")) {
            e.style.opacity == "0" ?
                (e.style.opacity = "1") :
                (e.style.opacity = "0");
        }
    }
}