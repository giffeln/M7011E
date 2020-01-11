window.onload = function() {
    if(sessionStorage.getItem("logged_in")){
        window.location.pathname = '';
    } else {
        window.location.pathname = 'login.html';
    }
  };