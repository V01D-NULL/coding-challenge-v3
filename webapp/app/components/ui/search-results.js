import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class UiSearchResultsComponent extends Component {
  @tracked showCommentBox = false;
  @tracked writeComment = false;
  @tracked comments = [];
  @tracked slider;
  @service api;
  username;
  repo;

  @action async toggleCommentBox(writeComment) {
    this.showCommentBox = !this.showCommentBox;
    this.writeComment = writeComment;
    if (!this.writeComment) {
      this.comments = await this.api.fetchComments(this.username, this.repo);
    }
  }
}
