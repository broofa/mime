'use strict';

var Mime = require('./Mime');
module.exports = new Mime(require('./types/standard.json'), require('./types/other.json'));
