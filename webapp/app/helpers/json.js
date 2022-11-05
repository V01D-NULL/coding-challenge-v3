'use strict';

const JsonToObject = (data) => JSON.parse(JSON.stringify(data));

function verifyJson(data) {
  const jsonObj = JsonToObject(data);

  // The API returns {'error' : <string>} upon failure
  if (jsonObj.error != undefined) {
    const err = `API returned error: ${jsonObj.error}`;

    console.warn(err);
    alert(err);

    return false;
  }

  return true;
}
