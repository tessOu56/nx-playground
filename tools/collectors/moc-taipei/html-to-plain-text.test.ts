import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { htmlToPlainText } from './html-to-plain-text';

describe('htmlToPlainText', () => {
  it('decodes each entity once so &amp;lt; stays &lt;', () => {
    assert.equal(htmlToPlainText('A &amp; B'), 'A & B');
    assert.equal(htmlToPlainText('&amp;lt;'), '&lt;');
    assert.equal(htmlToPlainText('&amp;lt;script&amp;gt;'), '&lt;script&gt;');
    assert.equal(htmlToPlainText('&quot;hi&quot;'), '"hi"');
    assert.equal(htmlToPlainText('a&nbsp;b'), 'a b');
    assert.equal(htmlToPlainText('&#65;&#x42;'), 'AB');
  });

  it('drops tags including spaced script closers without a script-filter regex', () => {
    assert.equal(htmlToPlainText('<p>hello</p>'), 'hello');
    assert.equal(htmlToPlainText('<script>payload</script>'), 'payload');
    assert.equal(htmlToPlainText('<script >payload</script >'), 'payload');
    assert.equal(htmlToPlainText('<b>bold</b> text'), 'bold text');
  });

  it('decodes encoded tags then strips them', () => {
    assert.equal(htmlToPlainText('&lt;b&gt;safe&lt;/b&gt;'), 'safe');
  });
});
