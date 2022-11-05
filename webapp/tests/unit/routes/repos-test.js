import { module, test } from 'qunit';
import { setupTest } from 'webapp/tests/helpers';

module('Unit | Route | repos', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:repos');
    assert.ok(route);
  });
});
