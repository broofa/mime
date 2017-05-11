/**
 * Usage: node test.js
 */

var mime = require('../mime');
var assert = require('assert');

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
// Test types that are known to have conflicting definitions but different facet priorities
//

assert.equal('application/octet-stream', mime.lookup('dmg'));
assert.equal('application/bdoc', mime.lookup('bdoc'));
assert.equal('application/octet-stream', mime.lookup('deb'));
assert.equal('application/octet-stream', mime.lookup('iso'));
assert.equal('application/octet-stream', mime.lookup('exe'));
assert.equal('application/octet-stream', mime.lookup('exe'));
assert.equal('application/octet-stream', mime.lookup('dll'));
assert.equal('application/octet-stream', mime.lookup('msi'));
assert.equal('application/vnd.palm', mime.lookup('pdb'));
assert.equal('audio/mp3', mime.lookup('mp3'));
assert.equal('audio/mp4', mime.lookup('m4a'));
assert.equal('font/opentype', mime.lookup('otf'));
assert.equal('image/bmp', mime.lookup('bmp'));

//
// Test extensions
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
assert.equal(undefined, mime.charsets.lookup(mime.types.js));
assert.equal('fallback', mime.charsets.lookup('application/octet-stream', 'fallback'));

console.log('\nAll tests passed');
