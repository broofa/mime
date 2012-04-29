var path  = require('path');
var fs    = require('fs');


// leaves only extension from the given string
//   normalize('foo/bar.js')  // -> '.js'
//   normalize('bar.js')      // -> '.js'
//   normalize('.js')         // -> '.js'
//   normalize('js')          // -> '.js'
function normalize(extension) {
  extension = 'prefix.' + path.basename(extension);
  return path.extname(extension).toLowerCase();
}


function Mime(options) {
  // Map of extension to mime type
  this.types = Object.create(null);

  // Map of mime type -> extension
  this.extensions = Object.create(null);

  if ('string' === typeof options) {
    this.normalize    = normalize;
    this.default_type = options;
  } else {
    this.normalize    = options.normalize || normalize;
    this.default_type = options.defaultType;
  }
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
  var self = this;

  Object.getOwnPropertyNames(map).forEach(function (type) {
    var exts = map[type];

    // skip empty types, and types without extensions
    if (!type || !exts || 0 === exts.length) {
      return;
    }

    exts.forEach(function (ext) {
      self.types[self.normalize(ext)] = type;
    });

    // Default extension is the first one we encounter
    if (!self.extensions[type]) {
      self.extensions[type] = self.normalize(exts[0]);
    }
  });
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
};

/**
 * Lookup a mime type based on extension
 */
Mime.prototype.lookup = function(path, fallback) {
  return this.types[this.normalize(path)] || fallback || this.default_type;
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.extension = function(mimeType) {
  return this.extensions[mimeType];
};


// Default instance
var mime = new Mime({
  defaultType: 'application/octet-stream',
  normalize:   function (ext) {
    // backward-compatible normalizer
    return ext.replace(/.*[\.\/]/, '').toLowerCase();
  }
});


// Load local copy of
// http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
mime.load(path.join(__dirname, 'types/mime.types'));

// Load additional types from node.js community
mime.load(path.join(__dirname, 'types/node.types'));


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
