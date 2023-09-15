<!--
  -- This file is auto-generated from src/README_js.md. Changes should be made there.
  -->
# Mime

[![NPM downloads](https://img.shields.io/npm/dm/mime)](https://www.npmjs.com/package/mime)
[![Mime CI](https://github.com/broofa/mime/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/broofa/mime/actions/workflows/ci.yml?query=branch%3Amain)

An API for MIME type information.

- All `mime-db` types
- Compact and dependency-free [![mime's badge](https://deno.bundlejs.com/?q=mime&badge)](https://bundlejs.com/?q=mime)
- Full TS support


> **Important**
> `mime@4` is currently in **beta**. Changes include:
> * ESM module support is required.  See the [ESM Module FAQ](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
> * [ES2020](https://caniuse.com/?search=es2020) support is required
> * Typescript types are built-in
>
> To install:  ` npm install mime@beta`
## Install

```bash
npm install mime
```

## Quick Start

For the full version (800+ MIME types, 1,000+ extensions):

```javascript
import mime from 'mime';

mime.getType('txt');                    // ⇨ 'text/plain'
mime.getExtension('text/plain');        // ⇨ 'txt'
```

### Lite Version [![mime/lite's badge](https://deno.bundlejs.com/?q=mime/lite&badge)](https://bundlejs.com/?q=mime/lite)

`mime/lite` is a drop-in `mime` replacement, stripped of unofficial ("`prs.*`", "`x-*`", "`vnd.*`") types:

```javascript
import mime from 'mime/lite';
```

## API

### `mime.getType(pathOrExtension)`

Get mime type for the given file path or extension. E.g.

```javascript
mime.getType('js');             // ⇨ 'application/javascript'
mime.getType('json');           // ⇨ 'application/json'

mime.getType('txt');            // ⇨ 'text/plain'
mime.getType('dir/text.txt');   // ⇨ 'text/plain'
mime.getType('dir\\text.txt');  // ⇨ 'text/plain'
mime.getType('.text.txt');      // ⇨ 'text/plain'
mime.getType('.txt');           // ⇨ 'text/plain'
```

`null` is returned in cases where an extension is not detected or recognized

```javascript
mime.getType('foo/txt');        // ⇨ null
mime.getType('bogus_type');     // ⇨ null
```

### `mime.getExtension(type)`

Get file extension for the given mime type. Charset options (often included in Content-Type headers) are ignored.

```javascript
mime.getExtension('text/plain');               // ⇨ 'txt'
mime.getExtension('application/json');         // ⇨ 'json'
mime.getExtension('text/html; charset=utf8');  // ⇨ 'html'
```

### `mime.getAllExtensions(type)`

> **Note**
> New in `mime@4`

Get all file extensions for the given mime type.

```javascript --run default
mime.getAllExtensions('image/jpeg'); // ⇨ Set(3) { 'jpeg', 'jpg', 'jpe' }
```

## Custom `Mime` instances

The default objects exported by `mime` are immutable by design.  Mutable versions can be created as follows...
### new Mime(type map [, type map, ...])

Create a new, custom mime instance.  For example, to create a mutable version of the default `mime` instance:

```javascript
import { Mime } from 'mime/lite';

import standardTypes from 'mime/types/standard.js';
import otherTypes from 'mime/types/other.js';

const mime = new Mime(standardTypes, otherTypes);
```

Each argument is passed to the `define()` method, below. For example `new Mime(standardTypes, otherTypes)` is synonomous with `new Mime().define(standardTypes).define(otherTypes)`

### `mime.define(type map [, force = false])`

> **Note**
> Only available on custom `Mime` instances

Define MIME type -> extensions.

Attempting to map a type to an already-defined extension will `throw` unless the `force` argument is set to `true`.

```javascript
mime.define({'text/x-abc': ['abc', 'abcd']});

mime.getType('abcd');            // ⇨ 'text/x-abc'
mime.getExtension('text/x-abc')  // ⇨ 'abc'
```

## Command Line

### Extension -> type

    $ mime scripts/jquery.js
    application/javascript

### Type -> extension

    $ npx mime -r image/jpeg
    jpeg

----
Markdown generated from [src/README_js.md](src/README_js.md) by [<img height="13" src="https://camo.githubusercontent.com/5c7c603cd1e6a43370b0a5063d457e0dabb74cf317adc7baba183acb686ee8d0/687474703a2f2f692e696d6775722e636f6d2f634a4b6f3662552e706e67" />](https://github.com/broofa/runmd)
