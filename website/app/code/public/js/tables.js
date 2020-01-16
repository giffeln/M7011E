async function fetchAsync(api, load) {
    let response = await fetch(api, load);
    let data = await response.json();
    return data;
}

function getDataToTable() {
    var dataToGet = document.getElementById("headerName").innerText.toLowerCase();
    let url = "https://api.projekt.giffeln.se/" + dataToGet;
    data = fetchAsync(url).then((resp) => {
        console.log(resp)
        writeDataToTable(resp);
    });
    return data;
}  

function writeDataToTable(resp) {
    var table = document.getElementById("dataTable");
    table.innerHTML = "";
    setTableHeader(resp, table);
    setTableBody(resp, table);
}

function setTableHeader(resp, table) {
    var header = table.createTHead();
    var row = header.insertRow(0);
    var tableKeys = resp[0];
    Object.keys(tableKeys).forEach(key => {
        var cell = row.insertCell(Object.keys(tableKeys).indexOf(key));
        cell.innerHTML = key.bold();
    })
}

function setTableBody(resp, table) {
    resp.forEach(element => {
        var row = table.insertRow((resp.indexOf(element) + 1));
        Object.values(element).forEach(value => {
            var cell = row.insertCell(Object.values(element).indexOf(value));
            cell.innerHTML = value;
        })
    });
}