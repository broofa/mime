class Mime {
  /** @private */
  _types = Object.create(null);
  /** @private */
  _extensions = Object.create(null);

  /**
   * @param {{ [x: string]: string[]; }[]} args of MIME type -> Array[extensions]
   */
  constructor(...args) {
    for (let i = 0, len = args.length; i < len; i++) {
      this.define(args[i]);
    }
  }

  /**
   * Define mimetype -> extension mappings.  Each key is a mime-type that maps
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
   * @param {{ [x: string]: string[]; }} typeMap type definitions
   * @param {Boolean} [force] if true, force overriding of existing definitions
   */
  define(typeMap, force) {
    for (let type in typeMap) {
      let extensions = typeMap[type].map(function(t) {
        return t.toLowerCase();
      });
      type = type.toLowerCase();

      for (let i = 0; i < extensions.length; i++) {
        const ext = extensions[i];

        // '*' prefix = not the preferred type for this extension.  So fixup the
        // extension, and skip it.
        if (ext[0] === '*') {
          continue;
        }

        if (!force && (ext in this._types)) {
          throw new Error(
            'Attempt to change mapping for "' + ext +
            '" extension from "' + this._types[ext] + '" to "' + type +
            '". Pass `force=true` to allow this, otherwise remove "' + ext +
            '" from the list of extensions for "' + type + '".'
          );
        }

        this._types[ext] = type;
      }

      // Use first extension as default
      if (force || !this._extensions[type]) {
        const ext = extensions[0];
        this._extensions[type] = (ext[0] !== '*') ? ext : ext.slice(1);
      }
    }
  }

  /**
   * Lookup a mime type based on extension
   * @param {string} path
   */
  getType(path) {
    path = String(path);
    let last = path.replace(/^.*[/\\]/, '').toLowerCase();
    let ext = last.replace(/^.*\./, '').toLowerCase();

    let hasPath = last.length < path.length;
    let hasDot = ext.length < last.length - 1;

    return (hasDot || !hasPath) && this._types[ext] || null;
  }

  /**
   * Return file extension associated with a mime type
   * @param {string} str
   */
  getExtension(str) {
    const type = /^\s*([^;\s]*)/.test(str) && RegExp.$1;
    return type && this._extensions[type.toLowerCase()] || null;
  }
}

export default Mime;
