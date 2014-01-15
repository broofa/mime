var path = require('path');
var fs = require('fs');

function Mime() {
  // Map of extension -> mime type
  this.types = Object.create(null);

  // Map of mime type -> extension
  this.extensions = Object.create(null);
}

/**
 * Define mimetype -> extension mappings.  Each key is a mime-type that maps
 * to an array of extensions associated with the type.  The first extension is
 * used as the default extension for the type.
 *
 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
 *
 * @param map (Object) type definitions
 */
Mime.prototype.define = function (map) {
  for (var type in map) {
    var exts = map[type];

    for (var i = 0; i < exts.length; i++) {
      if (process.env.DEBUG_MIME && this.types[exts]) {
        console.warn(this._loading.replace(/.*\//, ''), 'changes "' + exts[i] + '" extension type from ' +
          this.types[exts] + ' to ' + type);
      }

      this.types[exts[i]] = type;
    }

    // Default extension is the first one we encounter
    if (!this.extensions[type]) {
      this.extensions[type] = exts[0];
    }
  }
};

/**
 * Load an Apache2-style ".types" file
 *
 * This may be called multiple times (it's expected).  Where files declare
 * overlapping types/extensions, the last file wins.
 *
 * @param file (String) path of file to load.
 */
Mime.prototype.load = function(file) {

  this._loading = file;
  // Read file and split into lines
  var map = {},
      content = fs.readFileSync(file, 'ascii'),
      lines = content.split(/[\r\n]+/);

  lines.forEach(function(line) {
    // Clean up whitespace/comments, and split into fields
    var fields = line.replace(/\s*#.*|^\s*|\s*$/g, '').split(/\s+/);
    map[fields.shift()] = fields;
  });

  this.define(map);

  this._loading = null;
};

/**
 * Lookup a mime type based on extension
 */
Mime.prototype.lookup = function(path, fallback) {
  var ext = path.replace(/.*[\.\/\\]/, '').toLowerCase();

  return this.types[ext] || fallback || this.default_type;
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.extension = function(mimeType) {
  var type = mimeType.match(/^\s*([^;\s]*)(?:;|\s|$)/)[1].toLowerCase();
  return this.extensions[type];
};

/**
 * Compare two mime types and see if they match exactly or overlap.
 *
 * Examples:
 * 'image/*' overlaps with 'image/png'
 * 'image/png' matches exactly with 'image/png'
 * 'text/plain' does not match at all with 'text/html'
 * '*' overlaps with 'application/json'
 *
 * @param a (String) a valid mime type
 * @param b (String) another valid mime type
 * @return (Boolean) true if they match or overlap, otherwise false
 */
Mime.prototype.compare = function(a, b) {
  if (!a || !b) return false;
  // if (!this.extension(a) || !this.extension(b)) return false;

  a = a.match(/^\s*([^;\s]*)(?:;|\s|$)/)[1].toLowerCase();
  b = b.match(/^\s*([^;\s]*)(?:;|\s|$)/)[1].toLowerCase();
  
  var tokens_a = a.split("/"),
      toplevel_a = tokens_a[0],
      sublevel_a = tokens_a[1];  
  var tokens_b = b.split("/"),
      toplevel_b = tokens_b[0],
      sublevel_b = tokens_b[1];  
  
  if (toplevel_a === "*" || toplevel_b === "*") return true;
  if (toplevel_a === toplevel_b) {
    if (sublevel_a === "*" || sublevel_b === "*"
      || sublevel_a === sublevel_b) return true;    
  }

  return false;
}

// Default instance
var mime = new Mime();

// Load local copy of
// http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
mime.load(path.join(__dirname, 'types/mime.types'));

// Load additional types from node.js community
mime.load(path.join(__dirname, 'types/node.types'));

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
