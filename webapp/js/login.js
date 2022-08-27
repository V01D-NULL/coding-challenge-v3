"use strict";

document.getElementById('sign-up').addEventListener("submit", (event) => {
    event.preventDefault();
    apiSubmitCredentials('sign-up', 'signup', () => alert("Successfully created account"));
});

document.getElementById('login').addEventListener("submit", (event) => {
    event.preventDefault();
    apiSubmitCredentials('login', 'login', () => window.location.href = "index.html");
});
