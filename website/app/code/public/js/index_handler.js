$('.collapse-item').click(function () {
    var page = $(this).attr('href');
    $('.collapse-item').removeClass("active");
    $(this).addClass("active")
    // }
    $("#Main").load(page, function () {
        getDataToTable();
    })
    return false;
})

$('.logout').click(function () {
    let url = "/api/logout";

    async function fetchAsync(url) {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }

    data = fetchAsync(url).then((resp) => {
        console.log(resp);
        window.location.pathname = '/login.html'
    });
    
    return false;
})

$('.profile').click(function () {
    var page = $(this).attr('href');
    $("#Main").load(page, function () {
        getEstateId();
    })
    return false;
})


function getDataToTable() {
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

function getData(dataToGet, estateId) {
    if(estateId == undefined){
        var estateIdString = "";
    } else {
        var estateIdString = "?estate=" + estateId
    }
    let url = "https://api.projekt.giffeln.se/" + dataToGet + estateIdString;
    console.log(url)

    async function fetchAsync(url) {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }

    data = fetchAsync(url).then((resp) => {
        setCurrent(dataToGet, resp)
        setNetConsumption();
        return resp;
    });
    return data;
}

function getEstateId() {
    let url = "/api/get/estate";
    console.log(url)

    async function fetchAsync(url) {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }

    data = fetchAsync(url).then((resp) => {
        loadUserDashboard(resp.idEstates);
        document.getElementById("buffer").innerHTML += resp.batteryCharge;

    });
    return data;
}

function checkUserLogin() {
    let url = "https://api.projekt.giffeln.se/auth";
    console.log(url)

    async function fetchAsync(url) {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }

    data = fetchAsync(url).then((resp) => {
    });
    console.log(data)
    return data;
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

function writeDataToTable(resp) {
    var table = document.getElementById("dataTable");
    setTableHeader(resp, table);
    setTableBody(resp, table);
}

function loadUserDashboard(estateId) {
    getData("wind");
    let consumption = getData("consumption", estateId);
    let production = getData("production");
    Promise.all([consumption, production]).then(function (values) {
        document.getElementById("net").innerHTML += (values[0][values[0].length - 1].value.toFixed(2) - values[1][values[0].length - 1].value.toFixed(2));
    })
}

function setNetConsumption() {

}

function setCurrent(data, array) {
    let div = document.getElementById(data);
    div.innerHTML += array[array.length - 1].value.toFixed(2);
}
