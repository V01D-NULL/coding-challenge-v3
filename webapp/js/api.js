"use strict";

async function apiRequest(url, requestArguments, verify=true) {
	const data = await fetch(url, requestArguments)
	.then((response) => response.json())
	.then(data => {
		if (verify && !verifyJson(data))
			return undefined;
		
		return data;
	})
	.catch(error => {
		console.error(error);
		return undefined;
	});

	return data;
}

function apiSubmitComment(username, repo) {
	const requestType = {
		method: 'POST',
		body: popup['div'].children.namedItem('comment-box').value,
		headers: {
			"Content-type": "application/text; charset=UTF-8"
		}
	};

	apiRequest(`/api/comment?name=${username}_${repo}&id=${+ new Date()}`, requestType).then(_ => disableCommentBox());
}

function apiDeleteComment(name, id) {
	if (id == undefined || id == null) {
		console.error("Tried to delete comment with an undefined or null id!");
		return;
	}
	
	const requestType = {
		method: 'DELETE',
		headers: {
			"Content-type": "application/text; charset=UTF-8"
		}
	};

	apiRequest(`/api/comment?name=${name}&id=${id}`, requestType).then(data => {
		// Naming convention: username_repo
		const [username, repo] = name.split('_');
		refreshComments(username, repo);
	});
}

function apiEditComment(name, id) {
	if (id == undefined || id == null) {
		console.error("Tried to edit comment with an undefined or null id!");
		return;
	}

	ResetPopup();
	popup['div'].children.namedItem('submit-comment').addEventListener("click", event => {
		const requestType = {
			method: 'POST',
			body: popup['div'].children.namedItem('comment-box').value,
			headers: {
				"Content-type": "application/text; charset=UTF-8"
			}
		};

		const [username, repo] = name.split('_');
		apiRequest(`/api/comment?name=${username}_${repo}&id=${id}&edit=1`, requestType).then(_ => refreshComments(username, repo));
	});
}

function apiRateRepository(username, repo, sliderID) {
	const requestType = {
		method: 'POST',
		headers: {
			"Content-type": "application/text; charset=UTF-8"
		}
	};

	const score = document.getElementById(sliderID).value;
	apiRequest(`/api/rate?name=${username}_${repo}&score=${score}`, requestType).then(_ => refreshRepositories(username));
}

function apiSubmitCredentials(id, apiEndpoint, callback) {
	const username = document.getElementById(id).children.namedItem('username').value;
	const password = document.getElementById(id).children.namedItem('password').value;

	const requestType = {
		method: 'POST',
		headers: {
			"Content-type": "application/text; charset=UTF-8"
		}
	};
	
	apiRequest(`/api/${apiEndpoint}?username=${username}&password=${password}`, requestType, false).then(data => {
		if (!data.success)
			alert(data.error);
		else
			callback();
	});
}

function apiRevokeCredentials() {
	const requestType = {
		method: 'POST',
		headers: {
			"Content-type": "application/text; charset=UTF-8"
		}
	};

	apiRequest(`/api/logout`, requestType, false).then(_ => alert("Successfully logged out"));
}