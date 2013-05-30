var fs = require('fs')
/**
 * Load an Apache2-style ".types" file
 *
 * This may be called multiple times (it's expected).  Where files declare
 * overlapping types/extensions, the last file wins.
 *
 * @param file (String) path of file to load.
 */

var map = {}

function load(file) {

  // Read file and split into lines
  var content = fs.readFileSync(file, 'ascii'),
      lines = content.split(/[\r\n]+/);

  lines.forEach(function(line) {
    // Clean up whitespace/comments, and split into fields
    var fields = line.replace(/\s*#.*|^\s*|\s*$/g, '').split(/\s+/);
    var type = fields.shift()
    map[type] = (map[type] || []).concat(fields);
  });

};

process.argv.slice(2).forEach(load)

console.log(JSON.stringify(map, null, 2))

