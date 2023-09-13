import assert from 'assert';
import child_process from 'child_process';
import { describe, it } from 'node:test';
import util from 'node:util';
import Mime from '../dist/src/Mime.js';
import mime from '../dist/src/index.js';
import { testGetExtension, testGetType } from './test_util.js';

describe('class Mime', (t) => {
  it('mime and mime/lite coexist', async function () {
    await assert.doesNotReject(() => import('../dist/src/index_lite.js'));
  });

  it('new constructor()', (t) => {
    const mime = new Mime({ 'text/a': ['a', 'a1'] }, { 'text/b': ['b', 'b1'] });

    testGetType(
      t,
      mime,
      [
        { input: 'a', expected: 'text/a' },
        { input: 'a1', expected: 'text/a' },
        { input: 'b', expected: 'text/b' },
        { input: 'b1', expected: 'text/b' },
      ],
      mime,
    );

    testGetExtension(
      t,
      mime,
      [
        { input: 'text/a', expected: 'a' },
        { input: 'text/b', expected: 'b' },
      ],
      mime,
    );
  });

  it('define()', (t) => {
    const mime = new Mime({ 'text/a': ['a'] }, { 'text/b': ['b'] });

    // Should throw when trying to override an existing type->ext mapping
    assert.throws(() => mime.define({ 'text/c': ['b'] }));

    // Should not throw if it's a mapping we already have
    assert.doesNotThrow(() => mime.define({ 'text/c': ['b', 'c'] }, true));

    testGetType(t, mime, [
      { input: 'a', expected: 'text/a' },
      { input: 'b', expected: 'text/c' },
      { input: 'c', expected: 'text/c' },
    ]);

    testGetExtension(t, mime, [
      { input: 'text/a', expected: 'a' },
      { input: 'text/c', expected: 'b' },
      { input: 'text/c', expected: 'b' },
    ]);
  });

  it("define() *'ed types", (t) => {
    const mime = new Mime({ 'text/a': ['*b'] }, { 'text/b': ['b'] });

    testGetType(t, mime, [{ input: 'b', expected: 'text/b' }]);

    testGetExtension(t, mime, [
      { input: 'text/a', expected: 'b' },
      { input: 'text/b', expected: 'b' },
    ]);
  });

  it('case-insensitive', (t) => {
    const mime = new Mime({
      'TEXT/UPPER': ['UP'],
      'text/lower': ['low'],
    });

    testGetType(t, mime, [
      { input: 'up', expected: 'text/upper' },
      { input: 'UP', expected: 'text/upper' },
      { input: 'low', expected: 'text/lower' },
      { input: 'LOW', expected: 'text/lower' },
    ]);

    testGetExtension(t, mime, [
      { input: 'text/upper', expected: 'up' },
      { input: 'text/lower', expected: 'low' },
      { input: 'TEXT/UPPER', expected: 'up' },
      { input: 'TEXT/LOWER', expected: 'low' },
    ]);
  });

  it('getType()', function () {
    testGetType(t, mime, [
      // Upper/lower case

      { input: 'text.txt', expected: 'text/plain' },
      { input: 'TEXT.TXT', expected: 'text/plain' },

      // Bare extension
      { input: 'txt', expected: 'text/plain' },
      { input: '.txt', expected: 'text/plain' },
      { input: '.bogus', expected: null },
      { input: 'bogus', expected: null },

      // File paths
      { input: 'dir/text.txt', expected: 'text/plain' },
      { input: 'dir\\text.txt', expected: 'text/plain' },
      { input: '.text.txt', expected: 'text/plain' },
      { input: '.txt', expected: 'text/plain' },
      { input: 'txt', expected: 'text/plain' },
      { input: '/path/to/page.html', expected: 'text/html' },
      { input: 'c:\\path\\to\\page.html', expected: 'text/html' },
      { input: 'page.html', expected: 'text/html' },
      { input: 'path/to/page.html', expected: 'text/html' },
      { input: 'path\\to\\page.html', expected: 'text/html' },
      { input: '/txt', expected: null },
      { input: '\\txt', expected: null },
      { input: 'text.nope', expected: null },
      { input: '/path/to/file.bogus', expected: null },
      { input: '/path/to/json', expected: null },
      { input: '/path/to/.json', expected: null },
      { input: '/path/to/.config.json', expected: 'application/json' },
      { input: '.config.json', expected: 'application/json' },

      // Non-sensical
      { input: null, expected: null },
      { input: undefined, expected: null },
      { input: 42, expected: null },
      { input: {}, expected: null },
    ]);
  });

  it('getExtension()', function () {
    testGetExtension(t, mime, [
      // Upper/lower case
      { input: 'text/html', expected: 'html' },
      { input: ' text/html', expected: 'html' },
      { input: 'text/html ', expected: 'html' },

      { input: 'application/x-bogus', expected: null },
      { input: 'bogus', expected: null },
      { input: null, expected: null },
      { input: undefined, expected: null },
      { input: 42, expected: null },
      { input: {}, expected: null },
    ]);
  });
});

it('getAllExtensions()', () => {
  const mime = new Mime({ 'text/a': ['a', 'b'] }, { 'text/a': ['b', 'c'] });
  assert.deepEqual([...mime.getAllExtensions('text/a')].sort(), [
    'a',
    'b',
    'c',
  ]);
});

describe('DB', () => {
  it('Consistency', () => {
    const { types, extensions } = mime._getTestState();

    for (const ext in types) {
      assert.equal(
        ext,
        extensions[types[ext]],
        '${ext} does not have consistent ext->type->ext mapping',
      );
    }
  });

  it('Specific types', (t) => {
    testGetType(t, mime, [
      { input: 'html', expected: 'text/html' },
      { input: 'js', expected: 'text/javascript' },
      { input: 'json', expected: 'application/json' },
      { input: 'rtf', expected: 'application/rtf' },
      { input: 'txt', expected: 'text/plain' },
      { input: 'xml', expected: 'application/xml' },
      { input: 'wasm', expected: 'application/wasm' },
    ]);

    testGetExtension(t, mime, [{ input: 'text/xml', expected: 'xml' }]);
  });

  it('charset parameter', (t) => {
    testGetExtension(t, mime, [
      { input: 'text/html;charset=UTF-8', expected: 'html' },
      { input: 'text/HTML; charset=UTF-8', expected: 'html' },
      { input: 'text/html; charset=UTF-8', expected: 'html' },
      { input: 'text/html; charset=UTF-8 ', expected: 'html' },
      { input: 'text/html ; charset=UTF-8', expected: 'html' },
      { input: 'application/octet-stream', expected: 'bin' },
      { input: 'application/octet-stream ', expected: 'bin' },
      { input: ' text/html; charset=UTF-8', expected: 'html' },
      { input: 'text/html; charset=UTF-8 ', expected: 'html' },
      { input: 'text/html; charset=UTF-8', expected: 'html' },
      { input: 'text/html ; charset=UTF-8', expected: 'html' },
      { input: 'text/html;charset=UTF-8', expected: 'html' },
      { input: 'text/Html;charset=UTF-8', expected: 'html' },
    ]);
  });
});

describe('CLI', function () {
  const exec = util.promisify(child_process.exec);

  it('returns type', async () => {
    const { stdout } = await exec('./bin/cli.js mpeg');
    assert.equal(stdout, 'video/mpeg\n');
  });

  it('returns extension', async () => {
    const { stdout } = await exec('./bin/cli.js -r video/mpeg');
    assert.equal(stdout, 'mpeg\n');
  });
});
