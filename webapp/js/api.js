"use strict";

async function apiRequest(url, requestArguments) {
	const data = await fetch(url, requestArguments)
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
	const requestType = {
		method: 'DELETE',
		headers: {
			"Content-type": "application/text; charset=UTF-8"
		}
	};

	apiRequest(`/api/comment?name=${name}&id=${id}`, requestType).then(data => {
		if (!verifyJson(data))
			return;

		const [username, repo] = name.split('_');
		viewComments(username, repo)
	});
}