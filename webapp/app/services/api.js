import Service from '@ember/service';
import { action } from '@ember/object';
import { verifyJson } from '../helpers/json';

export default class ApiService extends Service {
  API_URL = 'http://127.0.0.1:4200';

  async apiRequest(url, requestArguments, verify = true) {
    const data = await fetch(this.API_URL + url, requestArguments);
    const json = await data.json();

    if (verify && !verifyJson(json)) return undefined;

    return json;
  }

  submitCredentials([username, password], apiEndpoint, callback) {
    const requestType = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    };

    this.apiRequest(
      `/api/${apiEndpoint}?username=${username}&password=${password}`,
      requestType,
      false
    ).then((data) => {
      console.log(data);
      if (!data.success) alert(data.error);
      else callback();
    });
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

  fetchRepositories(username) {
    return this.apiRequest(`/api/repositories?username=${username}`);
  }

  fetchRepositoryRating(username, repository) {
    return this.apiRequest(`/api/rate?${username}_${repository}`);
  }

  fetchComments(username, repository) {
    return this.apiRequest(`/api/comment?name=${username}_${repository}`);
  }

  @action submitComment(username, repo, comment) {
    const requestType = {
      method: 'POST',
      body: comment,
      headers: {
        'Content-type': 'application/text; charset=UTF-8',
      },
    };

    return this.apiRequest(
      `/api/comment?name=${username}_${repo}&id=${+new Date()}`,
      requestType
    );
  }

  @action rateRepository(username, repo, score) {
    const requestType = {
      method: 'POST',
      headers: {
        'Content-type': 'application/text; charset=UTF-8',
      },
    };

    this.apiRequest(
      `/api/rate?name=${username}_${repo}&score=${score}`,
      requestType
    );
  }

  @action deleteComment(name, id) {
    if (!id) {
      console.error('Tried to delete comment with an undefined or null id!');
      return;
    }

    const requestType = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/text; charset=UTF-8',
      },
    };

    return this.apiRequest(`/api/comment?name=${name}&id=${id}`, requestType);
  }

  @action async editComment(name, id, comment) {
    if (!id) {
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

    const request = await this.apiRequest(
      `/api/comment?name=${name}&id=${id}&edit=1`,
      requestType
    );

    console.log(request);
    return request;
  }
}
