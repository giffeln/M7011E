async function fetchAsync(api, load) {
    let response = await fetch(api, load);
    let data = await response.json();
    return data;
}

function setUserEstate(userId, estateId) {
    var userId = document.getElementById("userId").value;
    var estateId = document.getElementById("estateId").value;
    let url = "/api/set/estate";
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
        if (resp) {
            alert("Success!")
        } else {    
            alert("Error, please try again!")
        }
    });
    return data;
}

function writeDataToAdminTables(resp, table) {
    var tableToWrite = document.getElementById(table);
    tableToWrite.innerHTML = "";
    setTableHeader(resp, tableToWrite);
    setTableBody(resp, tableToWrite);
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

function setAdminUsersTable() {
    let urlUsers = "/api/get/users";
    data = fetchAsync(urlUsers).then((resp) => {
        writeDataToAdminTables(resp, "usersTable");
    });

}

function setAdminEstatesTable() {
    let urlEstates = "/api/get/availableEstates";
    data = fetchAsync(urlEstates).then((resp) => {
        writeDataToAdminTables(resp, "estateTable");
    });
    return data;
}

function updateUserPassword() {
    username = document.getElementById("changePassUserId").value;
    pass = document.getElementById("password").value;
    passControl = document.getElementById("passwordControl").value;
    if (pass == passControl) {
        let url = "/api/changePassword";
        let auth = {
            "username": username,
            "password": pass,
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
        });
        alert("Success!")
        return data;
    } else {
        alert("Passwords must match")
    }
}

function deleteUser() {
    var username = document.getElementById("deleteUserId").value;
    let url = "/api/removeUser";
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
        if (resp) {
            alert("Success!")
        } else {
            alert("Error, a user with that name does not exist.")
        }
    });
    return data;
}

function setAdmin(){
    var username = document.getElementById("setUserAdmin").value;
    let url = "/api/set/admin";
    let auth = {
        "user": username
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
        if (resp) {
            alert("Success!")
        } else {
            alert("Error, could not give that user admin status.")
        }
    });
    return data;
}