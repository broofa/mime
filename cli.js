#!/usr/bin/env node

'use strict';

var mime = require('./index');
var file = process.argv[2];
var type = mime.getType(file);

process.stdout.write(type + '\n');

