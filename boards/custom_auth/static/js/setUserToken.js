$(document).ready(function(){
    var token = $('#access_token').val();

    localStorage.setItem('UserToken', token);
//    window.location.href = "/";
});