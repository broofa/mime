# mime
An opinionated and compact mime API

## Requirements
CommonJS & ES6

Using something else?  Install the old version via `npm install mime@1.3.6`

## Install
```
npm install mime
```

## Usage
```
// Get a Mime object pre-loaded with all 900+ types in mime-db
const mime = require('mime');

// ... or, for a more compact set of mappings
const mime = require('mime/lite') ; // Omits vendor and experimental types

// ... or roll your own
const Mime = require('mime/Mime');
const mime = new Mime({
  'text/plain': ['txt', 'text', 'conf', 'def', 'list', 'log', 'in', 'ini'],
  'text/html': ['html', 'htm', 'shtml'],
  // etc...
});
```

## Mime API

### new Mime(extensions_by_type)

### mime.types[*extension*]
Note: On ES6 systems this object will be Read-only

### mime.extensions[*type*]
Note: On ES6 systems this object will be Read-only

### mime.typeForPath(*path*)
Shortcut for `mime.types[mime.extname(extension_or_path)]`
NOTE: If

### mime.extname(path)
Get extension of a file name or path. Similar to NodeJS' `path.extname`, but slightly different. E.g.
```
mime.extname(''); // => null
mime.extname('abc'); // => null
mime.extname('.abc'); // => 'abc'
mime.extname('hello.abc'); // => 'abc'
mime.extname('hello/world.abc'); // => 'abc'
mime.extname('hello\\world.abc'); // => 'abc'
mime.extname('coder/says.what/hello\\world.abc'); // => 'abc'
```


/\.([^\/\\]+$)/.test('a.b\/gef.abc') && RegExp.$1

E.g.
```
```

Note: This behavior is different from legacy `mime.lookup()` behavior. Passing
a bare extension will result in `null`.


### mime.charset(type)

## Command Line
```
mime [path_string]

> mime scripts/jquery.js
application/javascript
```


============================ ============================ ============================
============================ ============================ ============================
============================ ============================ ============================
============================ ============================ ============================
============================ ============================ ============================
============================ ============================ ============================
============================ ============================ ============================
============================ ============================ ============================


## API - Queries

### mime.lookup(path)
Get the mime type associated with a file, if no mime type is found `application/octet-stream` is returned. Performs a case-insensitive lookup using the extension in `path` (the substring after the last '/' or '.').  E.g.

```js
var mime = require('mime');

mime.lookup('/path/to/file.txt');         // => 'text/plain'
mime.lookup('file.txt');                  // => 'text/plain'
mime.lookup('.TXT');                      // => 'text/plain'
mime.lookup('htm');                       // => 'text/html'
```

### mime.default_type
Sets the mime type returned when `mime.lookup` fails to find the extension searched for. (Default is `application/octet-stream`.)

### mime.extension(type)
Get the default extension for `type`

```js
mime.extension('text/html');                 // => 'html'
mime.extension('application/octet-stream');  // => 'bin'
```

### mime.charsets.lookup()
de

Map mime-type to charset

```js
mime.charsets.lookup('text/plain');        // => 'UTF-8'
```

(The logic for charset lookups is pretty rudimentary.  Feel free to suggest improvements.)

## API - Defining Custom Types

Custom type mappings can be added on a per-project basis via the following APIs.

### mime.define()

Add custom mime/extension mappings

```js
mime.define({
    'text/x-some-format': ['x-sf', 'x-sft', 'x-sfml'],
    'application/x-my-type': ['x-mt', 'x-mtt'],
    // etc ...
});

mime.lookup('x-sft');                 // => 'text/x-some-format'
```

The first entry in the extensions array is returned by `mime.extension()`. E.g.

```js
mime.extension('text/x-some-format'); // => 'x-sf'
```

### mime.load(filepath)

Load mappings from an Apache ".types" format file

```js
mime.load('./my_project.types');
```
The .types file format is simple -  See the `types` dir for examples.
