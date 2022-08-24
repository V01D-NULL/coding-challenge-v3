"use strict";

let resultsDiv = document.getElementById('repository-results');

async function viewRepository(username) {
	const data = await fetch(`/api/repositories?username=${username}`)
	.then((response) => response.json())
	.then(data => {
		return data;
	})
	.catch(error => {
		console.error(error);
		return undefined;
	});

	return data;
}

function JsonToObject(data) {
	return JSON.parse(JSON.stringify(data));
}

function verifyJson(data) {
	const errors = ['Missing required arguments', 'Username character limit exceeded (Max: 39)', 'No such username'];
	
	const jsonObj = JsonToObject(data);

	// Our API returns {'Error' : <int>} upon failure
	const status = jsonObj.error;
	if (jsonObj.error != undefined) {
		const err = `API returned error code: ${status} ${errors[status]}`;
		{
			console.warn(err);
			resultsDiv.innerHTML = err;
		}
		return false;
	}

	return true;
}

document.getElementById('view-repo-form').addEventListener("submit", (event) => {
	event.preventDefault();
	const username = document.getElementById("username").value;
	
	const jsonDataPromise = viewRepository(username);
	jsonDataPromise.then(data => {
		resultsDiv.style.visibility = 'visible';
		resultsDiv.innerHTML = '';

		if (!verifyJson(data))
			return;

		// Iterate over each repository
		data.forEach(element => {
			const jsonObj = JsonToObject(element);
			resultsDiv.innerHTML +=
				`
				    <hr>
					<b>${jsonObj.name}</b>
					<br>
					<p>
					${
						!jsonObj.description ? 'No description provided' : jsonObj.description
					}
					<br>
					<a href="#write-a-comment">TODO: Allow user to write a comment (Requires: Mongdb, CRUD)</a>'
					<br>
					</p>
				`;
		});
	});
});
