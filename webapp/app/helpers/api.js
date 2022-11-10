'use strict';

const API_URL = 'http://127.0.0.1:5000';

async function apiRequest(url, requestArguments, verify = true) {
  const data = await fetch(API_URL + url, requestArguments)
    .then((response) => response.json())
    .then((data) => {
      if (verify && !verifyJson(data)) return undefined;

      return data;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });

  return data;
}

function apiSubmitComment(username, repo, comment) {
  const requestType = {
    method: 'POST',
    body: comment,
    headers: {
      'Content-type': 'application/text; charset=UTF-8',
    },
  };

  return apiRequest(
    `/api/comment?name=${username}_${repo}&id=${+new Date()}`,
    requestType
  );
}

function apiDeleteComment(name, id) {
  if (id === undefined || id === null) {
    console.error('Tried to delete comment with an undefined or null id!');
    return;
  }

  const requestType = {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/text; charset=UTF-8',
    },
  };

  return apiRequest(`/api/comment?name=${name}&id=${id}`, requestType);
}

async function apiEditComment(name, id, comment) {
  if (id === undefined || id === null) {
    console.error('Tried to edit comment with an undefined or null id!');
    return;
  }

  const requestType = {
    method: 'POST',
    body: comment,
    headers: {
      'Content-type': 'application/text; charset=UTF-8',
    },
  };

  const request = await apiRequest(
    `/api/comment?name=${name}&id=${id}&edit=1`,
    requestType
  );

  console.log(request);
  return request;
}

function apiRateRepository(username, repo, score) {
  const requestType = {
    method: 'POST',
    headers: {
      'Content-type': 'application/text; charset=UTF-8',
    },
  };

  return apiRequest(
    `/api/rate?name=${username}_${repo}&score=${score}`,
    requestType
  );
}
