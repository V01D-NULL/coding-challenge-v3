import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class AccountComponent extends Component {
  @service router;
  @service api;

  @tracked loginField = {
    username: '',
    password: '',
  };

  @tracked signupField = {
    username: '',
    password: '',
  };

  @action
  login(event) {
    event.preventDefault();

    this.api.apiSubmitCredentials(
      [this.loginField.username, this.loginField.password],
      'login',
      () => this.router.transitionTo('/')
    );
  }

  @action
  signup(event) {
    event.preventDefault();

    this.api.apiSubmitCredentials(
      [this.signupField.username, this.signupField.password],
      'signup',
      () => alert('Successfully created account')
    );
  }
}
