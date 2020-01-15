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

var updateInterval;

function startUserDashboardInterval() {
    setupUserDashboard()
    updateInterval = setInterval(function(){setupUserDashboard()}, 10000);
}

function clearUserDashboardInterval(){
    clearInterval(updateInterval);
}

$('.table').click(function () {
    clearUserDashboardInterval();
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

$('.setUserEstate').click(function () {
    clearUserDashboardInterval();
    var page = "set_user_estate.html";
    $('.collapse-item').removeClass("active");
    $(this).addClass("active")
    $("#Main").load(page, function () {
        showAdminSecrets();
        setAdminUsersTable();
        setAdminEstatesTable();
    })
    return false;
})

$('.adminDashboard').click(function () {
    clearUserDashboardInterval();
    var page = "admin_dashboard.html";
    $('.collapse-item').removeClass("active");
    $(this).addClass("active")
    $("#Main").load(page, function () {
        showAdminSecrets();

    })
    return false;
})

$('.adminUsers').click(function () {
    clearUserDashboardInterval();
    var page = "see_users.html";
    $('.collapse-item').removeClass("active");
    $(this).addClass("active")
    $("#Main").load(page, function () {
        showAdminSecrets();
        
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
        sessionStorage.clear();
        window.location.pathname = '/login.html'
    });

    return false;
})

$('.profile').click(function () {
    var page = $(this).attr('href');
    $('.collapse-item').removeClass("active");
    $("#Main").load(page, function () {
        //startUserDashboardInterval();
        setSliders();
    })
    return false;
})

$('.setCharge').click(function () {
    setUserCharge();
    console.log("submit fired");
    return false;
})

$('.resetSliders').click(function () {
    resetSliders();
    console.log("reset fired")
    return false;
})

$('.setEstateButton').unbind('click').bind('click', function () {
    var userId = document.getElementById("userId").value;
    var estateId = document.getElementById("estateId").value;
    console.log(userId, estateId);
    setUserEstate(userId, estateId);
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
        console.log(resp)
        writeDataToTable(resp);
    });
    return data;
}

function setAdminUsersTable(){
    let urlUsers = "/api/get/users";
    
    async function fetchAsync(urlUsers) {
        let response = await fetch(urlUsers);
        let data = await response.json();
        return data;
    }

    data = fetchAsync(urlUsers).then((resp) => {
        console.log(resp);
        writeDataToAdminTables(resp, "usersTable");
    });
    
}

function setAdminEstatesTable(){
    let urlEstates = "/api/get/availableEstates";

    async function fetchAsync(urlEstates) {
        let response = await fetch(urlEstates);
        let data = await response.json();
        return data;
    }

    data = fetchAsync(urlEstates).then((resp) => {
        console.log(resp)
        writeDataToAdminTables(resp, "estateTable");
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
        return resp;
    });
    return data;
}


function setupUserDashboard() {
    let url = "/api/get/estate";
    console.log(url)

    async function fetchAsync(url) {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }

    data = fetchAsync(url).then((resp) => {
        loadUserDashboard(resp.idEstates);
        document.getElementById("buffer").innerHTML = resp.batteryCharge;

    });
    return true;
}

function setUserCharge(){
    var amount = parseInt(document.getElementById("saveSlider").value);
    let url = "/api/set/charging";

    async function fetchAsync(api, load) {
        let response = await fetch(api, load);
        let data = await response.json();
        return data;
    }

    let auth = {
        "charging": amount,
    };
    let payload = {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(auth)
    };
    data = fetchAsync(url, payload).then((resp) => {
        console.log(resp);
    });
    return data;
}

function checkUserLogin() {
    let url = "https://api.projekt.giffeln.se/auth";

    async function fetchAsync(url) {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }

    data = fetchAsync(url).then((resp) => {
    });
    return data;
}

function setUserEstate(userId, estateId) {
    let url = "/api/set/estate";

    async function fetchAsync(api, load) {
        let response = await fetch(api, load);
        let data = await response.json();
        return data;
    }

    let auth = {
        "user": userId,
        "estate": estateId,
    };
    let payload = {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(auth)
    };
    data = fetchAsync(url, payload).then((resp) => {
        console.log(resp);
        if (resp) {
            console.log("Success");
        } else {
            console.log("Something went wrong");
        }
    });
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
    table.innerHTML = "";
    setTableHeader(resp, table);
    setTableBody(resp, table);
}

function writeDataToAdminTables(resp, table) {
    var tableToWrite = document.getElementById(table);
    tableToWrite.innerHTML = "";
    setTableHeader(resp, tableToWrite);
    setTableBody(resp, tableToWrite);
}

function loadUserDashboard(estateId) {
    getData("wind");
    let consumption = getData("consumption", estateId);
    let production = getData("production");
    Promise.all([consumption, production]).then(function (values) {
        document.getElementById("net").innerHTML = (values[0][values[0].length - 1].value - values[1][values[0].length - 1].value).toFixed(2);
    })
}

function setCurrent(data, array) {
    let div = document.getElementById(data);
    div.innerHTML = array[array.length - 1].value.toFixed(2);
}

function setAdminLinks(){
    $('.hideAdmin').removeClass("hide");
}

function showAdminSecrets(){
    $('#hidden_body').removeClass("hide");
}

function setSliders() {
    document.getElementById("saveSlider").oninput = function () {
        document.getElementById("saveSliderValue").innerHTML = this.value;
        document.getElementById("sellValue").innerHTML = 100 - this.value;
    }
    document.getElementById("batterySlider").oninput = function () {
        document.getElementById("batterySliderValue").innerHTML = this.value;
        document.getElementById("buyValue").innerHTML = 100 - this.value;
    }
}

function resetSliders(){
    document.getElementById("saveSlider").value = 0;
    document.getElementById("saveSliderValue").innerHTML = 0;
    document.getElementById("sellValue").innerHTML = 100;
    document.getElementById("batterySlider").value = 0;
    document.getElementById("batterySliderValue").innerHTML = 0;
    document.getElementById("buyValue").innerHTML = 100;
}