var path = require('path');

/* Functions for translating file extensions into mime types
 *
 * based on simonw's djangode: http://github.com/simonw/djangode
 * with extensions/mimetypes added from felixge's 
 *   node-paperboy: http://github.com/felixge/node-paperboy
 */
exports.lookup = function(filename, fallback) {
  // the path library's extname function won't return an extension if the
  // entire string IS the extesion, so we check for that case
  if (filename.charAt(0) === '.' && filename.substr(1).indexOf('.') < 0) {
    var ext = filename.substr(1);
  }
  // either the string doesn't have an extension or it is the extension, we
  // assume the latter.  Most of the time we're right.
  else if (filename.indexOf('.') < 0) {
    var ext = filename;
  }
  // simple lookup
  else {
    var ext = path.extname(filename).substr(1);
  }

  ext = ext.toLowerCase();

  return exports.types[ext] || fallback || exports.default_type;
};

exports.default_type = 'application/octet-stream';

exports.types =
  { "3gp"     : "video/3gpp"
  , "a"       : "application/octet-stream"
  , "ai"      : "application/postscript"
  , "aif"     : "audio/x-aiff"
  , "aiff"    : "audio/x-aiff"
  , "arj"     : "application/x-arj-compressed"
  , "asc"     : "application/pgp-signature"
  , "asf"     : "video/x-ms-asf"
  , "asm"     : "text/x-asm"
  , "asx"     : "video/x-ms-asf"
  , "atom"    : "application/atom+xml"
  , "au"      : "audio/basic"
  , "avi"     : "video/x-msvideo"
  , "bat"     : "application/x-msdownload"
  , "bcpio"   : "application/x-bcpio"
  , "bin"     : "application/octet-stream"
  , "bmp"     : "image/bmp"
  , "bz2"     : "application/x-bzip2"
  , "c"       : "text/x-c"
  , "cab"     : "application/vnd.ms-cab-compressed"
  , "cc"      : "text/x-c"
  , "ccad"    : "application/clariscad"
  , "chm"     : "application/vnd.ms-htmlhelp"
  , "class"   : "application/octet-stream"
  , "cod"     : "application/vnd.rim.cod"
  , "com"     : "application/x-msdownload"
  , "conf"    : "text/plain"
  , "cpio"    : "application/x-cpio"
  , "cpp"     : "text/x-c"
  , "cpt"     : "application/mac-compactpro"
  , "crt"     : "application/x-x509-ca-cert"
  , "csh"     : "application/x-csh"
  , "css"     : "text/css"
  , "csv"     : "text/csv"
  , "cxx"     : "text/x-c"
  , "deb"     : "application/x-debian-package"
  , "der"     : "application/x-x509-ca-cert"
  , "diff"    : "text/x-diff"
  , "djv"     : "image/vnd.djvu"
  , "djvu"    : "image/vnd.djvu"
  , "dl"      : "video/dl"
  , "dll"     : "application/x-msdownload"
  , "dmg"     : "application/octet-stream"
  , "doc"     : "application/msword"
  , "dot"     : "application/msword"
  , "drw"     : "application/drafting"
  , "dtd"     : "application/xml-dtd"
  , "dvi"     : "application/x-dvi"
  , "dwg"     : "application/acad"
  , "dxf"     : "application/dxf"
  , "dxr"     : "application/x-director"
  , "ear"     : "application/java-archive"
  , "eml"     : "message/rfc822"
  , "eps"     : "application/postscript"
  , "etx"     : "text/x-setext"
  , "exe"     : "application/x-msdownload"
  , "ez"      : "application/andrew-inset"
  , "f"       : "text/x-fortran"
  , "f77"     : "text/x-fortran"
  , "f90"     : "text/x-fortran"
  , "fli"     : "video/x-fli"
  , "flv"     : "video/x-flv"
  , "flv"     : "video/x-flv"
  , "for"     : "text/x-fortran"
  , "gem"     : "application/octet-stream"
  , "gemspec" : "text/x-script.ruby"
  , "gif"     : "image/gif"
  , "gl"      : "video/gl"
  , "gtar"    : "application/x-gtar"
  , "gz"      : "application/x-gzip"
  , "h"       : "text/x-c"
  , "hdf"     : "application/x-hdf"
  , "hh"      : "text/x-c"
  , "hqx"     : "application/mac-binhex40"
  , "htm"     : "text/html"
  , "html"    : "text/html"
  , "ice"     : "x-conference/x-cooltalk"
  , "ico"     : "image/vnd.microsoft.icon"
  , "ics"     : "text/calendar"
  , "ief"     : "image/ief"
  , "ifb"     : "text/calendar"
  , "igs"     : "model/iges"
  , "ips"     : "application/x-ipscript"
  , "ipx"     : "application/x-ipix"
  , "iso"     : "application/octet-stream"
  , "jad"     : "text/vnd.sun.j2me.app-descriptor"
  , "jar"     : "application/java-archive"
  , "java"    : "text/x-java-source"
  , "jnlp"    : "application/x-java-jnlp-file"
  , "jpeg"    : "image/jpeg"
  , "jpg"     : "image/jpeg"
  , "js"      : "application/javascript"
  , "json"    : "application/json"
  , "latex"   : "application/x-latex"
  , "log"     : "text/plain"
  , "lsp"     : "application/x-lisp"
  , "lzh"     : "application/octet-stream"
  , "m"       : "text/plain"
  , "m3u"     : "audio/x-mpegurl"
  , "m4v"     : "video/mp4"
  , "man"     : "text/troff"
  , "mathml"  : "application/mathml+xml"
  , "mbox"    : "application/mbox"
  , "mdoc"    : "text/troff"
  , "me"      : "text/troff"
  , "me"      : "application/x-troff-me"
  , "mid"     : "audio/midi"
  , "midi"    : "audio/midi"
  , "mif"     : "application/x-mif"
  , "mime"    : "www/mime"
  , "mml"     : "application/mathml+xml"
  , "mng"     : "video/x-mng"
  , "mov"     : "video/quicktime"
  , "movie"   : "video/x-sgi-movie"
  , "mp3"     : "audio/mpeg"
  , "mp4"     : "video/mp4"
  , "mp4v"    : "video/mp4"
  , "mpeg"    : "video/mpeg"
  , "mpg"     : "video/mpeg"
  , "mpga"    : "audio/mpeg"
  , "ms"      : "text/troff"
  , "msi"     : "application/x-msdownload"
  , "nc"      : "application/x-netcdf"
  , "oda"     : "application/oda"
  , "odp"     : "application/vnd.oasis.opendocument.presentation"
  , "ods"     : "application/vnd.oasis.opendocument.spreadsheet"
  , "odt"     : "application/vnd.oasis.opendocument.text"
  , "ogg"     : "application/ogg"
  , "ogm"     : "application/ogg"
  , "p"       : "text/x-pascal"
  , "pas"     : "text/x-pascal"
  , "pbm"     : "image/x-portable-bitmap"
  , "pdf"     : "application/pdf"
  , "pem"     : "application/x-x509-ca-cert"
  , "pgm"     : "image/x-portable-graymap"
  , "pgn"     : "application/x-chess-pgn"
  , "pgp"     : "application/pgp"
  , "pkg"     : "application/octet-stream"
  , "pl"      : "text/x-script.perl"
  , "pm"      : "application/x-perl"
  , "png"     : "image/png"
  , "pnm"     : "image/x-portable-anymap"
  , "ppm"     : "image/x-portable-pixmap"
  , "pps"     : "application/vnd.ms-powerpoint"
  , "ppt"     : "application/vnd.ms-powerpoint"
  , "ppz"     : "application/vnd.ms-powerpoint"
  , "pre"     : "application/x-freelance"
  , "prt"     : "application/pro_eng"
  , "ps"      : "application/postscript"
  , "psd"     : "image/vnd.adobe.photoshop"
  , "py"      : "text/x-script.python"
  , "qt"      : "video/quicktime"
  , "ra"      : "audio/x-realaudio"
  , "rake"    : "text/x-script.ruby"
  , "ram"     : "audio/x-pn-realaudio"
  , "rar"     : "application/x-rar-compressed"
  , "ras"     : "image/x-cmu-raster"
  , "rb"      : "text/x-script.ruby"
  , "rdf"     : "application/rdf+xml"
  , "rgb"     : "image/x-rgb"
  , "rm"      : "audio/x-pn-realaudio"
  , "roff"    : "text/troff"
  , "rpm"     : "application/x-redhat-package-manager"
  , "rpm"     : "audio/x-pn-realaudio-plugin"
  , "rss"     : "application/rss+xml"
  , "rtf"     : "text/rtf"
  , "rtx"     : "text/richtext"
  , "ru"      : "text/x-script.ruby"
  , "s"       : "text/x-asm"
  , "scm"     : "application/x-lotusscreencam"
  , "set"     : "application/set"
  , "sgm"     : "text/sgml"
  , "sgml"    : "text/sgml"
  , "sh"      : "application/x-sh"
  , "shar"    : "application/x-shar"
  , "sig"     : "application/pgp-signature"
  , "silo"    : "model/mesh"
  , "sit"     : "application/x-stuffit"
  , "skt"     : "application/x-koan"
  , "smil"    : "application/smil"
  , "snd"     : "audio/basic"
  , "so"      : "application/octet-stream"
  , "sol"     : "application/solids"
  , "spl"     : "application/x-futuresplash"
  , "src"     : "application/x-wais-source"
  , "stl"     : "application/SLA"
  , "stp"     : "application/STEP"
  , "sv4cpio" : "application/x-sv4cpio"
  , "sv4crc"  : "application/x-sv4crc"
  , "svg"     : "image/svg+xml"
  , "svgz"    : "image/svg+xml"
  , "swf"     : "application/x-shockwave-flash"
  , "t"       : "text/troff"
  , "tar"     : "application/x-tar"
  , "tbz"     : "application/x-bzip-compressed-tar"
  , "tcl"     : "application/x-tcl"
  , "tex"     : "application/x-tex"
  , "texi"    : "application/x-texinfo"
  , "texinfo" : "application/x-texinfo"
  , "text"    : "text/plain"
  , "tgz"     : "application/x-tar-gz"
  , "tif"     : "image/tiff"
  , "tiff"    : "image/tiff"
  , "torrent" : "application/x-bittorrent"
  , "tr"      : "text/troff"
  , "tsi"     : "audio/TSP-audio"
  , "tsp"     : "application/dsptype"
  , "tsv"     : "text/tab-separated-values"
  , "txt"     : "text/plain"
  , "unv"     : "application/i-deas"
  , "ustar"   : "application/x-ustar"
  , "vcd"     : "application/x-cdlink"
  , "vcf"     : "text/x-vcard"
  , "vcs"     : "text/x-vcalendar"
  , "vda"     : "application/vda"
  , "vivo"    : "video/vnd.vivo"
  , "vrm"     : "x-world/x-vrml"
  , "vrml"    : "model/vrml"
  , "war"     : "application/java-archive"
  , "wav"     : "audio/x-wav"
  , "wax"     : "audio/x-ms-wax"
  , "wma"     : "audio/x-ms-wma"
  , "wmv"     : "video/x-ms-wmv"
  , "wmx"     : "video/x-ms-wmx"
  , "wrl"     : "model/vrml"
  , "wsdl"    : "application/wsdl+xml"
  , "wvx"     : "video/x-ms-wvx"
  , "xbm"     : "image/x-xbitmap"
  , "xhtml"   : "application/xhtml+xml"
  , "xls"     : "application/vnd.ms-excel"
  , "xlw"     : "application/vnd.ms-excel"
  , "xml"     : "application/xml"
  , "xpm"     : "image/x-xpixmap"
  , "xsl"     : "application/xml"
  , "xslt"    : "application/xslt+xml"
  , "xwd"     : "image/x-xwindowdump"
  , "xyz"     : "chemical/x-pdb"
  , "yaml"    : "text/yaml"
  , "yml"     : "text/yaml"
  , "zip"     : "application/zip"
  };

var charsets = exports.charsets = {
  lookup: function(mimetype, fallback) {
    return charsets.sets[mimetype] || fallback;
  },

  sets: {
    "text/calendar": "UTF-8",
    "text/css": "UTF-8",
    "text/csv": "UTF-8",
    "text/html": "UTF-8",
    "text/plain": "UTF-8",
    "text/rtf": "UTF-8",
    "text/richtext": "UTF-8",
    "text/sgml": "UTF-8",
    "text/tab-separated-values": "UTF-8",
    "text/troff": "UTF-8",
    "text/x-asm": "UTF-8",
    "text/x-c": "UTF-8",
    "text/x-diff": "UTF-8",
    "text/x-fortran": "UTF-8",
    "text/x-java-source": "UTF-8",
    "text/x-pascal": "UTF-8",
    "text/x-script.perl": "UTF-8",
    "text/x-script.perl-module": "UTF-8",
    "text/x-script.python": "UTF-8",
    "text/x-script.ruby": "UTF-8",
    "text/x-setext": "UTF-8",
    "text/vnd.sun.j2me.app-descriptor": "UTF-8",
    "text/x-vcalendar": "UTF-8",
    "text/x-vcard": "UTF-8",
    "text/yaml": "UTF-8"
  }
};

