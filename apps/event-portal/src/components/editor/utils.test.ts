import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseMarkdownStyle } from './utils';

describe('parseMarkdownStyle', () => {
  it('keeps https links and drops javascript hrefs', () => {
    assert.deepEqual(parseMarkdownStyle('[官方](https://www.tfam.museum/)'), {
      content: '官方',
      style: 'link',
      href: 'https://www.tfam.museum/',
    });
    assert.deepEqual(parseMarkdownStyle('[x](javascript:alert(1))'), {
      content: 'x',
      style: 'normal',
    });
  });
});
