type TypeMap = { [key: string]: string[] };

export default class Mime {
  #types = new Map<string, string>();
  #extensions = new Map<string, string>();

  constructor(...args: TypeMap[]) {
    for (const arg of args) {
      this.define(arg);
    }
  }

  /**
   * Define mimetype -> extension mappings.  Each key is a mime-type that maps
   * to an array of extensions associated with the type.  The first extension is
   * used as the default extension for the type.
   *
   * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
   *
   * If a mapping for an extension has already been defined an error will be
   * thrown unless the `force` argument is set to `true`.  Alternatively,
   * extensions maybe prefixed with a "*" to map the type to the extension
   * without mapping the extension to the type.
   *
   * e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});
   */
  define(typeMap: TypeMap, force = false) {
    for (let [userType, userExtensions] of Object.entries(typeMap)) {
      // lowercase-ify
      userExtensions = userExtensions.map((t) => t.toLowerCase());
      userType = userType.toLowerCase();

      for (const ext of userExtensions) {
        // '*' prefix = not the preferred type for this extension.  So fixup the
        // extension, and skip it.
        if (ext.startsWith('*')) continue;

        if (!force && this.#types.has(ext)) {
          throw new Error(
            `"${ext}" extension already maps to "${this.#types.get(
              ext,
            )}". Pass \`force=true\` to override this setting, otherwise remove "${ext}" from the list of extensions for "${userType}".`,
          );
        }

        this.#types.set(ext, userType);
      }

      // Use first extension as default
      if (force || !this.#extensions.has(userType)) {
        const ext = userExtensions[0];
        this.#extensions.set(userType, ext[0] !== '*' ? ext : ext.slice(1));
      }
    }

    return this;
  }

  /**
   * Lookup a mime type based on extension
   */
  getType(path: string) {
    path = String(path);
    // Remove chars preceeding `/` or `\`
    const last = path.replace(/^.*[/\\]/, '').toLowerCase();

    // Remove chars preceeding '.'
    const ext = last.replace(/^.*\./, '').toLowerCase();

    const hasPath = last.length < path.length;
    const hasDot = ext.length < last.length - 1;

    // Extension-less file?
    if (!hasDot && hasPath) return null;

    return this.#types.get(ext) ?? null;
  }

  /**
   * Return file extension associated with a mime type
   */
  getExtension(type: string) {
    // Remove http header parameter(s) (specifically, charset)
    type = type?.split?.(';')[0];

    return (type && this.#extensions.get(type.trim().toLowerCase())) ?? null;
  }

  //
  // INTERNAL USE ONLY
  //

  _freeze() {
    this.define = () => {
      throw new Error('mime.define() is not allowed on default Mime objects.');
    };
    Object.freeze(this);

    return this;
  }

  _getTestState() {
    return {
      types: this.#types,
      extensions: this.#extensions,
    };
  }
}
