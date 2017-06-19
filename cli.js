#!/usr/bin/env node

var mime = require('./mime.js');
var file = process.argv[2];
var type = mime.getType(file);

process.stdout.write(type + '\n');

