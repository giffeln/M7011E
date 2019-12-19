let url = "/api/register";


async function fetchAsync(url, payload) {
    let response = await fetch(url, payload);
    let data = await response.json();
    return data;
}
function register() {
    username = document.getElementById("Username").value;
    password = document.getElementById("Password").value;
    passwordCheck = document.getElementById("RepeatPassword").value;
    admin = document.getElementById("adminCheck").checked;
    let auth = {
        "anv": username,
        "pass": password,
        "admin": admin
    };
    console.log(auth);
    let payload = {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(auth)
    };
    console.log(auth);
    if (password === passwordCheck) {
        fetchAsync(url, payload).then((resp) => {
            console.log(resp);
            if (resp["register"]) {
                console.log("logged in");
                window.location.pathname = '/Login'
            } else {
                console.log("not logged in");
            }
        });
    } else {
        console.log("error");
    }
}

