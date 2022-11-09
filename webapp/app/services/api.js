import Service from '@ember/service';
import { action } from '@ember/object';
import { verifyJson } from '../helpers/json';

export default class ApiService extends Service {
  API_URL = 'http://127.0.0.1:5000';
  requestType = {
    method: 'POST',
    headers: {
      'Content-type': 'application/text; charset=UTF-8',
    },
    mode: 'no-cors',
  };

  async apiRequest(url, requestArguments, verify = true) {
    const data = await fetch(this.API_URL + url, requestArguments)
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

  @action revokeCredentials() {
    const requestType = {
      method: 'POST',
      headers: {
        'Content-type': 'application/text; charset=UTF-8',
      },
    };

    this.apiRequest(`/api/logout`, requestType, false).then((_) =>
      alert('Successfully logged out')
    );
  }

  apiSubmitCredentials([username, password], apiEndpoint, callback) {
    this.apiRequest(
      `/api/${apiEndpoint}?username=${username}&password=${password}`,
      this.requestType,
      false
    )
      .then((data) => {
        if (!data?.success) alert(data?.error);
        else callback();
      })
      .catch((error) => alert('bruh: ' + error));
  }

  fetchRepositories(username) {
    return this.apiRequest(`/api/repositories?username=${username}`);
  }

  fetchRepositoryRating(username, repository) {
    return this.apiRequest(`/api/rate?${username}_${repository}`);
  }
}
