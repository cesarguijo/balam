import { test } from 'node:test';
import assert from 'node:assert/strict';
import { icon, iconNames } from '../public/js/icons.js';

test('icon returns an SVG', () => {
  const result = icon('menu');
  assert.match(result, /^<svg/);
});

test('Every icon has a different drawing', () => {
  const drawings = new Set(iconNames.map((name) => icon(name)));
  assert.equal(drawings.size, iconNames.length);
});

test('No icon has hard-coded colors', () => {
  iconNames.forEach((name) => {
    assert.doesNotMatch(
      icon(name),
      /(fill|stroke)="(?!none"|currentColor")/,
      `Icon ${name} has a hard-coded color`,
    );
  });
});

test('Every icon has at least one <path>', () => {
  iconNames.forEach((name) => {
    assert.match(icon(name), /<path\s/, `Icon ${name} has no <path>`);
  });
});

test('An unknown icon throws an error', () => {
  assert.throws(() => icon('does-not-exist'), /does-not-exist/);
});

test('icon adds aria-hidden', () => {
  const result = icon('menu');
  assert.ok(result.includes('aria-hidden="true"'));
});

test('icon adds the icon class', () => {
  const result = icon('menu');
  assert.ok(result.includes('class="icon"'));
});
