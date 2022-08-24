"use strict";

function viewRepository(username) {
	fetch(`/repositories?username=${username}`)
	.then((response) => {
		if (response.ok)
			return response.json();
		
		throw new Error("NETWORK RESPONSE ERROR");
	})
	.then(data => {
		console.log(data);
	})
	.catch((error) => console.error("FETCH ERROR:", error));
}

document.getElementById('view-repo-form').addEventListener("submit", (event) => {
	event.preventDefault();
	const username = document.getElementById("username").value;
	viewRepository(username);
});