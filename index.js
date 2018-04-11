'use strict';

var Mime = require('./Mime');
var standardTypes = require('./types/standard');
var otherTypes = require('./types/other');

module.exports = Mime(standardTypes, otherTypes);
