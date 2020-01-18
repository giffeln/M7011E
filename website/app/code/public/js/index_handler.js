window.onload = function () {
    if (sessionStorage.getItem("logged_in")) {
        let url = "http://localhost:8080/api/get/username";
        async function fetchAsync(url) {
            let response = await fetch(url);
            let data = await response.json();
            return data;
        }

        data = fetchAsync(url).then((resp) => {
            document.getElementById("username").innerHTML = resp.username;
            document.getElementById("userDropdown").setAttribute("data-toggle", "dropdown");
        });
        if (this.sessionStorage.getItem("admin") === 'true') {
            setAdminLinks();
        }
    } else {
        let dropdown = document.getElementById("userDropdown");
        dropdown.setAttribute("data-toggle", "");
        dropdown.href = "login.html";
        document.getElementById("username").innerHTML = "Login";
    }
}

$('.table').click(function () {
    clearUserDashboardInterval();
    if (sessionStorage.getItem("logged_in")) {
        var page = $(this).attr('href');
        $('.collapse-item').removeClass("active");
        $(this).addClass("active")
        $('#Main').empty();
        $("#Main").load(page, function () {
            getDataToTable();
        })
        return false;
    } else {
        $('#Main').empty();
        $("#Main").load("tables/table_not_logged_in.html", function () {

        })
        return false;
    }
})

$('.setUserEstate').click(function () {
    clearUserDashboardInterval();
    var page = "edit_user.html";
    $('.collapse-item').removeClass("active");
    $(this).addClass("active")
    $('#Main').empty();
    $("#Main").load(page, function () {
        showAdminSecrets();
        setAdminUsersTable();
        setAdminEstatesTable();
    })
    return false;
})

$('.adminDashboard').click(function () {
    clearUserDashboardInterval();
    var page = "admin_dashboard.html";
    $('.collapse-item').removeClass("active");
    $(this).addClass("active")
    $('#Main').empty();
    $("#Main").load(page, function () {
        showAdminSecrets();
        setupAdminDashboard();
        setAdminSliders();
    })
    return false;
})

$('.adminUsers').click(function () {
    clearUserDashboardInterval();
    var page = "see_users.html";
    $('.collapse-item').removeClass("active");
    $(this).addClass("active")
    $('#Main').empty();
    $("#Main").load(page, function () {
        showAdminSecrets();
        setBlockSlider();
    })
    return false;
})


$('.logout').click(function () {
    let url = "/api/logout";

    async function fetchAsync(url) {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }

    data = fetchAsync(url).then((resp) => {
        sessionStorage.clear();
        window.location.pathname = '/login.html'
    });

    return false;
})

$('.profile').click(function () {
    var page = $(this).attr('href');
    $('.collapse-item').removeClass("active");
    $('#Main').empty();
    $("#Main").load(page, function () {
        startUserDashboardInterval();
        setSliders();
    })
    return false;
})

var updateInterval;

function startUserDashboardInterval() {
    setupUserDashboard()
    updateInterval = setInterval(function () { setupUserDashboard() }, 10000);
}

function clearUserDashboardInterval() {
    clearInterval(updateInterval);
}

function setAdminLinks() {
    $('.hideAdmin').removeClass("hide");
}

function showAdminSecrets() {
    $('#hidden_body').removeClass("hide");
}