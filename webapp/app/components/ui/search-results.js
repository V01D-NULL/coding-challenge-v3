import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class UiSearchResultsComponent extends Component {
  @tracked showCommentBox = false;
  username;
  repo;

  @action toggleCommentBox() {
    this.showCommentBox = !this.showCommentBox;
  }
}
