import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  PLACEHOLDER_EVENT_IMAGE,
  catalogImageSrc,
  shouldOptimizeCatalogImage,
} from './catalog-image';

describe('catalogImageSrc', () => {
  it('keeps https listing images and local paths', () => {
    assert.equal(
      catalogImageSrc('https://picsum.photos/seed/tfam/1200/640'),
      'https://picsum.photos/seed/tfam/1200/640'
    );
    assert.equal(catalogImageSrc('/images/events/tfam.jpg'), '/images/events/tfam.jpg');
  });

  it('falls back for empty, javascript, and credentialed URLs', () => {
    assert.equal(catalogImageSrc(''), PLACEHOLDER_EVENT_IMAGE);
    assert.equal(catalogImageSrc('javascript:alert(1)'), PLACEHOLDER_EVENT_IMAGE);
    assert.equal(
      catalogImageSrc('https://user:pass@evil.example/x.jpg'),
      PLACEHOLDER_EVENT_IMAGE
    );
    assert.equal(catalogImageSrc('http://picsum.photos/1'), PLACEHOLDER_EVENT_IMAGE);
  });
});

describe('shouldOptimizeCatalogImage', () => {
  it('optimizes known hosts and skips SVG or unknown CDNs', () => {
    assert.equal(
      shouldOptimizeCatalogImage('https://picsum.photos/seed/a/800/600'),
      true
    );
    assert.equal(
      shouldOptimizeCatalogImage(
        'https://cloud.culture.tw/e_new_upload/cms/image/a.png'
      ),
      true
    );
    assert.equal(
      shouldOptimizeCatalogImage('https://www.tfam.museum/cover.jpg'),
      false
    );
    assert.equal(shouldOptimizeCatalogImage(PLACEHOLDER_EVENT_IMAGE), false);
  });
});
