
function setBlockSlider() {
    document.getElementById("blockSlider").oninput = function () {
        document.getElementById("blockSliderValue").innerHTML = this.value;
    }
}

function blockUser() {
    blockTime = document.getElementById("blockSlider").value;
    userId = document.getElementById("blockUserId").value;
    console.log(blockTime, userId);
    document.getElementById("blockSlider").value = 10;
    document.getElementById("blockSliderValue").innerHTML = 10;
}

function lookupUser() {
    console.log(document.getElementById("checkSystemUserId").value);
}