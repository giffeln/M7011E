async function fetchAsync(api, load) {
    let response = await fetch(api, load);
    let data = await response.json();
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


function setupAdminDashboard() {
    //let url = "api.projekt.giffeln.se/estates?idEstates=";
    let url = "/api/get/estate";
    data = fetchAsync(url).then((resp) => {
        sessionStorage.setItem("charging", resp.batteryCharging);
        loadAdminDashboard(resp.idEstates);
        document.getElementById("buffer").innerHTML = resp.batteryCharge;

    });
    return true;
}

function loadAdminDashboard(estateId) {
    getData("consumption", estateId);
    getData("production");
}

function setCurrent(data, array) {
    let div = document.getElementById(data);
    div.innerHTML = array[array.length - 1].value.toFixed(2);
}

function setProduction(){
    console.log(document.getElementById("plantProdSlider").value);
}

function setPlantBattery(){
    console.log(document.getElementById("plantBatterySlider").value);
}

function setPrice(){
    console.log(document.getElementById("priceSlider").value);
}

function setAdminSliders() {
    resetAdminSliders();
    document.getElementById("plantProdSlider").oninput = function () {
        document.getElementById("saveSliderValue").innerHTML = this.value;
    }
    document.getElementById("plantBatterySlider").oninput = function () {
        document.getElementById("batterySliderValue").innerHTML = this.value;
        document.getElementById("soldValue").innerHTML = 100 - this.value;
    }
    document.getElementById("priceSlider").oninput = function () {
        document.getElementById("marketPice").innerHTML = this.value;
    }
}

function resetAdminSliders() {
    //charging = (sessionStorage.getItem("charging") * 100);
    document.getElementById("plantProdSlider").value = 0;
    document.getElementById("saveSliderValue").innerHTML = 0;
    document.getElementById("plantBatterySlider").value = 0;
    document.getElementById("batterySliderValue").innerHTML = 0;
    document.getElementById("soldValue").innerHTML = 100;
    document.getElementById("priceSlider").value = 0;
    document.getElementById("marketPice").innerHTML = 0;
}