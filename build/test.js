/**
 * Usage: node test.js
 */

var mime = require('../mime');
var assert = require('assert');
var path = require('path');

//
// Test mime lookups
//

assert.equal('text/plain', mime.lookup('text.txt'));     // normal file
assert.equal('text/plain', mime.lookup('TEXT.TXT'));     // uppercase
assert.equal('text/plain', mime.lookup('dir/text.txt')); // dir + file
assert.equal('text/plain', mime.lookup('.text.txt'));    // hidden file
assert.equal('text/plain', mime.lookup('.txt'));         // nameless
assert.equal('text/plain', mime.lookup('txt'));          // extension-only
assert.equal('text/plain', mime.lookup('/txt'));         // extension-less ()
assert.equal('text/plain', mime.lookup('\\txt'));        // Windows, extension-less
assert.equal('application/octet-stream', mime.lookup('text.nope')); // unrecognized
assert.equal('fallback', mime.lookup('text.fallback', 'fallback')); // alternate default

//
// Test extension
//

assert.equal('txt', mime.extension(mime.types.text));
assert.equal('html', mime.extension(mime.types.htm));
assert.equal('bin', mime.extension('application/octet-stream'));
assert.equal('bin', mime.extension('application/octet-stream '));
assert.equal('html', mime.extension(' text/html; charset=UTF-8'));
assert.equal('html', mime.extension('text/html; charset=UTF-8 '));
assert.equal('html', mime.extension('text/html; charset=UTF-8'));
assert.equal('html', mime.extension('text/html ; charset=UTF-8'));
assert.equal('html', mime.extension('text/html;charset=UTF-8'));
assert.equal('html', mime.extension('text/Html;charset=UTF-8'));
assert.equal(undefined, mime.extension('unrecognized'));
assert.equal('jpeg', mime.extension('image/jpeg'))

//
// Test extensions
//

assert.deepEqual(['html', 'htm'], mime.extensions('text/html'));
assert.deepEqual(['bin','dms','lrf','mar','so','dist','distz','pkg','bpk','dump','elc','deploy','buffer'], mime.extensions('application/octet-stream'))
assert.deepEqual(['jpeg','jpg','jpe'], mime.extensions('image/jpeg'))
assert.deepEqual(['latex'], mime.extensions('application/x-latex'));
assert.equal(undefined, mime.extensions('fake/mimetype'));

//
// Test node.types lookups
//

assert.equal('application/font-woff', mime.lookup('file.woff'));
assert.equal('application/octet-stream', mime.lookup('file.buffer'));
assert.equal('audio/mp4', mime.lookup('file.m4a'));
assert.equal('font/opentype', mime.lookup('file.otf'));

//
// Test charsets
//

assert.equal('UTF-8', mime.charsets.lookup('text/plain'));
assert.equal('UTF-8', mime.charsets.lookup(mime.types.js));
assert.equal('UTF-8', mime.charsets.lookup(mime.types.json));
assert.equal(undefined, mime.charsets.lookup(mime.types.xml));
assert.equal('fallback', mime.charsets.lookup('application/octet-stream', 'fallback'));

console.log('\nAll tests passed');
