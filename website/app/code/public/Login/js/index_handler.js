$('.collapse-item').click(function(){
    var page = $(this).attr('href');
    $('.collapse-item').removeClass("active");
    $(this).addClass("active")
    $("#Main").load(page, function(){
        getData();
    })
    return false;
})


function getData() {
    var dataToGet = document.getElementById("headerName").innerText.toLowerCase();
    let url = "https://api.projekt.giffeln.se/" + dataToGet;
    console.log(url)

    async function fetchAsync(url) {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }

    data = fetchAsync(url).then((resp) => {
        writeDataToTable(resp);
    });
    return data;
}

function setTableHeader(resp, table){
    var header = table.createTHead();
    var row = header.insertRow(0);
    var tableKeys = resp[0];
    Object.keys(tableKeys).forEach(key => {
        var cell = row.insertCell(Object.keys(tableKeys).indexOf(key));
        cell.innerHTML = key.bold();
    })
}

function setTableBody(resp, table){
    resp.forEach(element => {
        var row = table.insertRow((resp.indexOf(element) + 1));
        console.log(element);
        Object.values(element).forEach(value => {
            var cell = row.insertCell(Object.values(element).indexOf(value));
            cell.innerHTML = value;
        })
        console.log(element);
    });
}

function writeDataToTable(resp){
    var table = document.getElementById("dataTable");
    setTableHeader(resp, table);
    setTableBody(resp, table);
}
