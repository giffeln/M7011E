
let users = [
    {username: "admin", password: "admin123", admin: 1, token: "woot"},
    {username: "test", password: "hejsan123", admin: 0, token: "wooted"}
];

module.exports = {
    login: function(username, password) {
        for(let i = 0; i < users.length; i++) {
            let user = users[i];
            if(user["username"] == username) {
                if(user["password"] == password) {
                    //TODO Change
                    return user["token"];
                }
                return false;
            }
        }
        return false;
    },
    checkToken: function(token) {
        for(let i = 0; i < users.length; i++) {
            let user = users[i];
            if(user["token"] == token) {
                return true;
            }
        }
        return false;
    },
    checkAdmin: function(token) {
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
    },
    logout: function() {
        //destroy token
    }
}