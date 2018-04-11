'use strict';

/**
 * @param typeMap [Object] Map of MIME type -> Array[extensions]
 * @param ...
 */
module.exports = function Mime() {
  var _types = Object.create(null);
  var _extensions = Object.create(null);

  for (var i = 0; i < arguments.length; i++) {
    define(arguments[i]);
  }

  /**
   * Define mimetype -> xtension mappings.  Each key is a mime-type that maps
   * to an array of extensions associated with the type.  The first extension is
   * used as the default extension for the type.
   *
   * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
   *
   * If a type declares an extension that has already been defined, an error will
   * be thrown.  To suppress this error and force the extension to be associated
   * with the new type, pass `force`=true.  Alternatively, you may prefix the
   * extension with "*" to map the type to extension, without mapping the
   * extension to the type.
   *
   * e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});
   *
   *
   * @param map (Object) type definitions
   * @param force (Boolean) if true, force overriding of existing definitions
   */
  function define(typeMap, force) {
    for (var type in typeMap) {
      var extensions = typeMap[type];
      for (var i = 0; i < extensions.length; i++) {
        var ext = extensions[i];

        // '*' prefix = not the preferred type for this extension.  So fixup the
        // extension, and skip it.
        if (ext[0] == '*') {
          continue;
        }

        if (!force && _types[ext] !== undefined) {
          throw new Error(
            'Attempt to change mapping for "' + ext +
            '" extension from "' + _types[ext] + '" to "' + type +
            '". Pass `force=true` to allow this, otherwise remove "' + ext +
            '" from the list of extensions for "' + type + '".'
          );
        }

        _types[ext] = type;
      }

      // Use first extension as default
      if (force || !_extensions[type]) {
        var ext = extensions[0];
        _extensions[type] = (ext[0] !== '*') ? ext : ext.slice(1)
      }
    }
  }

  /**
   * Lookup a mime type based on extension
   */
  function getType(path) {
    path = String(path);
    var last = path.replace(/^.*[/\\]/, '').toLowerCase();
    var ext = last.replace(/^.*\./, '').toLowerCase();

    var hasPath = last.length < path.length;
    var hasDot = ext.length < last.length - 1;

    return (hasDot || !hasPath) && _types[ext] || null;
  }

  /**
   * Return file extension associated with a mime type
   */
  function getExtension(type) {
    type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
    return type && _extensions[type.toLowerCase()] || null;
  }

  return {
    define: define,
    getType: getType,
    getExtension: getExtension,
    _types: _types,
    _extensions: _extensions
  };
};
