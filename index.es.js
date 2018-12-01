'use strict';

var Mime = require('./Mime');

exports._default = new Mime(require('./types/standard'), require('./types/other'));
exports.default = exports._default;
