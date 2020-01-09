window.onload = function() {
    checkLogin();
  };

var url = "/api/login";


async function fetchAsync(api, load) {
    let response = await fetch(api, load);
    let data = await response.json();
    return data;
}

function login() {
    username = document.getElementById("Username").value;
    password = document.getElementById("Password").value;
    let auth = {
        "anv": username,
        "pass": password
    };
    let payload = {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(auth)
    };
    fetchAsync(url, payload).then((resp) => {
        console.log(payload);
        if (resp) {
            console.log("logged in");
            window.location.pathname = ''
        } else {
            console.log("not logged in");
        }
    });
}

function checkLogin() {
    let url = "/api/auth";
    console.log(url)

    async function fetchAsync(url) {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }

    data = fetchAsync(url).then((resp) => {
        console.log(resp);
        if (resp === true) {
            window.location.pathname = ''
        }
    });

}


function logData() {
    console.log(username + ";" + password);
}

