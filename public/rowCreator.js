// creazione delle righe della table in base a *NumRows dichiarati in const.js
function rowCreator (numRows) {
    for (i=0; i<numRows; i++) {
		let tr = document.createElement("tr");
		// !tableKeys hardcoded
		tr.innerHTML = `<tr class=\"tableRow\" style=\"color:${chiaro}\">\n<td><img src=\"\" alt=\"logo\" class=\"nameLogo\"><a href=\"\" class=\"Name\" style=\"color:${chiaro}\"></a></td>\n<td class=\"Total_Supply\" style=\"color:${chiaro}\"></td>\n<td class=\"Max_Supply\" style=\"color:${chiaro}\"></td>\n<td class=\"Trading_Volume_24h\" style=\"color:${chiaro}\"></td>\n<td class=\"Price_change_1h\" style=\"color:${chiaro}\"></td>\n<td class=\"Price_change_24h\" style=\"color:${chiaro}\"></td>\n<td class=\"Value\" style=\"color:${chiaro}\"></td>\n</tr>`;
		//document.getElementsByClassName("homeTable")[0].appendChild(tr)
		document.getElementsByTagName("tbody")[0].appendChild(tr)
}}


//crea i checkbox elements della cryptoTable
function createCheckboxes(data) { 
	for (i=0; i<data.length ; i++) {
		let ck = document.createElement("div");
		ck.className = 'pure-u-1-8 checkBoxWrap';
		ck.innerHTML = `<input type=\"checkbox\" name=\"id\" value=${data[i].id} id=\"chk${i}\" class=\"checkbox\">\n<label for=\"chk${i}\" ><span class=\"label\"></span></label>`;
		document.getElementById("checkBoxTable").appendChild(ck);
	}
}

/*<input type="checkbox" name="valuteCheck" id="chk1">
            <label for="chk1"></label> */