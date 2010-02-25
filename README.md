A library for doing simple mime-type lookups.

    var mime = require('mime');

    // all these return 'text/plain'
    mime.lookup('/path/to/file.txt');
    mime.lookup('file.txt');
    mime.lookup('.txt');

It can also look up common charsets for specific mime-types. (Useful in a web
framework):

    var mime = require('mime');

    // returns 'UTF-8'
    mime.charset.lookup('text/plain');

Please help me make sure my lookup tables are complete!  Any additions will be
appreciatively merged!
