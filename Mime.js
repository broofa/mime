'use strict';

/**
 * @param typeMap [Object] Map of MIME type -> Array[extensions]
 * @param ...
 */
class Mime {
  constructor() {
    this._types = Object.create(null);
    this._extensions = Object.create(null);

    for (var i = 0; i < arguments.length; i++) {
      this.define(arguments[i]);
    }
  }

  /**
   * Define mimetype -> xtension mappings.  Each key is a mime-type that maps
   * to an array of extensions associated with the type.  The first extension is
   * used as the default extension for the type.
   *
   * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
   *
   * @param map (Object) type definitions
   */
  define(typeMap, force) {
    for (let type in typeMap) {
      var extensions = typeMap[type];
      for (let i = 0; i < extensions.length; i++) {
        var ext = extensions[i];
        if (!force && (ext in this._types)) {
          throw new Error(`Attempt to change mapping for "${ext}" extension from "${this._types[ext]}" to "${type}". Pass \`force=true\` to allow this, otherwise remove "${ext}" from the list of extensions for "${type}".`);
        }

        this._types[ext] = type;
      }

      // Use first extension as default
      if (force || !this._extensions[type]) {
        this._extensions[type] = extensions[0];
      }
    }
  }

  /**
   * Lookup a mime type based on extension
   */
  getType(path) {
    path = String(path);
    var last = path.replace(/.*[/\\]/, '').toLowerCase();
    var ext = last.replace(/.*\./, '').toLowerCase();

    var hasPath = last.length < path.length;
    var hasDot = ext.length < last.length - 1;

    return (hasDot || !hasPath) && this._types[ext] || null;
  }

  /**
   * Return file extension associated with a mime type
   */
  getExtension(type) {
    type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
    return type && this._extensions[type.toLowerCase()] || null;
  }
}

module.exports = Mime;
