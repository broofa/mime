A library for doing simple mime-type lookups.

    var mime = require('mime');

    mime.lookup('/path/to/file.txt');         // => 'text/plain'
    mime.lookup('file.txt');                  // => 'text/plain'
    mime.lookup('.txt');                      // => 'text/plain'
    mime.lookup('htm');                       // => 'text/html'

... and extension lookups by mime-type

    mime.extension('text/html');                 // => 'html'
    mime.extension('application/octet-stream');  // => 'bin'

It also includes rudimentary logic for determining charsets. (Useful in a web
framework):

    mime.charset.lookup('text/plain');        // => 'UTF-8'

Install with [npm](http://github.com/isaacs/npm):

    npm install mime
