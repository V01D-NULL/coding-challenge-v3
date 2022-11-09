'use strict';

export const JsonToObject = (data) => JSON.parse(JSON.stringify(data));

export function verifyJson(data) {
  const jsonObj = JsonToObject(data);

  // The API returns {'error' : <string>} upon failure
  if (jsonObj.error) {
    const err = `API returned error: ${jsonObj.error}`;

    console.warn(err);
    alert(err);

    return false;
  }

  return true;
}
