
let users = [
    {username: "admin", password: "admin123", admin: 1, token: "woot"},
    {username: "test", password: "hejsan123", admin: 0, token: "wooted"}
];

export function login(username, password) {
    console.log(users.length);
    for(let i = 0; i < users.length; i++) {
        let user = users[i];
        console.log(user);
        if(user["username"] == username) {
            if(user["password"] == password) {
                //TODO Change
                return user["token"];
            }
            return false;
        }
    }
    return false;
}

export function checkToken(token) {
    for(let i = 0; i < users.length; i++) {
        let user = users[i];
        if(user["token"] == token) {
            return true;
        }
    }
    return false;
}

export function checkAdmin(token) {
    for(let i = 0; i < users.length; i++) {
        let user = users[i];
        if(user["token"] == token) {
            if(user["admin"] == 1) {
                return true;
            }
            return false;
        }
    }
    return false;
}

export function genToken() {

}