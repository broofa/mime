class Mime {
  constructor(...typeMaps) {
    this._types = Object.create(null);
    this._extensions = Object.create(null);
    typeMaps.forEach(map => this.define(map));

    // Deprecated API
    this.lookup = this.getType;
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
      const extensions = typeMap[type];
      for (let i = 0; i < extensions.length; i++) {
        const ext = extensions[i];
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
    const last = path.replace(/.*[\/\\]/, '').toLowerCase();
    const ext = last.replace(/.*\./, '').toLowerCase();

    const hasPath = last.length < path.length;
    const hasDot = ext.length < last.length - 1;

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
