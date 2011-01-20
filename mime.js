var path = require('path'),
    fs = require('fs');

var mime = module.exports = {
  // Map of extension to mime type
  types: {},

  // Map of mime type to extension
  extensions :{},

  // Load an Apache2-style ".types" file
  //
  // This may be called multiple times (it's expected).  Where files declare
  // overlapping types/extensions, the last file wins.
  load: function(file) {
    // Read file and split into lines
    var content = fs.readFileSync(file, 'ascii'),
        lines = content.split(/[\r\n]+/);

    lines.forEach(function(line, lineno) {
      // Clean up whitespace/comments, and split into fields
      var fields = line.replace(/^\s*|\s*#.*|\s*$/, '')
                       .split(/\s+/);

      if (fields.length >= 2) {  // Must have type and at least 1 extension
        // Map each extension to the mime type
        for (var i = 1; i < fields.length; i++) {
          mime.types[fields[i]] = fields[0];
        }

        // Map mime type to the first extension
        mime.extensions[fields[0]] = fields[1];
      }
    });
  },

  // Lookup a mime type based on extension
  lookup: function(path, fallback) {
    var ext = path.replace(/.*[\.\/]/, '').toLowerCase();
    return mime.types[ext] || fallback || mime.default_type;
  },

  // Return file extension associated with a mime type
  extension: function(mimeType) {
    return mime.extensions[mimeType];
  },

  // Lookup a charset based on mime type.
  charsets: {
    lookup: function (mimeType, fallback) {
      // Assume text types are utf8.  Modify mime logic as needed.
      return /^text\//.test(mimeType) ? 'UTF-8' : fallback;
    }
  }
};

// Load our local copy of
// http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
mime.load(path.join(__dirname, 'mime.types'));

// Overlay enhancements we've had requests for (and that seem to make sense)
mime.load(path.join(__dirname, 'node.types'));

// Set the default type
mime.default_type = mime.types.bin;
