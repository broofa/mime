'use strict';

const mime = require('..');
const mimeTypes = require('../node_modules/mime-types');
const assert = require('assert');
const chalk = require('chalk');
const {exec} = require('child_process');

describe('class Mime', function() {
  it('mime and mime/lite coexist', function() {
    assert.doesNotThrow(function() {
      require('../lite');
    });
  });

  it('new constructor()', function() {
    let Mime = require('../Mime');

    let mime = new Mime(
      {'text/a': ['a', 'a1']},
      {'text/b': ['b', 'b1']}
    );

    assert.deepEqual(mime._types, {
      a: 'text/a',
      a1: 'text/a',
      b: 'text/b',
      b1: 'text/b',
    });

    assert.deepEqual(mime._extensions, {
      'text/a': 'a',
      'text/b': 'b',
    });
  });

  it('define()', function() {
    let Mime = require('../Mime');

    let mime = new Mime({'text/a': ['a']}, {'text/b': ['b']});

    assert.throws(function() {
      mime.define({'text/c': ['b']});
    });

    assert.doesNotThrow(function() {
      mime.define({'text/c': ['b']}, true);
    });

    assert.deepEqual(mime._types, {
      a: 'text/a',
      b: 'text/c',
    });

    assert.deepEqual(mime._extensions, {
      'text/a': 'a',
      'text/b': 'b',
      'text/c': 'b',
    });
  });

  it('define() *\'ed types', function() {
    let Mime = require('../Mime');

    let mime = new Mime(
      {'text/a': ['*b']},
      {'text/b': ['b']}
    );

    assert.deepEqual(mime._types, {
      b: 'text/b',
    });

    assert.deepEqual(mime._extensions, {
      'text/a': 'b',
      'text/b': 'b',
    });
  });

  it ('case-insensitive', function() {
    let Mime = require('../Mime');
    const mime = new Mime({
      'TEXT/UPPER': ['UP'],
      'text/lower': ['low'],
    });

    assert.equal(mime.getType('test.up'), 'text/upper');
    assert.equal(mime.getType('test.UP'), 'text/upper');
    assert.equal(mime.getType('test.low'), 'text/lower');
    assert.equal(mime.getType('test.LOW'), 'text/lower');

    assert.equal(mime.getExtension('text/upper'), 'up');
    assert.equal(mime.getExtension('text/lower'), 'low');
    assert.equal(mime.getExtension('TEXT/UPPER'), 'up');
    assert.equal(mime.getExtension('TEXT/LOWER'), 'low');
  });

  it('getType()', function() {
    // Upper/lower case
    assert.equal(mime.getType('text.txt'), 'text/plain');
    assert.equal(mime.getType('TEXT.TXT'), 'text/plain');

    // Bare extension
    assert.equal(mime.getType('txt'), 'text/plain');
    assert.equal(mime.getType('.txt'), 'text/plain');
    assert.strictEqual(mime.getType('.bogus'), null);
    assert.strictEqual(mime.getType('bogus'), null);

    // Non-sensical
    assert.strictEqual(mime.getType(null), null);
    assert.strictEqual(mime.getType(undefined), null);
    assert.strictEqual(mime.getType(42), null);
    assert.strictEqual(mime.getType({}), null);

    // File paths
    assert.equal(mime.getType('dir/text.txt'), 'text/plain');
    assert.equal(mime.getType('dir\\text.txt'), 'text/plain');
    assert.equal(mime.getType('.text.txt'), 'text/plain');
    assert.equal(mime.getType('.txt'), 'text/plain');
    assert.equal(mime.getType('txt'), 'text/plain');
    assert.equal(mime.getType('/path/to/page.html'), 'text/html');
    assert.equal(mime.getType('c:\\path\\to\\page.html'), 'text/html');
    assert.equal(mime.getType('page.html'), 'text/html');
    assert.equal(mime.getType('path/to/page.html'), 'text/html');
    assert.equal(mime.getType('path\\to\\page.html'), 'text/html');
    assert.strictEqual(mime.getType('/txt'), null);
    assert.strictEqual(mime.getType('\\txt'), null);
    assert.strictEqual(mime.getType('text.nope'), null);
    assert.strictEqual(mime.getType('/path/to/file.bogus'), null);
    assert.strictEqual(mime.getType('/path/to/json'), null);
    assert.strictEqual(mime.getType('/path/to/.json'), null);
    assert.strictEqual(mime.getType('/path/to/.config.json'), 'application/json');
    assert.strictEqual(mime.getType('.config.json'), 'application/json');
  });

  it('getExtension()', function() {
    assert.equal(mime.getExtension('text/html'), 'html');
    assert.equal(mime.getExtension(' text/html'), 'html');
    assert.equal(mime.getExtension('text/html '), 'html');
    assert.strictEqual(mime.getExtension('application/x-bogus'), null);
    assert.strictEqual(mime.getExtension('bogus'), null);
    assert.strictEqual(mime.getExtension(null), null);
    assert.strictEqual(mime.getExtension(undefined), null);
    assert.strictEqual(mime.getExtension(42), null);
    assert.strictEqual(mime.getExtension({}), null);
  });
});

describe('DB', function() {
  let diffs = [];

  after(function() {
    if (diffs.length) {
      console.log('\n[INFO] The following inconsistencies with MDN (https://goo.gl/lHrFU6) and/or mime-types (https://github.com/jshttp/mime-types) are expected:');
      diffs.forEach(function(d) {
        console.warn(
          '  ' + d[0]+ '[' + chalk.blue(d[1]) + '] = ' + chalk.red(d[2]) +
          ', mime[' + d[1] + '] = ' + chalk.green(d[3])
        );
      });
    }
  });

  it('Consistency', function() {
    for (let ext in this.types) {
      assert.equal(ext, this.extensions[this.types[ext]], '${ext} does not have consistent ext->type->ext mapping');
    }
  });

  it('MDN types', function() {
    // MDN types listed at https://goo.gl/lHrFU6
    let MDN = {
      aac: 'audio/aac',
      abw: 'application/x-abiword',
      arc: 'application/x-freearc',
      avi: 'video/x-msvideo',
      azw: 'application/vnd.amazon.ebook',
      bin: 'application/octet-stream',
      bmp: 'image/bmp',
      bz: 'application/x-bzip',
      bz2: 'application/x-bzip2',
      csh: 'application/x-csh',
      css: 'text/css',
      csv: 'text/csv',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      eot: 'application/vnd.ms-fontobject',
      epub: 'application/epub+zip',
      gz: 'application/gzip',
      gif: 'image/gif',
      htm: 'text/html',
      html: 'text/html',
      ico: 'image/vnd.microsoft.icon',
      ics: 'text/calendar',
      jar: 'application/java-archive',
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      js: 'text/javascript',
      json: 'application/json',
      jsonld: 'application/ld+json',
      mid: 'audio/x-midi',
      midi: 'audio/x-midi',
      mjs: 'text/javascript',
      mp3: 'audio/mpeg',
      mpeg: 'video/mpeg',
      mpkg: 'application/vnd.apple.installer+xml',
      odp: 'application/vnd.oasis.opendocument.presentation',
      ods: 'application/vnd.oasis.opendocument.spreadsheet',
      odt: 'application/vnd.oasis.opendocument.text',
      oga: 'audio/ogg',
      ogv: 'video/ogg',
      ogx: 'application/ogg',
      opus: 'audio/opus',
      otf: 'font/otf',
      png: 'image/png',
      pdf: 'application/pdf',
      php: 'application/php',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      rar: 'application/vnd.rar',
      rtf: 'application/rtf',
      sh: 'application/x-sh',
      svg: 'image/svg+xml',
      swf: 'application/x-shockwave-flash',
      tar: 'application/x-tar',
      tif: 'image/tiff',
      tiff: 'image/tiff',
      ts: 'video/mp2t',
      ttf: 'font/ttf',
      txt: 'text/plain',
      vsd: 'application/vnd.visio',
      wav: 'audio/wav',
      weba: 'audio/webm',
      webm: 'video/webm',
      webp: 'image/webp',
      woff: 'font/woff',
      woff2: 'font/woff2',
      xhtml: 'application/xhtml+xml',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      xml: 'application/xml',
      xul: 'application/vnd.mozilla.xul+xml',
      zip: 'application/zip',
      '3gp': 'video/3gpp',
      '3g2': 'video/3gpp2',
      '7z': 'application/x-7z-compressed',
    };

    for (let ext in MDN) {
      let expected = MDN[ext];
      let actual = mime.getType(ext);
      if (actual !== expected) diffs.push(['MDN', ext, expected, actual]);
    }

    for (let ext in mimeTypes.types) {
      let expected = mimeTypes.types[ext];
      let actual = mime.getType(ext);
      if (actual !== expected) diffs.push(['mime-types', ext, expected, actual]);
    }
  });

  it('Specific types', function() {
    // Assortment of types we sanity check for good measure
    assert.equal(mime.getType('html'), 'text/html');
    assert.equal(mime.getType('js'), 'application/javascript');
    assert.equal(mime.getType('json'), 'application/json');
    assert.equal(mime.getType('rtf'), 'application/rtf');
    assert.equal(mime.getType('txt'), 'text/plain');
    assert.equal(mime.getType('xml'), 'application/xml');

    assert.equal(mime.getType('wasm'), 'application/wasm');
  });

  it('Specific extensions', function() {
    assert.equal(mime.getExtension('text/html;charset=UTF-8'), 'html');
    assert.equal(mime.getExtension('text/HTML; charset=UTF-8'), 'html');
    assert.equal(mime.getExtension('text/html; charset=UTF-8'), 'html');
    assert.equal(mime.getExtension('text/html; charset=UTF-8 '), 'html');
    assert.equal(mime.getExtension('text/html ; charset=UTF-8'), 'html');
    assert.equal(mime.getExtension(mime._types.text), 'txt');
    assert.equal(mime.getExtension(mime._types.htm), 'html');
    assert.equal(mime.getExtension('application/octet-stream'), 'bin');
    assert.equal(mime.getExtension('application/octet-stream '), 'bin');
    assert.equal(mime.getExtension(' text/html; charset=UTF-8'), 'html');
    assert.equal(mime.getExtension('text/html; charset=UTF-8 '), 'html');
    assert.equal(mime.getExtension('text/html; charset=UTF-8'), 'html');
    assert.equal(mime.getExtension('text/html ; charset=UTF-8'), 'html');
    assert.equal(mime.getExtension('text/html;charset=UTF-8'), 'html');
    assert.equal(mime.getExtension('text/Html;charset=UTF-8'), 'html');
    assert.equal(mime.getExtension('unrecognized'), null);

    assert.equal(mime.getExtension('text/xml'), 'xml'); // See #180
  });
});

describe('mime CLI', function() {
  it('returns type', function(done) {
    exec('./cli.js mpeg', (err, stdout, stderr) => {
      if (err) done(err);
      assert.equal(stdout, 'video/mpeg\n');
      done();
    });
  });
  
  it('returns extension', function(done) {
    exec('./cli.js -r video/mpeg', (err, stdout, stderr) => {
      if (err) done(err);
      assert.equal(stdout, 'mpeg\n');
      done();
    });
  });
});

