import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class UiCommentBoxComponent extends Component {
  @tracked comment;
  @service api;
}
