$(document).ready(function(){
    var token = $('#access_token').val();

    localStorage.setItem('UserToken', $('#access_token').val());
    window.location.href = "/";
});