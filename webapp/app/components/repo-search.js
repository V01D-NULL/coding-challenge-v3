import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { enableCommentBox } from './ui/comment-box';

export default class RepoSearchComponent extends Component {
  @tracked repositories = [];
  @tracked username = '';
  @service api;
  @service router;

  @action async search(event) {
    event.preventDefault();

    const repos = await this.api.fetchRepositories(this.username);
    for (let repo of repos) {
      repo.rating = await this.api.fetchRepositoryRating(
        this.username,
        repo.name
      );
    }

    this.repositories = repos;
  }

  @action home() {
    this.router.transitionTo('/');
  }
}
