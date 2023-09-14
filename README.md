<!--
  -- This file is auto-generated from src/README_js.md. Changes should be made there.
  -->
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

```javascript
import mime from 'mime';

mime.getType('txt');                    // ⇨ 'text/plain'
mime.getExtension('text/plain');        // ⇨ 'txt'
```

See [Mime API](#mime-api) below for API details.

## Lite Version

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
Markdown generated from [src/README_js.md](src/README_js.md) by [![RunMD Logo](https://i.imgur.com/h0FVyzU.png)](https://github.com/broofa/runmd)
