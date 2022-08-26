"use strict";

const JsonToObject = (data) => JSON.parse(JSON.stringify(data));

function verifyJson(data) {
	// const errors = ['Missing required arguments', 'Username character limit exceeded (Max: 39)', 'No such username', 'This user has no public repositories', 'Failed to delete comment', 'You must be signed in to perform this action'];

	const jsonObj = JsonToObject(data);

	// The API returns {'error' : <int>} upon failure
	const status = jsonObj.error;
	if (jsonObj.error != undefined) {
		const err = `API returned error: ${status}`;
		{
			console.warn(err);
			alert(err);
		}
		return false;
	}

	return true;
}
