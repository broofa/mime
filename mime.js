var sys = require('sys');
var path = require('path');
var fs = require('fs');

/**
  * Load mimetype map from an Apache2 mime.types file.  For the
  * canonical Apache file:
  * http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
  */
function _init(mimeFile) {
  var types = exports.types = {};
  var extensions = exports.extensions = {};

  if (!mimeFile) mimeFile = path.join(__dirname, 'mime.types');

  var content = fs.readFileSync(mimeFile, 'binary');
  var lines = content.split(/[\r\n]+/), line;
  // Each line
  while (line = lines.shift()) {
    line = line.replace(/#.*/);       // Remove comments
    if (line) {
      line = line.split(/\s+/); // Split into fields
      var mimeType = line.shift(), ext; // field 0 = type
      // All remaining fields are extensions
      while (mimeType && (ext = line.shift())) {
        if (types[ext]) {
          throw Error('Extension "' + ext + '" maps to multiple types');
        }
        types[ext] = mimeType;
        // For extension map, we use the first extension listed
        if (!extensions[mimeType]) {
          extensions[mimeType] = ext;
        }
      }
    }
  }
}
_init();

/**
 * Lookup a mime type based on extension
 */
exports.lookup = function(path, fallback) {
  var ext = path.replace(/.*[\.\/]/, '').toLowerCase();
  return exports.types[ext] || fallback || exports.default_type;
};

/**
 * Return file extension associated with a mime type
 */
exports.extension = function(mimeType) {
  return exports.extensions[mimeType];
};

exports.default_type = exports.types.bin; // bin = application/octet-stream

var charsets = exports.charsets = {
  lookup: function(mimeType, fallback) {
    // RWK: With mime.types being a) large and b) dynamic, is it reasonable to
    // assume that all "text/*" types should be UTF-8 rather than trying to map
    // them individually?
    return /^text\//.test(mimeType) ? 'UTF-8' : fallback;
  }
};
