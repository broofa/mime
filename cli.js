#!/usr/bin/env node

'use strict';

process.title = 'mime';
var mime = require('.');
var pkg = require('./package.json');
var args = process.argv.splice(2);
if (args.includes('--version') || args.includes('-v')) {
  console.log(pkg.version);
  process.exit(0);
}
else if (args.includes('--name')) {
  console.log('mime');
  process.exit(0);
}
var file = process.argv[2];
var type = mime.getType(file);

process.stdout.write(type + '\n');

