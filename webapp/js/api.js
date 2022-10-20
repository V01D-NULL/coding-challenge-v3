"use strict";

async function apiRequest(url, requestArguments, verify = true) {
  const data = await fetch(url, requestArguments)
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
    method: "POST",
    body: comment,
    headers: {
      "Content-type": "application/text; charset=UTF-8",
    },
  };

  return apiRequest(
    `/api/comment?name=${username}_${repo}&id=${+new Date()}`,
    requestType
  );
}

function apiDeleteComment(name, id) {
  if (id === undefined || id === null) {
    console.error("Tried to delete comment with an undefined or null id!");
    return;
  }

  const requestType = {
    method: "DELETE",
    headers: {
      "Content-type": "application/text; charset=UTF-8",
    },
  };

  return apiRequest(`/api/comment?name=${name}&id=${id}`, requestType);
}

async function apiEditComment(name, id, comment) {
  if (id === undefined || id === null) {
    console.error("Tried to edit comment with an undefined or null id!");
    return;
  }

  const requestType = {
    method: "POST",
    body: comment,
    headers: {
      "Content-type": "application/text; charset=UTF-8",
    },
  };

  const [username, repo] = name.split("_");
  const request = await apiRequest(
    `/api/comment?name=${username}_${repo}&id=${id}&edit=1`,
    requestType
  );

  console.log(request);
  return request;
}

function apiRateRepository(username, repo, score) {
  const requestType = {
    method: "POST",
    headers: {
      "Content-type": "application/text; charset=UTF-8",
    },
  };

  return apiRequest(
    `/api/rate?name=${username}_${repo}&score=${score}`,
    requestType
  );
}

function apiSubmitCredentials([username, password], apiEndpoint, callback) {
  const requestType = {
    method: "POST",
    headers: {
      "Content-type": "application/text; charset=UTF-8",
    },
  };

  apiRequest(
    `/api/${apiEndpoint}?username=${username}&password=${password}`,
    requestType,
    false
  ).then((data) => {
    if (!data.success) alert(data.error);
    else callback();
  });
}

function apiRevokeCredentials() {
  const requestType = {
    method: "POST",
    headers: {
      "Content-type": "application/text; charset=UTF-8",
    },
  };

  apiRequest(`/api/logout`, requestType, false).then((_) =>
    alert("Successfully logged out")
  );
}
