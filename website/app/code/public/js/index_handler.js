window.onload = function () {
    if (sessionStorage.getItem("logged_in")) {
        let url = "http://localhost:8080/api/get/username";
        async function fetchAsync(url) {
            let response = await fetch(url);
            let data = await response.json();
            return data;
        }

        data = fetchAsync(url).then((resp) => {
            document.getElementById("username").innerHTML = resp.username;
            document.getElementById("userDropdown").setAttribute("data-toggle", "dropdown");
        });
        if(this.sessionStorage.getItem("admin") === 'true'){
            setAdminLinks();
        }
    } else {
        let dropdown = document.getElementById("userDropdown");
        dropdown.setAttribute("data-toggle", "");
        dropdown.href = "login.html";
        document.getElementById("username").innerHTML = "Login";
    }
}

$('.collapse-item').click(function () {
    if (sessionStorage.getItem("logged_in")) {
        var page = $(this).attr('href');
        $('.collapse-item').removeClass("active");
        $(this).addClass("active")
        $("#Main").load(page, function () {
            getDataToTable();
        })
        return false;
    } else {
        $("#Main").load("tables/table_not_logged_in.html", function () {
            
        })
        return false;
    }
})

$('.logout').click(function () {
    let url = "/api/logout";

    async function fetchAsync(url) {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }

    data = fetchAsync(url).then((resp) => {
        sessionStorage.clear();
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

$('.admin').click(function () {
    var page = "admin_board.html";
    $("#Main").load(page, function () {
        showAdminSecrets();
    })
    return false;
});


function getDataToTable() {
    var dataToGet = document.getElementById("headerName").innerText.toLowerCase();
    let url = "https://api.projekt.giffeln.se/" + dataToGet;

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
    if (estateId == undefined) {
        var estateIdString = "";
    } else {
        var estateIdString = "?estate=" + estateId
    }
    let url = "https://api.projekt.giffeln.se/" + dataToGet + estateIdString;

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
        console.log("ping");
        loadUserDashboard(resp.idEstates);
        document.getElementById("buffer").innerHTML = resp.batteryCharge;

    });
    return true;
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
        document.getElementById("net").innerHTML = (values[0][values[0].length - 1].value.toFixed(2) - values[1][values[0].length - 1].value.toFixed(2));
    })
}

function setNetConsumption() {

}

function setCurrent(data, array) {
    let div = document.getElementById(data);
    div.innerHTML = array[array.length - 1].value.toFixed(2);
}

function setAdminLinks(){
    $('.admin').removeClass("hide");
}

function showAdminSecrets(){
    $('#hidden_body').removeClass("hide");
}