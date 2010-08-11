var mime = require('./mime');

exports["test mime lookup"] = function(test) {
  // easy
  test.equal('text/plain', mime.lookup('text.txt'));
  
  // hidden file or multiple periods
  test.equal('text/plain', mime.lookup('.text.txt'));

  // just an extension
  test.equal('text/plain', mime.lookup('.txt'));
  
  // just an extension without a dot
  test.equal('text/plain', mime.lookup('txt'));
  
  // default
  test.equal('application/octet-stream', mime.lookup('text.nope'));

  // fallback
  test.equal('fallback', mime.lookup('text.fallback', 'fallback'));

  test.finish();
};

exports["test mime lookup uppercase"] = function(test) {
  // easy
  test.equal('text/plain', mime.lookup('TEXT.TXT'));
  
  // just an extension
  test.equal('text/plain', mime.lookup('.TXT'));
  
  // just an extension without a dot
  test.equal('text/plain', mime.lookup('TXT'));
  
  // default
  test.equal('application/octet-stream', mime.lookup('TEXT.NOPE'));

  // fallback
  test.equal('fallback', mime.lookup('TEXT.FALLBACK', 'fallback'));

  test.finish();
};

exports["test charset lookup"] = function(test) {
  // easy
  test.equal('UTF-8', mime.charsets.lookup('text/plain'));
  
  // none
  test.ok(typeof mime.charsets.lookup('text/nope') == 'undefined');

  // fallback
  test.equal('fallback', mime.charsets.lookup('text/fallback', 'fallback'));

  test.finish();
};

if (module == require.main) {
  require('async_testing').run(__filename, process.ARGV);
}
