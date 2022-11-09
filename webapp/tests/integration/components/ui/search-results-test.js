import { module, test } from 'qunit';
import { setupRenderingTest } from 'webapp/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | ui/search-results', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Ui::SearchResults />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <Ui::SearchResults>
        template block text
      </Ui::SearchResults>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
