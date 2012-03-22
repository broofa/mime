var path = require('path');
var fs = require('fs');

var mime = module.exports = {
  
  /**
   * Map of extension to mime type
   * @type {Object}
   */
  types: Object.create( null ),
  
  /**
   * Map of mime type to extension
   * @type {Object}
   */
  extensions: Object.create( null ),
  
  /**
   * Define mimetype -> extension mappings. Each key is a mime-type that maps
   * to an array of extensions associated with the type. The first extension is
   * used as the default extension for the type.
   * 
   * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
   * 
   * @param  {Object} map type definitions
   * @return {Null}   
   */
  define: function( map ) {
    
    var i, type, length, exts;
    
    for ( type in map ) {
      
      exts = map[ type ];
      length = exts.length
      i = 0;
      
      for ( ; i < length; i++ ) {
        this.types[ exts[i] ] = type;
      }
      
      // Default extension is the first one we encounter
      if ( !this.extensions[ type ] ) {
        this.extensions[ type ] = exts[ 0 ];
      }
      
    }
    
  },
  
  /**
   * Load an Apache2-style ".types" file
   * 
   * This may be called multiple times (it's expected).  Where files declare
   * overlapping types/extensions, the last file wins.
   * 
   * @param  {String} file path to load.
   * @return {Null}   
   */
  load: function( file ) {
    
    var i, length, fields, map = {};
    
    // Read file and split into lines
    var content = fs.readFileSync( file, 'ascii' );
    var lines   = content.split( /(\r?\n)+/ );
    
    for( i = 0, length = lines.length; i < length; i++ ) {
      // Clean up whitespace/comments and split into fields
      fields = lines[i].replace( /\s*#.*|^\s*|\s*$/g, '' );
      fields = fields.split( /\s+/ );
      map[ fields.shift() ] = fields;
    }
    
    this.define( map );
    
  },
  
  /**
   * Lookup a mime type based on extension
   * 
   * @param  {String} path     
   * @param  {String} fallback 
   * @return {String}          
   */
  lookup: function( path, fallback ) {
    var ext = path.replace( /.*[\.\/]/, '' ).toLowerCase();
    return mime.types[ ext ] || fallback || mime.default_type;
  },
  
  /**
   * Return file extension associated with a mime type
   * 
   * @param  {String} mimeType 
   * @return {String}          
   */
  extension: function( mimeType ) {
    return mime.extensions[ mimeType ];
  },
  
  /**
   * Charset lookup function(s).
   * @type {Object}
   */
  charsets: {
    
    /**
     * Lookup a charset based on mime type.
     * 
     * @param  {String} mimeType 
     * @param  {String} fallback 
     * @return {String}          
     */
    lookup: function( mimeType, fallback ) {
      // Assume text types are utf8. Modify mime logic as needed.
      return /^text\//.test( mimeType ) ? 'UTF-8' : fallback;
    }
    
  }
  
};

// Load our local copy of
// http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
mime.load( path.join( __dirname, 'types/mime.types' ) );

// Overlay enhancements submitted by the node.js community
mime.load( path.join( __dirname, 'types/node.types' ) );

// Set the default type
mime.default_type = mime.types.bin;
