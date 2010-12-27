var sys = require('sys');
var path = require('path');
var fs = require('fs');

exports.types = {};
exports.extensions = {};

/**
 * Load an Apache2-style type file
 */
exports.load = function(mimeFile) {
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
        // Assign type for extension.  If the same extension is declared for
        // multiple types, the last one wins.
        exports.types[ext] = mimeType;

        // For the extension map use the first extension listed
        if (!exports.extensions[mimeType]) {
          exports.extensions[mimeType] = ext;
        }
      }
    }
  }
};

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

/**
 * Lookup a charset based on mime type.
 */
exports.charsets = {
  lookup: function (mimeType, fallback) {
    // Assume text types are utf8.  Modify this logic as needed.
    return /^text\//.test(mimeType) ? 'UTF-8' : fallback;
  }
};

// Load our local copy of
// http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
exports.load(path.join(__dirname, 'mime.types'));

// Now "overlay" requested enhancements
exports.load(path.join(__dirname, 'node.types'));

// Set a default type
exports.default_type = exports.types.bin;
