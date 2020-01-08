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
    admin = document.getElementById("adminCheck").checked;
    let auth = {
        "anv": username,
        "pass": password,
        "admin": admin
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
            console.log(resp);
            if (register) {
                console.log("logged in");
                window.location.pathname = ''
            } else {
                console.log("not logged in");
            }
        });
    } else {
        console.log("error");
    }
}

