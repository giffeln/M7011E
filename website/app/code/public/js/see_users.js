async function fetchAsync(api, load) {
    let response = await fetch(api, load);
    let data = await response.json();
    return data;
}

function getSpecificUser(){
    var username = document.getElementById("checkSystemUserId").value;
    let url = "/api/get/specificUser";
    
    let auth = {
        "username": username,
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
        if(resp.length!=0){
            resetTable();
            getSpecificEstate(resp[0].estate, resp[0]);
        } else {
            alert("That user does not exist!");
        }
    });
    return data;
}

function getSpecificEstate(estate, userResp){
    let url = "api/get/userEstate";    
    let auth = {
        "estate": estate,
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
        Object.keys(resp).forEach(item => {
            userResp[item] = resp[item] // key value
        });
        writeDataToTable(userResp);
    });
    return data;
}

function resetTable(){
    var table = document.getElementById("userInfoTable");
    table.innerHTML = "";
}

function writeDataToTable(resp) {
    var table = document.getElementById("userInfoTable");
    setTableHeader(resp, table);
    setTableBody(resp, table);
}

function setTableHeader(resp, table) {
    var header = table.createTHead();
    var row = header.insertRow(0);
    var tableKeys = resp;
    Object.keys(tableKeys).forEach(key => {
        var cell = row.insertCell(Object.keys(tableKeys).indexOf(key));
        cell.innerHTML = key.bold();
    })
}

function setTableBody(resp, table) {
        var row = table.insertRow(1);
        Object.values(resp).forEach(value => {
            var cell = row.insertCell(Object.values(value).indexOf(value));
            cell.innerHTML = value;
        })
}

function setBlockSlider() {
    document.getElementById("blockSlider").oninput = function () {
        document.getElementById("blockSliderValue").innerHTML = this.value;
    }
}

function blockUser() {
    blockTime = document.getElementById("blockSlider").value;
    userId = document.getElementById("blockUserId").value;
    document.getElementById("blockSlider").value = 10;
    document.getElementById("blockSliderValue").innerHTML = 10;
}


