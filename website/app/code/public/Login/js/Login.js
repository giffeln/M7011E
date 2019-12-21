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
        if (resp["login"]) {
            console.log("logged in");
            window.location.pathname = '/Login'
        } else {
            console.log("not logged in");
        }
    });
}

function logData() {
    console.log(username + ";" + password);
}

