# mime

A comprehensive library for mime-type mapping

## Install

Install with [npm](http://github.com/isaacs/npm):

    npm install mime

## API

### mime.lookup(path) - map file/extension to mime-type

    var mime = require('mime');

    mime.lookup('/path/to/file.txt');         // => 'text/plain'
    mime.lookup('file.txt');                  // => 'text/plain'
    mime.lookup('.txt');                      // => 'text/plain'
    mime.lookup('htm');                       // => 'text/html'

### mime.extension(type) - map mime-type to extension

    mime.extension('text/html');                 // => 'html'
    mime.extension('application/octet-stream');  // => 'bin'

### mime.charsets.lookup() - map mime-type to charset

    mime.charsets.lookup('text/plain');        // => 'UTF-8'

(The logic for charset lookup is pretty rudimentary.  Feel free to suggest improvements.)

## "Can you add support for [some type/extension]?"

Support for new types is handled thusly:

  * For types where there's no obvious need outside your project, use mime.define() or mime.load() to add support in your code.
  * For types where there's an obvious need w/in the node.js community, we'll add support here (in the node.types file)
  * For types that affect the software community as a whole - e.g. a new type approved by [IANA](http://www.iana.org/assignments/media-types/) - file a [bug with Apache](http://httpd.apache.org/bug_report.html) and create an issue here that links to it.

If you're unsure or disagree with what we suggest here, feel free to open an issue and we'll figure it out there. :-)

### mime.define() - Add custom mime/extension mappings

    mime.define({
        'text/x-some-format': ['x-sf', 'x-sft', 'x-sfml'],
        'application/x-my-type': ['x-mt', 'x-mtt'],
        // etc ...
    });

    mime.lookup('x-sft');                 // => 'text/x-some-format'
    mime.extension('text/x-some-format'); // => 'x-sf'

### mime.load(filepath) - Load mappings from an Apache ".types" format file

    mime.load('./my_project.types');
