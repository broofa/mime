var Mime = require('./lib/mime');
var fs = require('fs');
var mime = new Mime();
var map = {};

process.argv.slice(2).forEach(function(file) {
  mime.parse(fs.readFileSync(file, 'ascii'), map);
});

console.log(JSON.stringify(map, null, 2));
