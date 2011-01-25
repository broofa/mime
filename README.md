# mime

A comprehensive library for mime-type mapping

## Install

Install with [npm](http://github.com/isaacs/npm):

    npm install mime

## Usage

### Mapping file/extension to mime-type

    var mime = require('mime');

    mime.lookup('/path/to/file.txt');         // => 'text/plain'
    mime.lookup('file.txt');                  // => 'text/plain'
    mime.lookup('.txt');                      // => 'text/plain'
    mime.lookup('htm');                       // => 'text/html'

### Mapping mime-type to extension

    mime.extension('text/html');                 // => 'html'
    mime.extension('application/octet-stream');  // => 'bin'

### Determining charsets

    mime.charsets.lookup('text/plain');        // => 'UTF-8'

(The logic for charset lookup is pretty rudimentary.  Feel free to suggest improvements.)

## "Can you add support for [some type/extension]?"

Does anyone outside your project/team _actually_ care about it?  If not, consider using the mime.load() or mime.define() APIs, below, to declare your types w/in your project.

... if so, does anyone outside the node.js community care about it?  If not, then please file a bug here listing the modules and projects that would benefit.  If it makes sense, the type can be added as part of the node.types file.

... finally, if it's something that affects the broader community, please file a bug with the Apache project to amend their mime.types file, and create a bug here linking to the Apache bug.

### mime.define()

mime.define() takes a map of mime-type to extensions:

    mime.define({
        'text/x-some-format': ['x-sf', 'x-sft', 'x-sfml'],
        'application/x-my-type': ['x-mt', 'x-mtt'],
        // etc ...
    });

    mime.lookup('x-sft');                 // => 'text/x-some-format'
    mime.extension('text/x-some-format'); // => 'x-sf'

### mime.define()

mime.load() can be used to load any Apache-format .types file:

    mime.load('./my_project.types');
