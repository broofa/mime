var defaultTypes  = require('./types.json');
var Mime = require('./lib/mime');

// Default instance
var mime = new Mime();

// Bind the exported instance variables so they may be invoked without the
// module as an explicit context, i.e.
//
//     var extensionFromMime = require('mime').extension;
//     extensionFromMime('text/plain');
Object.keys(Mime.prototype).forEach(function(key) {
  var method = Mime.prototype[key];
  if (typeof method === 'function') {
    mime[key] = method.bind(mime);
  }
});

// Default types
mime.define(defaultTypes);

// Default type
mime.default_type = mime.lookup('bin');

//
// Additional API specific to the default instance
//

mime.Mime = Mime;

/**
 * Lookup a charset based on mime type.
 */
mime.charsets = {
  lookup: function(mimeType, fallback) {
    // Assume text types are utf8
    return (/^text\//).test(mimeType) ? 'UTF-8' : fallback;
  }
};

module.exports = mime;
