async function fetchAsync(api, load) {
    let response = await fetch(api, load);
    let data = await response.json();
    return data;
}

function setUserCharge() {
    console.log("fired 2.0")
    var amount = parseInt(document.getElementById("saveSlider").value);
    let url = "/api/set/charging";
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

function getData(dataToGet, estateId) {
    if (estateId == undefined) {
        var estateIdString = "";
    } else {
        var estateIdString = "?estate=" + estateId
    }
    let url = "https://api.projekt.giffeln.se/" + dataToGet + estateIdString;
    data = fetchAsync(url).then((resp) => {
        setCurrent(dataToGet, resp)
        return resp;
    });
    return data;
}


function setupUserDashboard() {
    let url = "/api/get/estate";
    console.log(url)
    data = fetchAsync(url).then((resp) => {
        sessionStorage.setItem("charging", resp.batteryCharging);
        loadUserDashboard(resp.idEstates);
        document.getElementById("buffer").innerHTML = resp.batteryCharge;

    });
    return true;
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

function setSliders() {
    resetSliders();
    document.getElementById("saveSlider").oninput = function () {
        document.getElementById("saveSliderValue").innerHTML = this.value;
        document.getElementById("sellValue").innerHTML = 100 - this.value;
    }
    document.getElementById("batterySlider").oninput = function () {
        document.getElementById("batterySliderValue").innerHTML = this.value;
        document.getElementById("buyValue").innerHTML = 100 - this.value;
    }
}

function resetSliders() {
    charging = (sessionStorage.getItem("charging") * 100);
    document.getElementById("saveSlider").value = charging;
    document.getElementById("saveSliderValue").innerHTML = charging;
    document.getElementById("sellValue").innerHTML = 100 - charging;
    document.getElementById("batterySlider").value = 0;
    document.getElementById("batterySliderValue").innerHTML = 0;
    document.getElementById("buyValue").innerHTML = 100;
}