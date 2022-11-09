import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class UiCommentBoxComponent extends Component {
  @action enableCommentBox(username, repo) {
    console.log('enable comment box for [user, repo]', username, repo);
  }
}
