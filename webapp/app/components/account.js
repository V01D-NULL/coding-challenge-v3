import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { apiSubmitCredentials } from '../helpers/api';

export default class AccountComponent extends Component {
  @service router;

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

    apiSubmitCredentials(
      [this.loginField.username, this.loginField.password],
      'signup',
      () => this.router.transitionTo('/')
    );
  }

  @action
  signup(event) {
    event.preventDefault();

    apiSubmitCredentials(
      [this.signupField.username, this.signupField.password],
      'signup',
      () => {
        alert('Successfully created account');
      }
    );
  }
}
