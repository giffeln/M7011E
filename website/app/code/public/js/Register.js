var url = "/api/register";

async function fetchAsync(api, load) {
    let response = await fetch(api, load);
    let data = await response.json();
    return data;
}

function register() {
    username = document.getElementById("Username").value;
    password = document.getElementById("Password").value;
    passwordCheck = document.getElementById("RepeatPassword").value;
    let auth = {
        "anv": username,
        "pass": password,
        "admin": false
    };
    let payload = {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(auth)
    };
    if (password === passwordCheck) {
        fetchAsync(url, payload).then((resp) => {
            if (resp) {
                window.location.pathname = '/login.html'
            } else {
                alert("Passwords must match");
            }
        });
}}
