var fs = require('fs');

// If two types claim the same extension, we resolve the conflict by checking
// facet precedence. https://tools.ietf.org/html/rfc6838#section-3
// Facets listed here are in order of decreasing precedence
var FACETS = ['vnd.', 'x-', 'prs.'];
var FACET_RE = new RegExp('/(' + FACETS.join('|') + ')');

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
Mime.prototype.define = function(map) {
  for (var type in map) {
    var exts = map[type];

    for (var i = 0; i < exts.length; i++) {
      var ext = exts[i];
      var found = this.types[ext];

      // If there's already a type for this extension ...
      if (found) {
        var pri0 = FACETS.indexOf(FACET_RE.test(found) && RegExp.$1);
        var pri1 = FACETS.indexOf(FACET_RE.test(type) && RegExp.$1);

        if (process.env.DEBUG_MIME) console.warn('Type conflict for .' + ext +
          ' (' + found + ' pri=' + pri0 + ', ' + type + ' pri=' + pri1 + ')');

        // Prioritize based on facet precedence
        if (pri0 <= pri1) continue;
      }

      this.types[ext] = type;
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
  var map = {};
  var content = fs.readFileSync(file, 'ascii');
  var lines = content.split(/[\r\n]+/);

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

  return this.types[ext] || fallback || this.default_type; // eslint-disable-line camelcase
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.extension = function(mimeType) {
  var type = mimeType.match(/^\s*([^;\s]*)(?:;|\s|$)/)[1].toLowerCase();
  return this.extensions[type];
};

// Default instance
var mime = new Mime();

// Define built-in types
mime.define(require('./types.json'));

// Default type
mime.default_type = mime.lookup('bin'); // eslint-disable-line camelcase

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
