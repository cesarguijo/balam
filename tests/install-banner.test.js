import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shouldShowInstallBanner } from '../public/components/install-banner/visibility.js';

test('It shows the banner in the phone browser when Balam is not installed', () => {
  assert.equal(
    shouldShowInstallBanner({
      isDesktop: false,
      installed: false,
      dismissed: false,
    }),
    true,
  );
});

test('It hides the banner on desktop', () => {
  assert.equal(
    shouldShowInstallBanner({
      isDesktop: true,
      installed: false,
      dismissed: false,
    }),
    false,
  );
});

test('It hides the banner when Balam is already installed', () => {
  assert.equal(
    shouldShowInstallBanner({
      isDesktop: false,
      installed: true,
      dismissed: false,
    }),
    false,
  );
});

test('It hides the banner after the family closed it', () => {
  assert.equal(
    shouldShowInstallBanner({
      isDesktop: false,
      installed: false,
      dismissed: true,
    }),
    false,
  );
});
