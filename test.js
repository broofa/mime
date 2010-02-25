var async_testing = require('async_testing');
var utils = require('../lib/utils');

exports['Mime Tests'] = (new async_testing.TestSuite())
  .addTests({
    "test mime lookup": function(assert) {
      // easy
      assert.equal('text/plain', utils.mime.lookup('text.txt'));
      
      // just an extension
      assert.equal('text/plain', utils.mime.lookup('.txt'));
      
      // default
      assert.equal('application/octet-stream', utils.mime.lookup('text.nope'));

      // fallback
      assert.equal('fallback', utils.mime.lookup('text.fallback', 'fallback'));
    },
    "test charset lookup": function(assert) {
      // easy
      assert.equal('UTF-8', utils.charsets.lookup('text/plain'));
      
      // none
      assert.ok(typeof utils.charsets.lookup('text/nope') == 'undefined');

      // fallback
      assert.equal('fallback', utils.charsets.lookup('text/fallback', 'fallback'));
    }
  });

if (module === require.main) {
  async_testing.runSuites(exports);
}
