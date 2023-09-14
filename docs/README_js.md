```javascript --hide
runmd.onRequire = (path) => path.replace(/^mime/, '../dist/src/index.js');
```

# Mime

A comprehensive, compact MIME type module.

[![Mime CI](https://github.com/broofa/mime/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/broofa/mime/actions/workflows/ci.yml?query=branch%3Amain)
[![NPM version](https://img.shields.io/npm/v/mime)](https://www.npmjs.com/package/mime)
[![NPM downloads](https://img.shields.io/npm/dm/mime)](https://www.npmjs.com/package/mime)

> **Important**
> `mime@4` is currently in **beta**. To install:
> ```bash
> npm install mime@beta
> ```
>
> Starting with `mime@4`:
> * ESM module support is required.  See the [ESM Module FAQ](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).  If you need CommonJS support (e.g. `require('mime')`), use `mime@3`.
> * [ES2020](https://caniuse.com/?search=es2020) support is required
> * Typescript types are built-in.  (`@types/mime` is no longer needed)
>
> See [CHANGELOG.md](https://github.com/broofa/mime/blob/main/CHANGELOG.md) for further details

## Install

```bash
npm install mime
```

## Quick Start

For the full version (800+ MIME types, 1,000+ extensions):

```javascript --run default
import mime from 'mime';

mime.getType('txt'); // RESULT
mime.getExtension('text/plain'); // RESULT
```

See [Mime API](#mime-api) below for API details.

### Lite Version

The "lite" version of this module omits vendor-specific (`*/vnd.*`) and experimental (`*/x-*`) types. It weighs in at ~2.5KB, compared to 8KB for the full version. To load the lite version:

```javascript
import mime from 'mime/lite';
```

## Mime .vs. mime-types .vs. mime-db modules

For those of you wondering about the difference between these [popular] NPM modules,
here's a brief rundown ...

[`mime-db`](https://github.com/jshttp/mime-db) is "the source of
truth" for MIME type information. It is a dataset (JSON file), not an API, with mime type definitions pulled from a variety of authoritative sources.

[`mime-types`](https://github.com/jshttp/mime-types) is a thin
wrapper around mime-db that provides an API that is mostly-compatible with `mime @ < v1.3.6`.

`mime` (this project) is like `mime-types`, but with the following enhancements:

- Resolves type conflicts (See [mime-score](https://github.com/broofa/mime-score) for details)
- Smaller (`mime` is 2-8KB, `mime-types` is 18KB)
- Zero dependencies
- Built-in TS support

## API

### `mime.getType(pathOrExtension)`

Get mime type for the given file path or extension. E.g.

```javascript --run default
mime.getType('js'); // RESULT
mime.getType('json'); // RESULT

mime.getType('txt'); // RESULT
mime.getType('dir/text.txt'); // RESULT
mime.getType('dir\\text.txt'); // RESULT
mime.getType('.text.txt'); // RESULT
mime.getType('.txt'); // RESULT
```

`null` is returned in cases where an extension is not detected or recognized

```javascript --run default
mime.getType('foo/txt'); // RESULT
mime.getType('bogus_type'); // RESULT
```

### `mime.getExtension(type)`

Get file extension for the given mime type. Charset options (often included in Content-Type headers) are ignored.

```javascript --run default
mime.getExtension('text/plain'); // RESULT
mime.getExtension('application/json'); // RESULT
mime.getExtension('text/html; charset=utf8'); // RESULT
```

### `mime.getAllExtensions(type)`

> **Note**
> New in `mime@4`

Get all file extensions for the given mime type.

```javascript --run default
mime.getAllExtensions('text/plain'); // RESULT
```

## Custom `Mime` instances


### new Mime(typeMap, ... more maps)

Most users of this module will not need to create Mime instances directly.
However if you would like to create custom mappings, you may do so as follows
...

```javascript --run default
// Import Mime class
import { Mime } from 'mime';

// Define mime type -> extensions map
const typeMap = {
  'text/abc': ['abc', 'alpha', 'bet'],
  'text/def': ['leppard'],
};

// Create and use Mime instance
const myMime = new Mime(typeMap);
myMime.getType('abc'); // RESULT
myMime.getExtension('text/def'); // RESULT
```

If more than one map argument is provided, each map is `define()`ed (see below), in order.

### `mime.define(typeMap[, force = false])`

Define [more] type mappings.

`typeMap` is a map of MIME type -> extensions, as documented in `new Mime`, above.

Attempting to map a type to an already-defined extension will `throw` unless the `force` argument is set to `true`.

```javascript --run default
mime.define({ 'text/x-abc': ['abc', 'abcd'] });

mime.getType('abcd'); // RESULT
mime.getExtension('text/x-abc'); // RESULT
```

## Command Line

### Extension -> type

    $ mime scripts/jquery.js
    application/javascript

### Type -> extension

    $ npx mime -r image/jpeg
    jpeg
