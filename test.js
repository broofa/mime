var async_testing = require('async_testing');
var mime = require('./mime');

exports['Mime Tests'] = (new async_testing.TestSuite())
  .addTests({
    "test mime lookup": function(assert) {
      // easy
      assert.equal('text/plain', mime.lookup('text.txt'));
      
      // just an extension
      assert.equal('text/plain', mime.lookup('.txt'));
      
      // default
      assert.equal('application/octet-stream', mime.lookup('text.nope'));

      // fallback
      assert.equal('fallback', mime.lookup('text.fallback', 'fallback'));
    },
    "test charset lookup": function(assert) {
      // easy
      assert.equal('UTF-8', mime.charsets.lookup('text/plain'));
      
      // none
      assert.ok(typeof mime.charsets.lookup('text/nope') == 'undefined');

      // fallback
      assert.equal('fallback', mime.charsets.lookup('text/fallback', 'fallback'));
    }
  });

if (module === require.main) {
  async_testing.runSuites(exports);
}
